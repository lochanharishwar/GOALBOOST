import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, Trash2, Clock, Smartphone, BellRing, Volume2, VolumeX, CheckCircle2, AlertCircle } from 'lucide-react';
import { SoundButton } from '@/components/SoundButton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useClickSound, playBellSound } from '@/utils/soundUtils';
import { useTheme } from '@/contexts/ThemeContext';

interface Reminder {
  id: string;
  text: string;
  time: string;
  isActive: boolean;
  createdAt: string;
  hasDeviceAlarm: boolean;
}

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [ringingReminderId, setRingingReminderId] = useState<string | null>(null);
  const { toast } = useToast();
  const { playClickSound } = useClickSound();
  const { isDarkMode } = useTheme();
  
  const alarmContextRef = useRef<AudioContext | null>(null);
  const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Request notification permissions and load saved data
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }

    try {
      const savedReminders = localStorage.getItem('goalflow-reminders');
      const savedTheme = localStorage.getItem('goalflow-theme');
      
      if (savedReminders) {
        const parsedReminders = JSON.parse(savedReminders);
        const migratedReminders = parsedReminders.map((reminder: any) => ({
          ...reminder,
          hasDeviceAlarm: reminder.hasDeviceAlarm ?? false
        }));
        setReminders(Array.isArray(migratedReminders) ? migratedReminders : []);
      }
    } catch (error) {
      console.warn('Failed to load saved reminders:', error);
      localStorage.removeItem('goalflow-reminders');
    }
  }, []);

  // Save reminders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('goalflow-reminders', JSON.stringify(reminders));
    } catch (error) {
      console.warn('Failed to save reminders:', error);
    }
  }, [reminders]);

  // Save theme preference
  useEffect(() => {
    try {
      localStorage.setItem('goalflow-theme', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.warn('Failed to save theme:', error);
    }
  }, [isDarkMode]);

  // Continuous alarm sound
  const playAlarmSound = useCallback(() => {
    try {
      if (!alarmContextRef.current) {
        alarmContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = alarmContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const sampleRate = ctx.sampleRate;
      const duration = 1.0;
      const length = sampleRate * duration;
      const buffer = ctx.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const cycle = Math.floor(t * 4) % 2;
        const frequency = cycle === 0 ? 800 : 1000;
        const envelope = Math.sin(Math.PI * (t % 0.25) / 0.25);
        data[i] = envelope * Math.sin(2 * Math.PI * frequency * t) * 0.6;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    } catch (error) {
      console.log('Error playing alarm:', error);
    }
  }, []);

  const stopAlarm = useCallback(() => {
    setRingingReminderId(null);
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  }, []);

  const startAlarm = useCallback((reminderId: string) => {
    setRingingReminderId(reminderId);
    playAlarmSound();
    alarmIntervalRef.current = setInterval(() => {
      playAlarmSound();
    }, 1200);
  }, [playAlarmSound]);

  // Check reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      
      reminders.forEach(reminder => {
        if (reminder.isActive && reminder.time === currentTime && ringingReminderId !== reminder.id) {
          if (reminder.hasDeviceAlarm && notificationPermission === 'granted') {
            showNativeNotification(reminder);
          }
          
          startAlarm(reminder.id);
          
          toast({
            title: "🔔 Reminder!",
            description: reminder.text,
            duration: 10000,
          });
        }
      });
    };

    const interval = setInterval(checkReminders, 1000);
    return () => clearInterval(interval);
  }, [reminders, toast, notificationPermission, ringingReminderId, startAlarm]);

  const showNativeNotification = (reminder: Reminder) => {
    if ('Notification' in window && notificationPermission === 'granted') {
      const notification = new Notification('🔔 GoalBoost Reminder', {
        body: reminder.text,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: reminder.id,
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        stopAlarm();
        notification.close();
      };
    }
  };

  const addReminder = () => {
    if (newReminderText.trim() && newReminderTime) {
      playClickSound();
      const newReminder: Reminder = {
        id: crypto.randomUUID(),
        text: newReminderText.trim(),
        time: newReminderTime,
        isActive: true,
        createdAt: new Date().toISOString(),
        hasDeviceAlarm: notificationPermission === 'granted'
      };
      setReminders([...reminders, newReminder]);
      setNewReminderText('');
      setNewReminderTime('');
      
      toast({
        title: "⏰ Reminder Set!",
        description: `Reminder set for ${newReminderTime}${notificationPermission === 'granted' ? ' with device alarm' : ''}`,
      });
    }
  };

  const toggleReminder = (reminderId: string) => {
    playClickSound();
    setReminders(reminders.map(reminder =>
      reminder.id === reminderId 
        ? { ...reminder, isActive: !reminder.isActive }
        : reminder
    ));
  };

  const toggleDeviceAlarm = (reminderId: string) => {
    playClickSound();
    if (notificationPermission !== 'granted') {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
        if (permission === 'granted') {
          setReminders(reminders.map(reminder =>
            reminder.id === reminderId 
              ? { ...reminder, hasDeviceAlarm: !reminder.hasDeviceAlarm }
              : reminder
          ));
        }
      });
    } else {
      setReminders(reminders.map(reminder =>
        reminder.id === reminderId 
          ? { ...reminder, hasDeviceAlarm: !reminder.hasDeviceAlarm }
          : reminder
      ));
    }
  };

  const deleteReminder = (reminderId: string) => {
    playClickSound();
    if (ringingReminderId === reminderId) {
      stopAlarm();
    }
    setReminders(reminders.filter(reminder => reminder.id !== reminderId));
    toast({
      title: "🗑️ Reminder Deleted",
      description: "Reminder has been removed.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addReminder();
    }
  };

  const activeReminders = reminders.filter(r => r.isActive).length;
  const totalReminders = reminders.length;

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-all duration-500",
      isDarkMode 
        ? "bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-950" 
        : "bg-gradient-to-br from-violet-50 via-indigo-50 to-slate-100"
    )}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute top-20 -right-20 w-96 h-96 rounded-full blur-3xl",
          isDarkMode ? "bg-violet-600/10" : "bg-violet-400/20"
        )} />
        <div className={cn(
          "absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl",
          isDarkMode ? "bg-indigo-600/10" : "bg-indigo-400/20"
        )} />
      </div>

      <Header />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="mb-10 text-center">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4",
            isDarkMode ? "bg-violet-500/20 border border-violet-500/30" : "bg-violet-100 border border-violet-200"
          )}>
            <Bell className={cn("h-4 w-4", isDarkMode ? "text-violet-400" : "text-violet-600")} />
            <span className={cn("text-sm font-medium", isDarkMode ? "text-violet-300" : "text-violet-700")}>
              {activeReminders} of {totalReminders} reminders active
            </span>
          </div>
          <h1 className={cn(
            "text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight",
            isDarkMode ? "text-white" : "text-slate-900"
          )}>
            Smart <span className={cn(
              "bg-clip-text text-transparent",
              isDarkMode 
                ? "bg-gradient-to-r from-violet-400 to-indigo-400" 
                : "bg-gradient-to-r from-violet-600 to-indigo-600"
            )}>Reminders</span>
          </h1>
          <p className={cn(
            "text-lg sm:text-xl max-w-2xl mx-auto",
            isDarkMode ? "text-slate-400" : "text-slate-600"
          )}>
            Never miss what matters most to you with continuous alarms
          </p>
        </div>

        {/* Notification Permission Banner */}
        {notificationPermission !== 'granted' && (
          <Card className={cn(
            "mb-6 shadow-xl border-0 backdrop-blur-xl",
            isDarkMode 
              ? "bg-amber-500/10 border border-amber-500/30" 
              : "bg-amber-50 border border-amber-200"
          )}>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={cn(
                  "p-3 rounded-xl shrink-0",
                  isDarkMode ? "bg-amber-500/20" : "bg-amber-100"
                )}>
                  <AlertCircle className={cn("h-6 w-6", isDarkMode ? "text-amber-400" : "text-amber-600")} />
                </div>
                <div className="flex-1">
                  <p className={cn("font-semibold", isDarkMode ? "text-amber-200" : "text-amber-800")}>
                    Enable Device Notifications
                  </p>
                  <p className={cn("text-sm", isDarkMode ? "text-amber-300/70" : "text-amber-700/70")}>
                    Get reminded even when the app is in the background
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    playClickSound();
                    if ('Notification' in window) {
                      Notification.requestPermission().then(permission => {
                        setNotificationPermission(permission);
                        if (permission === 'granted') {
                          toast({
                            title: "🔔 Notifications Enabled!",
                            description: "You'll now receive device alarms.",
                          });
                        }
                      });
                    }
                  }}
                  className={cn(
                    "shrink-0",
                    isDarkMode 
                      ? "bg-amber-500 hover:bg-amber-400 text-black" 
                      : "bg-amber-500 hover:bg-amber-600 text-white"
                  )}
                >
                  Enable Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add New Reminder */}
        <Card className={cn(
          "mb-8 shadow-2xl border-0 backdrop-blur-xl overflow-hidden",
          isDarkMode 
            ? "bg-white/5 border border-white/10" 
            : "bg-white/80 border border-slate-200"
        )}>
          <CardHeader className="pb-2 pt-6 px-6">
            <CardTitle className={cn(
              "flex items-center gap-3 text-xl",
              isDarkMode ? "text-white" : "text-slate-900"
            )}>
              <div className={cn(
                "p-2 rounded-lg",
                isDarkMode ? "bg-violet-500/20" : "bg-violet-100"
              )}>
                <Plus className={cn("h-5 w-5", isDarkMode ? "text-violet-400" : "text-violet-600")} />
              </div>
              New Reminder
              {notificationPermission === 'granted' && (
                <Badge className={cn(
                  "ml-auto text-xs",
                  isDarkMode 
                    ? "bg-green-500/20 text-green-300 border-green-500/30" 
                    : "bg-green-100 text-green-700 border-green-200"
                )}>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Alarms Enabled
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={newReminderText}
                onChange={(e) => setNewReminderText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What should I remind you about?"
                className={cn(
                  "flex-1 h-12 text-base",
                  isDarkMode 
                    ? "bg-black/30 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500/50" 
                    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-400"
                )}
              />
              <Input
                type="time"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                className={cn(
                  "h-12 sm:w-36",
                  isDarkMode 
                    ? "bg-black/30 border-white/10 text-white focus:border-violet-500/50" 
                    : "bg-white border-slate-200 text-slate-900 focus:border-violet-400"
                )}
              />
              <SoundButton 
                onClick={addReminder}
                disabled={!newReminderText.trim() || !newReminderTime}
                className={cn(
                  "h-12 px-6 font-medium transition-all",
                  isDarkMode 
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white disabled:opacity-50" 
                    : "bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white disabled:opacity-50"
                )}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add
              </SoundButton>
            </div>
          </CardContent>
        </Card>

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.length === 0 ? (
            <Card className={cn(
              "shadow-xl border-0 backdrop-blur-xl",
              isDarkMode 
                ? "bg-white/5 border border-white/10" 
                : "bg-white/80 border border-slate-200"
            )}>
              <CardContent className="text-center py-16">
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
                  isDarkMode ? "bg-violet-500/20" : "bg-violet-100"
                )}>
                  <Clock className={cn("h-10 w-10", isDarkMode ? "text-violet-400" : "text-violet-600")} />
                </div>
                <p className={cn(
                  "text-xl font-semibold mb-2",
                  isDarkMode ? "text-white" : "text-slate-900"
                )}>
                  No reminders yet
                </p>
                <p className={cn(
                  "text-base",
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                )}>
                  Create your first reminder to stay on track
                </p>
              </CardContent>
            </Card>
          ) : (
            reminders.map((reminder) => {
              const isRinging = ringingReminderId === reminder.id;
              
              return (
                <Card 
                  key={reminder.id} 
                  className={cn(
                    "shadow-xl border-0 backdrop-blur-xl transition-all duration-300",
                    isRinging 
                      ? "bg-red-500/20 border-2 border-red-500/50 animate-pulse" 
                      : isDarkMode 
                        ? "bg-white/5 border border-white/10 hover:bg-white/10" 
                        : "bg-white/80 border border-slate-200 hover:shadow-2xl"
                  )}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                      {/* Toggle Button */}
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className={cn(
                          "w-7 h-7 rounded-full border-2 transition-all duration-300 shrink-0 flex items-center justify-center",
                          reminder.isActive 
                            ? isDarkMode 
                              ? "bg-violet-500 border-violet-400" 
                              : "bg-violet-500 border-violet-400"
                            : isDarkMode 
                              ? "border-slate-600 hover:border-slate-400" 
                              : "border-slate-300 hover:border-slate-400"
                        )}
                      >
                        {reminder.isActive && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </button>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium text-lg truncate transition-all",
                          reminder.isActive 
                            ? isDarkMode ? "text-white" : "text-slate-900"
                            : isDarkMode ? "text-slate-500 line-through" : "text-slate-400 line-through"
                        )}>
                          {reminder.text}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge className={cn(
                            "font-medium",
                            isDarkMode 
                              ? "bg-violet-500/20 text-violet-300 border-violet-500/30" 
                              : "bg-violet-100 text-violet-700 border-violet-200"
                          )}>
                            <Clock className="h-3 w-3 mr-1" />
                            {reminder.time}
                          </Badge>
                          
                          {isRinging ? (
                            <Badge 
                              onClick={stopAlarm}
                              className="bg-red-500/30 text-red-300 border-red-500/50 cursor-pointer hover:bg-red-500/40 animate-bounce"
                            >
                              <Volume2 className="h-3 w-3 mr-1" />
                              Click to Stop
                            </Badge>
                          ) : (
                            <Badge 
                              className={cn(
                                "cursor-pointer transition-all",
                                reminder.hasDeviceAlarm && notificationPermission === 'granted'
                                  ? isDarkMode
                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"
                                    : "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200"
                                  : isDarkMode
                                    ? "bg-slate-500/20 text-slate-400 border-slate-500/30 hover:bg-slate-500/30"
                                    : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                              )}
                              onClick={() => toggleDeviceAlarm(reminder.id)}
                            >
                              {reminder.hasDeviceAlarm && notificationPermission === 'granted' ? (
                                <>
                                  <BellRing className="h-3 w-3 mr-1" />
                                  Alarm On
                                </>
                              ) : (
                                <>
                                  <VolumeX className="h-3 w-3 mr-1" />
                                  No Alarm
                                </>
                              )}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Delete Button */}
                      <SoundButton
                        onClick={() => deleteReminder(reminder.id)}
                        size="sm"
                        variant="ghost"
                        className={cn(
                          "shrink-0 rounded-lg",
                          isDarkMode 
                            ? "text-red-400 hover:text-red-300 hover:bg-red-500/20" 
                            : "text-red-500 hover:text-red-600 hover:bg-red-100"
                        )}
                      >
                        <Trash2 className="h-5 w-5" />
                      </SoundButton>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminders;