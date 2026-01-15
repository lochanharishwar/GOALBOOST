import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Play, Square, RotateCcw, AlertTriangle, CheckCircle2, Zap, Target, Activity, Video, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { exercises } from '@/data/exercises';
import { Exercise } from '@/types/exercise';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FeedbackItem {
  type: 'correct' | 'warning' | 'error';
  message: string;
  timestamp: number;
}

const AIExerciseCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [currentForm, setCurrentForm] = useState<'good' | 'warning' | 'bad' | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [analysisInterval, setAnalysisIntervalState] = useState<NodeJS.Timeout | null>(null);
  const [lastAnalysisTime, setLastAnalysisTime] = useState(0);

  const selectedExerciseData = exercises.find(e => e.id === selectedExercise);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Unable to access camera. Please ensure camera permissions are granted.');
      toast.error('Camera access denied or unavailable');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    stopAnalysis();
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.7);
  };

  const analyzeFrame = async () => {
    if (!selectedExercise || !isStreaming) return;
    
    const now = Date.now();
    if (now - lastAnalysisTime < 3000) return; // Throttle to every 3 seconds
    
    setLastAnalysisTime(now);
    
    const frameData = captureFrame();
    if (!frameData) return;

    try {
      const { data, error } = await supabase.functions.invoke('analyze-exercise', {
        body: {
          imageData: frameData,
          exerciseId: selectedExercise,
          exerciseName: selectedExerciseData?.name || '',
          exerciseSteps: selectedExerciseData?.steps || []
        }
      });

      if (error) {
        console.error('Analysis error:', error);
        return;
      }

      if (data) {
        // Update rep count if a rep was completed
        if (data.repCompleted) {
          setRepCount(prev => prev + 1);
          addFeedback('correct', 'Rep completed! Great job!');
        }

        // Update form quality
        if (data.formQuality) {
          setCurrentForm(data.formQuality);
        }

        // Add feedback messages
        if (data.feedback && data.feedback.length > 0) {
          data.feedback.forEach((fb: { type: string; message: string }) => {
            addFeedback(fb.type as 'correct' | 'warning' | 'error', fb.message);
          });
        }
      }
    } catch (err) {
      console.error('Failed to analyze frame:', err);
    }
  };

  const addFeedback = (type: 'correct' | 'warning' | 'error', message: string) => {
    setFeedback(prev => {
      const newFeedback = { type, message, timestamp: Date.now() };
      // Keep only last 5 feedback items
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
    
    // Start periodic analysis
    const interval = setInterval(analyzeFrame, 3000);
    setAnalysisIntervalState(interval);
    
    toast.success('AI analysis started! Position yourself in frame.');
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
    if (analysisInterval) {
      clearInterval(analysisInterval);
      setAnalysisIntervalState(null);
    }
  };

  const resetSession = () => {
    setRepCount(0);
    setFeedback([]);
    setCurrentForm(null);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getFormColor = () => {
    switch (currentForm) {
      case 'good': return 'text-green-500 border-green-500';
      case 'warning': return 'text-yellow-500 border-yellow-500';
      case 'bad': return 'text-red-500 border-red-500';
      default: return 'text-muted-foreground border-muted';
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

  return (
    <Card className="glass-bold border-2 border-primary/20 overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-success" />
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20">
            <Eye className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-foreground">AI Exercise Coach</CardTitle>
            <p className="text-sm text-muted-foreground">Real-time form analysis & rep counting</p>
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
            <SelectContent className="bg-background border-2 max-h-60">
              {exercises.map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Camera View */}
        <div className="relative aspect-video bg-black/50 rounded-xl overflow-hidden border-2 border-muted">
          <video
            ref={videoRef}
            className={cn(
              "w-full h-full object-cover",
              !isStreaming && "hidden"
            )}
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {!isStreaming && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="p-4 rounded-full bg-muted/20">
                <Video className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-center px-4">
                {cameraError || 'Click "Start Camera" to begin'}
              </p>
            </div>
          )}

          {/* Overlay Stats */}
          {isStreaming && isAnalyzing && (
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <Badge className={cn("text-lg font-bold px-4 py-2 border-2", getFormColor())}>
                {getFormIcon()}
                <span className="ml-2">{currentForm ? currentForm.toUpperCase() : 'ANALYZING'}</span>
              </Badge>
              <Badge className="text-lg font-bold px-4 py-2 bg-primary text-primary-foreground">
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

        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          {!isStreaming ? (
            <Button 
              onClick={startCamera}
              className="flex-1 gradient-primary text-primary-foreground font-bold"
            >
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
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

        {/* Stats Display */}
        {(repCount > 0 || feedback.length > 0) && (
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-black text-primary">{repCount}</p>
                <p className="text-sm font-semibold text-muted-foreground">Reps Completed</p>
              </CardContent>
            </Card>
            <Card className="bg-accent/10 border-accent/20">
              <CardContent className="p-4 text-center">
                {getFormIcon()}
                <p className="text-xl font-bold mt-2 capitalize text-foreground">
                  {currentForm || 'Waiting...'}
                </p>
                <p className="text-sm font-semibold text-muted-foreground">Current Form</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feedback Log */}
        {feedback.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Live Feedback
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {feedback.map((item, index) => (
                <div 
                  key={item.timestamp + index}
                  className={cn(
                    "p-3 rounded-lg border-l-4 text-sm font-medium animate-fade-in",
                    item.type === 'correct' && "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400",
                    item.type === 'warning' && "bg-yellow-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400",
                    item.type === 'error' && "bg-red-500/10 border-red-500 text-red-700 dark:text-red-400"
                  )}
                >
                  {item.type === 'correct' && <CheckCircle2 className="h-4 w-4 inline mr-2" />}
                  {item.type === 'warning' && <AlertTriangle className="h-4 w-4 inline mr-2" />}
                  {item.type === 'error' && <AlertTriangle className="h-4 w-4 inline mr-2" />}
                  {item.message}
                </div>
              ))}
            </div>
          </div>
        )}

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
