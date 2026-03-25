import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Camera, Play, Square, RotateCcw, AlertTriangle, CheckCircle2, Zap, Target, Activity, Video, Eye, Volume2, VolumeX, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { exercises } from '@/data/exercises';
import { Exercise } from '@/types/exercise';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { voiceFeedback } from '@/utils/voiceFeedback';
import { useWorkoutPlan } from '@/contexts/WorkoutPlanContext';

interface FeedbackItem {
  type: 'correct' | 'warning' | 'error';
  message: string;
  timestamp: number;
}

interface BodyPartTracking {
  leftArm: string;
  rightArm: string;
  leftLeg: string;
  rightLeg: string;
  spine: string;
  overall: string;
}

const AIExerciseCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const { selectedExerciseForCoach, setSelectedExerciseForCoach } = useWorkoutPlan();
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [currentForm, setCurrentForm] = useState<'good' | 'warning' | 'bad' | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastAnalysisTime, setLastAnalysisTime] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [bodyTracking, setBodyTracking] = useState<BodyPartTracking | null>(null);
  const [consecutiveGoodReps, setConsecutiveGoodReps] = useState(0);
  
  // Sync with context when exercise is selected from AI recommendations
  useEffect(() => {
    if (selectedExerciseForCoach && selectedExerciseForCoach !== selectedExercise) {
      setSelectedExercise(selectedExerciseForCoach);
      toast.success(`Exercise "${exercises.find(e => e.id === selectedExerciseForCoach)?.name}" selected. Start your camera to begin!`);
    }
  }, [selectedExerciseForCoach]);
  
  // Update context when local selection changes
  useEffect(() => {
    if (selectedExercise && selectedExercise !== selectedExerciseForCoach) {
      setSelectedExerciseForCoach(selectedExercise);
    }
  }, [selectedExercise]);

  const selectedExerciseData = exercises.find(e => e.id === selectedExercise);

  // Get available cameras
  const getAvailableCameras = async () => {
    try {
      // Request permission first to get device labels
      await navigator.mediaDevices.getUserMedia({ video: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
      return videoDevices;
    } catch (error) {
      console.error('Error getting cameras:', error);
      return [];
    }
  };

  useEffect(() => {
    getAvailableCameras();
    voiceFeedback.setEnabled(voiceEnabled);
  }, []);

  useEffect(() => {
    voiceFeedback.setEnabled(voiceEnabled);
  }, [voiceEnabled]);

  const startCamera = async () => {
    try {
      setIsLoadingCamera(true);
      setCameraError(null);
      
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Get cameras if not already loaded
      const cameras = availableCameras.length > 0 ? availableCameras : await getAvailableCameras();
      
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 },
          facingMode: selectedCamera ? undefined : 'user'
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        
        await new Promise((resolve, reject) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play()
                .then(resolve)
                .catch(reject);
            };
            videoRef.current.onerror = reject;
          }
        });
        
        setIsStreaming(true);
        toast.success('Camera connected successfully!');
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Unable to access camera.';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found. Please connect a camera and try again.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Camera is in use by another application. Please close other apps using the camera.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera does not meet requirements. Trying with default settings...';
        // Retry with simpler constraints
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: false 
          });
          streamRef.current = fallbackStream;
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            await videoRef.current.play();
            setIsStreaming(true);
            toast.success('Camera connected with fallback settings');
            return;
          }
        } catch (fallbackError) {
          errorMessage = 'Unable to access camera with any settings.';
        }
      }
      
      setCameraError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoadingCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    stopAnalysis();
  };

  const switchCamera = async () => {
    const currentIndex = availableCameras.findIndex(c => c.deviceId === selectedCamera);
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    setSelectedCamera(availableCameras[nextIndex].deviceId);
    
    if (isStreaming) {
      await stopCamera();
      setTimeout(() => startCamera(), 100);
    }
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx || video.readyState < 2) return null;
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // Mirror the image for better user experience
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const analyzeFrame = useCallback(async () => {
    if (!selectedExercise || !isStreaming || !isAnalyzing) return;
    
    const now = Date.now();
    if (now - lastAnalysisTime < 2500) return; // Throttle to every 2.5 seconds
    
    setLastAnalysisTime(now);
    
    const frameData = captureFrame();
    if (!frameData) {
      console.log('Failed to capture frame');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('analyze-exercise', {
        body: {
          imageData: frameData,
          exerciseId: selectedExercise,
          exerciseName: selectedExerciseData?.name || '',
          exerciseSteps: selectedExerciseData?.steps || [],
          trackBodyParts: true
        }
      });

      if (error) {
        console.error('Analysis error:', error);
        return;
      }

      if (data) {
        // Update body part tracking
        if (data.bodyTracking) {
          setBodyTracking(data.bodyTracking);
        }

        // Update rep count if a rep was completed
        if (data.repCompleted) {
          setRepCount(prev => {
            const newCount = prev + 1;
            voiceFeedback.speakRepComplete(newCount);
            return newCount;
          });
          addFeedback('correct', 'Rep completed! Great job!');
          
          // Track consecutive good form reps
          if (data.formQuality === 'good') {
            setConsecutiveGoodReps(prev => {
              const newCount = prev + 1;
              if (newCount === 3 || newCount === 5 || newCount === 10) {
                voiceFeedback.speakEncouragement();
              }
              return newCount;
            });
          } else {
            setConsecutiveGoodReps(0);
          }
        }

        // Update form quality
        if (data.formQuality) {
          setCurrentForm(data.formQuality);
        }

        // Add feedback messages with voice
        if (data.feedback && data.feedback.length > 0) {
          data.feedback.forEach((fb: { type: string; message: string }) => {
            addFeedback(fb.type as 'correct' | 'warning' | 'error', fb.message);
            
            // Speak corrections and warnings
            if (fb.type === 'warning' || fb.type === 'error') {
              voiceFeedback.speakFormCorrection(fb.message);
            }
          });
        }
      }
    } catch (err) {
      console.error('Failed to analyze frame:', err);
    }
  }, [selectedExercise, isStreaming, isAnalyzing, lastAnalysisTime, selectedExerciseData]);

  const addFeedback = (type: 'correct' | 'warning' | 'error', message: string) => {
    setFeedback(prev => {
      const newFeedback = { type, message, timestamp: Date.now() };
      return [newFeedback, ...prev.slice(0, 4)];
    });
  };

  const startAnalysis = () => {
    if (!selectedExercise) {
      toast.error('Please select an exercise first');
      return;
    }
    
    setIsAnalyzing(true);
    setRepCount(0);
    setFeedback([]);
    setCurrentForm(null);
    setBodyTracking(null);
    setConsecutiveGoodReps(0);
    
    voiceFeedback.speakStart();
    
    // Start periodic analysis
    analysisIntervalRef.current = setInterval(() => {
      analyzeFrame();
    }, 2500);
    
    toast.success('AI analysis started! Position yourself in frame.');
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    
    if (repCount > 0) {
      voiceFeedback.speakStop();
    }
  };

  const resetSession = () => {
    setRepCount(0);
    setFeedback([]);
    setCurrentForm(null);
    setBodyTracking(null);
    setConsecutiveGoodReps(0);
    voiceFeedback.stop();
  };

  useEffect(() => {
    return () => {
      stopCamera();
      voiceFeedback.stop();
    };
  }, []);

  // Update analysis interval when dependencies change
  useEffect(() => {
    if (isAnalyzing && analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = setInterval(() => {
        analyzeFrame();
      }, 2500);
    }
  }, [analyzeFrame, isAnalyzing]);

  const getFormColor = () => {
    switch (currentForm) {
      case 'good': return 'text-green-500 border-green-500 bg-green-500/20';
      case 'warning': return 'text-yellow-500 border-yellow-500 bg-yellow-500/20';
      case 'bad': return 'text-red-500 border-red-500 bg-red-500/20';
      default: return 'text-muted-foreground border-muted bg-muted/20';
    }
  };

  const getFormIcon = () => {
    switch (currentForm) {
      case 'good': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'bad': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getBodyPartStatus = (status: string) => {
    if (status.toLowerCase().includes('good') || status.toLowerCase().includes('correct')) {
      return 'bg-green-500/20 text-green-600 border-green-500/30';
    }
    if (status.toLowerCase().includes('warning') || status.toLowerCase().includes('adjust')) {
      return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
    }
    if (status.toLowerCase().includes('error') || status.toLowerCase().includes('incorrect')) {
      return 'bg-red-500/20 text-red-600 border-red-500/30';
    }
    return 'bg-muted/20 text-muted-foreground border-muted/30';
  };

  return (
    <Card id="ai-exercise-coach" className="glass-bold border-2 border-primary/20 overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-success" />
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">AI Exercise Coach</CardTitle>
              <p className="text-sm text-muted-foreground">Real-time form analysis & rep counting</p>
            </div>
          </div>
          
          {/* Voice Toggle */}
          <div className="flex items-center gap-2">
            {voiceEnabled ? (
              <Volume2 className="h-5 w-5 text-primary" />
            ) : (
              <VolumeX className="h-5 w-5 text-muted-foreground" />
            )}
            <Switch
              checked={voiceEnabled}
              onCheckedChange={setVoiceEnabled}
              aria-label="Toggle voice feedback"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Exercise Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">Select Exercise</label>
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger className="w-full bg-background border-2">
              <SelectValue placeholder="Choose an exercise to track" />
            </SelectTrigger>
            <SelectContent className="bg-background border-2 max-h-60 z-50">
              {exercises.map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Camera Selection */}
        {availableCameras.length > 1 && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Camera</label>
            <Select value={selectedCamera} onValueChange={setSelectedCamera}>
              <SelectTrigger className="w-full bg-background border-2">
                <SelectValue placeholder="Select camera" />
              </SelectTrigger>
              <SelectContent className="bg-background border-2 z-50">
                {availableCameras.map((camera) => (
                  <SelectItem key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${availableCameras.indexOf(camera) + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Camera + Live Feedback Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Camera View - Takes 2/3 on large screens */}
          <div className="lg:col-span-2 relative aspect-video bg-black/50 rounded-xl overflow-hidden border-2 border-muted">
            <video
              ref={videoRef}
              className={cn(
                "w-full h-full object-cover",
                isStreaming ? "block" : "hidden"
              )}
              style={{ transform: 'scaleX(-1)' }}
              playsInline
              muted
              autoPlay
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {!isStreaming && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
                {isLoadingCamera ? (
                  <>
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <p className="text-muted-foreground text-center">Connecting to camera...</p>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-full bg-muted/20">
                      <Video className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-center px-4">
                      {cameraError || 'Click "Start Camera" to begin'}
                    </p>
                    {cameraError && (
                      <Button variant="outline" size="sm" onClick={() => {
                        setCameraError(null);
                        getAvailableCameras();
                      }}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Overlay Stats */}
            {isStreaming && isAnalyzing && (
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <Badge className={cn("text-lg font-bold px-4 py-2 border-2", getFormColor())}>
                  {getFormIcon()}
                  <span className="ml-2">{currentForm ? currentForm.toUpperCase() : 'ANALYZING'}</span>
                </Badge>
                <Badge className="text-lg font-bold px-4 py-2 bg-primary text-primary-foreground border-2 border-primary">
                  <Target className="h-4 w-4 mr-2" />
                  {repCount} REPS
                </Badge>
              </div>
            )}

            {/* Recording Indicator */}
            {isAnalyzing && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-sm font-semibold drop-shadow-lg">ANALYZING</span>
              </div>
            )}
          </div>

          {/* Live Feedback Panel - Takes 1/3 on large screens */}
          <div className="lg:col-span-1 space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-2">
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="p-3 text-center">
                  <Zap className="h-6 w-6 mx-auto mb-1 text-primary" />
                  <p className="text-2xl font-black text-primary">{repCount}</p>
                  <p className="text-xs font-semibold text-muted-foreground">Reps</p>
                </CardContent>
              </Card>
              <Card className="bg-accent/10 border-accent/20">
                <CardContent className="p-3 text-center">
                  {getFormIcon()}
                  <p className="text-lg font-bold mt-1 capitalize text-foreground">
                    {currentForm || 'Ready'}
                  </p>
                  <p className="text-xs font-semibold text-muted-foreground">Form</p>
                </CardContent>
              </Card>
            </div>

            {/* Body Part Tracking */}
            {bodyTracking && isAnalyzing && (
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  Body Tracking
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {bodyTracking.leftArm && (
                    <div className={cn("p-1.5 rounded-lg border text-xs font-medium text-center", getBodyPartStatus(bodyTracking.leftArm))}>
                      <div className="font-bold text-[10px]">Left Arm</div>
                      <div className="truncate text-[10px]">{bodyTracking.leftArm}</div>
                    </div>
                  )}
                  {bodyTracking.rightArm && (
                    <div className={cn("p-1.5 rounded-lg border text-xs font-medium text-center", getBodyPartStatus(bodyTracking.rightArm))}>
                      <div className="font-bold text-[10px]">Right Arm</div>
                      <div className="truncate text-[10px]">{bodyTracking.rightArm}</div>
                    </div>
                  )}
                  {bodyTracking.leftLeg && (
                    <div className={cn("p-1.5 rounded-lg border text-xs font-medium text-center", getBodyPartStatus(bodyTracking.leftLeg))}>
                      <div className="font-bold text-[10px]">Left Leg</div>
                      <div className="truncate text-[10px]">{bodyTracking.leftLeg}</div>
                    </div>
                  )}
                  {bodyTracking.rightLeg && (
                    <div className={cn("p-1.5 rounded-lg border text-xs font-medium text-center", getBodyPartStatus(bodyTracking.rightLeg))}>
                      <div className="font-bold text-[10px]">Right Leg</div>
                      <div className="truncate text-[10px]">{bodyTracking.rightLeg}</div>
                    </div>
                  )}
                  {bodyTracking.spine && (
                    <div className={cn("p-1.5 rounded-lg border text-xs font-medium text-center col-span-2", getBodyPartStatus(bodyTracking.spine))}>
                      <div className="font-bold text-[10px]">Spine/Posture</div>
                      <div className="truncate text-[10px]">{bodyTracking.spine}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Live Feedback Log */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Activity className="h-3 w-3" />
                Live Feedback
              </h4>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {feedback.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic p-2 bg-muted/10 rounded-lg">
                    {isAnalyzing ? 'Analyzing your form...' : 'Start analysis to see feedback'}
                  </p>
                ) : (
                  feedback.map((item, index) => (
                    <div 
                      key={item.timestamp + index}
                      className={cn(
                        "p-2 rounded-lg border-l-4 text-xs font-medium animate-fade-in",
                        item.type === 'correct' && "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400",
                        item.type === 'warning' && "bg-yellow-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400",
                        item.type === 'error' && "bg-red-500/10 border-red-500 text-red-700 dark:text-red-400"
                      )}
                    >
                      {item.type === 'correct' && <CheckCircle2 className="h-3 w-3 inline mr-1" />}
                      {item.type === 'warning' && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                      {item.type === 'error' && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                      {item.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          {!isStreaming ? (
            <Button 
              onClick={startCamera}
              disabled={isLoadingCamera}
              className="flex-1 gradient-primary text-primary-foreground font-bold"
            >
              {isLoadingCamera ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Camera className="h-4 w-4 mr-2" />
              )}
              {isLoadingCamera ? 'Connecting...' : 'Start Camera'}
            </Button>
          ) : (
            <>
              <Button 
                onClick={stopCamera}
                variant="outline"
                className="border-2"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Camera
              </Button>
              
              {availableCameras.length > 1 && (
                <Button 
                  onClick={switchCamera}
                  variant="outline"
                  className="border-2"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
              
              {!isAnalyzing ? (
                <Button 
                  onClick={startAnalysis}
                  className="flex-1 gradient-accent text-accent-foreground font-bold"
                  disabled={!selectedExercise}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Analysis
                </Button>
              ) : (
                <Button 
                  onClick={stopAnalysis}
                  variant="destructive"
                  className="flex-1 font-bold"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop Analysis
                </Button>
              )}
              
              <Button 
                onClick={resetSession}
                variant="outline"
                className="border-2"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </>
          )}
        </div>

        {/* Selected Exercise Info */}
        {selectedExerciseData && (
          <div className="p-4 rounded-xl bg-muted/30 border">
            <h4 className="font-bold mb-2">{selectedExerciseData.name}</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Duration:</strong> {selectedExerciseData.duration}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedExerciseData.targetMuscles.map((muscle, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {muscle}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIExerciseCamera;
