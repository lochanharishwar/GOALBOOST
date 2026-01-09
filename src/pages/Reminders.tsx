import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Plus, Trash2, Clock, BellRing, Volume2, VolumeX, CheckCircle2, AlertCircle, Calendar, Tag, Flame, Star, Zap, Edit2, Save, X, Repeat } from 'lucide-react';
import { SoundButton } from '@/components/SoundButton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useClickSound } from '@/utils/soundUtils';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';

interface Reminder {
  id: string;
  text: string;
  time: string;
  isActive: boolean;
  createdAt: string;
  hasDeviceAlarm: boolean;
  repeatDays: string[];
  priority: 'low' | 'medium' | 'high';
  category: string;
  notes: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CATEGORIES = ['general', 'work', 'health', 'personal', 'study', 'fitness'];
const PRIORITIES = [
  { value: 'low', label: 'Low', icon: Star, color: 'green' },
  { value: 'medium', label: 'Medium', icon: Zap, color: 'yellow' },
  { value: 'high', label: 'High', icon: Flame, color: 'red' }
];

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');
  const [newReminderPriority, setNewReminderPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newReminderCategory, setNewReminderCategory] = useState('general');
  const [newReminderNotes, setNewReminderNotes] = useState('');
  const [newReminderRepeatDays, setNewReminderRepeatDays] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [ringingReminderId, setRingingReminderId] = useState<string | null>(null);
  const { toast } = useToast();
  const { playClickSound } = useClickSound();
  const { isDarkMode } = useTheme();
  
  const alarmContextRef = useRef<AudioContext | null>(null);
  const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load reminders from Supabase
  useEffect(() => {
    const loadReminders = async () => {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && !error) {
        setReminders(data.map(r => ({
          id: r.id,
          text: r.text,
          time: r.time,
          isActive: r.is_active,
          createdAt: r.created_at,
          hasDeviceAlarm: r.has_device_alarm,
          repeatDays: r.repeat_days || [],
          priority: (r.priority || 'medium') as 'low' | 'medium' | 'high',
          category: r.category || 'general',
          notes: r.notes || ''
        })));
      } else {
        // Fallback to localStorage
        try {
          const savedReminders = localStorage.getItem('goalflow-reminders');
          if (savedReminders) {
            const parsedReminders = JSON.parse(savedReminders);
            setReminders(parsedReminders.map((r: any) => ({
              ...r,
              repeatDays: r.repeatDays || [],
              priority: r.priority || 'medium',
              category: r.category || 'general',
              notes: r.notes || ''
            })));
          }
        } catch (error) {
          console.warn('Failed to load saved reminders:', error);
        }
      }
    };

    loadReminders();

    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  // Save to localStorage as backup
  useEffect(() => {
    try {
      localStorage.setItem('goalflow-reminders', JSON.stringify(reminders));
    } catch (error) {
      console.warn('Failed to save reminders:', error);
    }
  }, [reminders]);

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
      const currentDay = DAYS[now.getDay() === 0 ? 6 : now.getDay() - 1];
      
      reminders.forEach(reminder => {
        const shouldRing = reminder.repeatDays.length === 0 || reminder.repeatDays.includes(currentDay);
        
        if (reminder.isActive && reminder.time === currentTime && ringingReminderId !== reminder.id && shouldRing) {
          if (reminder.hasDeviceAlarm && notificationPermission === 'granted') {
            showNativeNotification(reminder);
          }
          
          startAlarm(reminder.id);
          
          toast({
            title: `🔔 ${reminder.priority === 'high' ? '🔥 URGENT: ' : ''}Reminder!`,
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
      const notification = new Notification(`🔔 ${reminder.priority === 'high' ? '🔥 URGENT: ' : ''}GoalBoost Reminder`, {
        body: `${reminder.text}${reminder.notes ? `\n📝 ${reminder.notes}` : ''}`,
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

  const addReminder = async () => {
    if (newReminderText.trim() && newReminderTime) {
      playClickSound();
      const newReminder: Reminder = {
        id: crypto.randomUUID(),
        text: newReminderText.trim(),
        time: newReminderTime,
        isActive: true,
        createdAt: new Date().toISOString(),
        hasDeviceAlarm: notificationPermission === 'granted',
        repeatDays: newReminderRepeatDays,
        priority: newReminderPriority,
        category: newReminderCategory,
        notes: newReminderNotes.trim()
      };

      // Save to Supabase
      const { error } = await supabase.from('reminders').insert({
        id: newReminder.id,
        text: newReminder.text,
        time: newReminder.time,
        is_active: newReminder.isActive,
        has_device_alarm: newReminder.hasDeviceAlarm,
        repeat_days: newReminder.repeatDays,
        priority: newReminder.priority,
        category: newReminder.category,
        notes: newReminder.notes
      });

      if (!error) {
        setReminders([newReminder, ...reminders]);
      } else {
        setReminders([newReminder, ...reminders]);
      }
      
      // Reset form
      setNewReminderText('');
      setNewReminderTime('');
      setNewReminderPriority('medium');
      setNewReminderCategory('general');
      setNewReminderNotes('');
      setNewReminderRepeatDays([]);
      setShowAdvanced(false);
      
      toast({
        title: "⏰ Reminder Set!",
        description: `Reminder set for ${newReminderTime}${newReminderRepeatDays.length > 0 ? ` on ${newReminderRepeatDays.join(', ')}` : ''}`,
      });
    }
  };

  const toggleReminder = async (reminderId: string) => {
    playClickSound();
    const updated = reminders.map(reminder =>
      reminder.id === reminderId 
        ? { ...reminder, isActive: !reminder.isActive }
        : reminder
    );
    setReminders(updated);
    
    const reminder = updated.find(r => r.id === reminderId);
    if (reminder) {
      await supabase.from('reminders').update({ is_active: reminder.isActive }).eq('id', reminderId);
    }
  };

  const toggleDeviceAlarm = async (reminderId: string) => {
    playClickSound();
    if (notificationPermission !== 'granted') {
      Notification.requestPermission().then(async permission => {
        setNotificationPermission(permission);
        if (permission === 'granted') {
          const updated = reminders.map(reminder =>
            reminder.id === reminderId 
              ? { ...reminder, hasDeviceAlarm: !reminder.hasDeviceAlarm }
              : reminder
          );
          setReminders(updated);
          const reminder = updated.find(r => r.id === reminderId);
          if (reminder) {
            await supabase.from('reminders').update({ has_device_alarm: reminder.hasDeviceAlarm }).eq('id', reminderId);
          }
        }
      });
    } else {
      const updated = reminders.map(reminder =>
        reminder.id === reminderId 
          ? { ...reminder, hasDeviceAlarm: !reminder.hasDeviceAlarm }
          : reminder
      );
      setReminders(updated);
      const reminder = updated.find(r => r.id === reminderId);
      if (reminder) {
        await supabase.from('reminders').update({ has_device_alarm: reminder.hasDeviceAlarm }).eq('id', reminderId);
      }
    }
  };

  const deleteReminder = async (reminderId: string) => {
    playClickSound();
    if (ringingReminderId === reminderId) {
      stopAlarm();
    }
    setReminders(reminders.filter(reminder => reminder.id !== reminderId));
    await supabase.from('reminders').delete().eq('id', reminderId);
    toast({
      title: "🗑️ Reminder Deleted",
      description: "Reminder has been removed.",
    });
  };

  const toggleRepeatDay = (day: string) => {
    setNewReminderRepeatDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      addReminder();
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return { 
          gradient: 'from-red-500 to-orange-500',
          bg: isDarkMode ? 'bg-red-500/20' : 'bg-red-100',
          text: isDarkMode ? 'text-red-300' : 'text-red-700',
          border: isDarkMode ? 'border-red-400/40' : 'border-red-300'
        };
      case 'medium':
        return { 
          gradient: 'from-yellow-500 to-orange-500',
          bg: isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100',
          text: isDarkMode ? 'text-yellow-300' : 'text-yellow-700',
          border: isDarkMode ? 'border-yellow-400/40' : 'border-yellow-300'
        };
      default:
        return { 
          gradient: 'from-green-500 to-emerald-500',
          bg: isDarkMode ? 'bg-green-500/20' : 'bg-green-100',
          text: isDarkMode ? 'text-green-300' : 'text-green-700',
          border: isDarkMode ? 'border-green-400/40' : 'border-green-300'
        };
    }
  };

  const getCategoryConfig = (category: string) => {
    const configs: Record<string, { icon: string; color: string }> = {
      general: { icon: '📌', color: 'purple' },
      work: { icon: '💼', color: 'blue' },
      health: { icon: '💊', color: 'green' },
      personal: { icon: '👤', color: 'pink' },
      study: { icon: '📚', color: 'indigo' },
      fitness: { icon: '🏋️', color: 'orange' }
    };
    return configs[category] || configs.general;
  };

  const activeReminders = reminders.filter(r => r.isActive).length;
  const totalReminders = reminders.length;
  const highPriorityCount = reminders.filter(r => r.priority === 'high' && r.isActive).length;

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
          "absolute top-20 -right-20 w-96 h-96 rounded-full blur-3xl animate-pulse",
          isDarkMode ? "bg-violet-600/20" : "bg-violet-400/30"
        )} />
        <div className={cn(
          "absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl animate-pulse",
          isDarkMode ? "bg-indigo-600/20" : "bg-indigo-400/30"
        )} style={{ animationDelay: '1s' }} />
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl animate-float",
          isDarkMode ? "bg-pink-600/10" : "bg-pink-400/20"
        )} />
      </div>

      <Header />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="mb-10 text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className={cn(
              "p-4 rounded-3xl bg-gradient-to-br shadow-2xl animate-bounce-subtle",
              isDarkMode 
                ? "from-violet-500/40 to-pink-500/40 border-2 border-violet-400/50" 
                : "from-violet-400 to-pink-500 border-2 border-violet-300"
            )}>
              <Bell className={cn("h-10 w-10", isDarkMode ? "text-violet-300" : "text-white")} />
            </div>
          </div>
          <h1 className={cn(
            "text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight",
            isDarkMode ? "text-white" : "text-slate-900"
          )}>
            <span className="bg-gradient-to-r from-violet-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Smart Reminders
            </span>
          </h1>
          <p className={cn(
            "text-lg sm:text-xl max-w-2xl mx-auto",
            isDarkMode ? "text-slate-300" : "text-slate-600"
          )}>
            Never miss what matters with <span className="text-violet-500 font-bold">intelligent alerts</span>
          </p>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge className={cn(
              "px-4 py-2 text-sm font-bold rounded-xl",
              isDarkMode 
                ? "bg-violet-500/20 text-violet-300 border border-violet-400/30" 
                : "bg-violet-100 text-violet-700 border border-violet-200"
            )}>
              {activeReminders} of {totalReminders} active
            </Badge>
            {highPriorityCount > 0 && (
              <Badge className={cn(
                "px-4 py-2 text-sm font-bold rounded-xl animate-pulse",
                isDarkMode 
                  ? "bg-red-500/20 text-red-300 border border-red-400/30" 
                  : "bg-red-100 text-red-700 border border-red-200"
              )}>
                <Flame className="h-4 w-4 mr-1" />
                {highPriorityCount} urgent
              </Badge>
            )}
          </div>
        </div>

        {/* Notification Permission Banner */}
        {notificationPermission !== 'granted' && (
          <Card className={cn(
            "mb-6 shadow-xl border-0 backdrop-blur-xl animate-fade-in",
            isDarkMode 
              ? "bg-amber-500/10 border-2 border-amber-500/30" 
              : "bg-amber-50 border-2 border-amber-200"
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
                  <p className={cn("font-bold", isDarkMode ? "text-amber-200" : "text-amber-800")}>
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
                    "shrink-0 font-bold rounded-xl",
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
          "mb-8 shadow-2xl border-0 backdrop-blur-xl overflow-hidden animate-fade-in",
          isDarkMode 
            ? "bg-gradient-to-br from-white/10 to-purple-900/20 border-2 border-violet-500/30" 
            : "bg-white/90 border-2 border-violet-200"
        )} style={{ animationDelay: '0.1s' }}>
          <CardHeader className={cn(
            "pb-2 pt-6 px-6 border-b",
            isDarkMode ? "border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-pink-500/10" : "border-violet-100 bg-gradient-to-r from-violet-50 to-pink-50"
          )}>
            <CardTitle className={cn(
              "flex items-center gap-3 text-xl font-bold",
              isDarkMode ? "text-white" : "text-slate-900"
            )}>
              <div className={cn(
                "p-2 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg"
              )}>
                <Plus className="h-5 w-5 text-white" />
              </div>
              New Reminder
              {notificationPermission === 'granted' && (
                <Badge className={cn(
                  "ml-auto text-xs font-bold",
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
          <CardContent className="px-6 pb-6 pt-4 space-y-4">
            {/* Basic Fields */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={newReminderText}
                onChange={(e) => setNewReminderText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What should I remind you about?"
                className={cn(
                  "flex-1 h-12 text-base font-medium rounded-xl",
                  isDarkMode 
                    ? "bg-black/30 border-2 border-violet-400/30 text-white placeholder:text-slate-500 focus:border-violet-400" 
                    : "bg-white border-2 border-violet-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-400"
                )}
              />
              <Input
                type="time"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                className={cn(
                  "h-12 sm:w-36 font-bold rounded-xl",
                  isDarkMode 
                    ? "bg-black/30 border-2 border-violet-400/30 text-white focus:border-violet-400" 
                    : "bg-white border-2 border-violet-200 text-slate-900 focus:border-violet-400"
                )}
              />
            </div>

            {/* Advanced Options Toggle */}
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                "w-full font-semibold rounded-xl",
                isDarkMode 
                  ? "text-violet-400 hover:bg-violet-500/20" 
                  : "text-violet-600 hover:bg-violet-100"
              )}
            >
              {showAdvanced ? <X className="h-4 w-4 mr-2" /> : <Edit2 className="h-4 w-4 mr-2" />}
              {showAdvanced ? 'Hide Options' : 'More Options'}
            </Button>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="space-y-4 animate-fade-in">
                {/* Priority */}
                <div className="space-y-2">
                  <label className={cn("text-sm font-bold uppercase tracking-wider", isDarkMode ? "text-violet-300" : "text-violet-700")}>
                    Priority
                  </label>
                  <div className="flex gap-2">
                    {PRIORITIES.map(p => (
                      <Button
                        key={p.value}
                        variant={newReminderPriority === p.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewReminderPriority(p.value as 'low' | 'medium' | 'high')}
                        className={cn(
                          "flex-1 font-bold rounded-xl transition-all",
                          newReminderPriority === p.value
                            ? `bg-gradient-to-r ${getPriorityConfig(p.value).gradient} text-white border-0`
                            : isDarkMode 
                              ? "bg-white/10 border-2 border-white/20 text-white hover:bg-white/20"
                              : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <p.icon className="h-4 w-4 mr-1" />
                        {p.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className={cn("text-sm font-bold uppercase tracking-wider", isDarkMode ? "text-violet-300" : "text-violet-700")}>
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <Button
                        key={cat}
                        variant={newReminderCategory === cat ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewReminderCategory(cat)}
                        className={cn(
                          "font-bold rounded-xl capitalize transition-all",
                          newReminderCategory === cat
                            ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white border-0"
                            : isDarkMode 
                              ? "bg-white/10 border-2 border-white/20 text-white hover:bg-white/20"
                              : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        {getCategoryConfig(cat).icon} {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Repeat Days */}
                <div className="space-y-2">
                  <label className={cn("text-sm font-bold uppercase tracking-wider flex items-center gap-2", isDarkMode ? "text-violet-300" : "text-violet-700")}>
                    <Repeat className="h-4 w-4" />
                    Repeat On
                  </label>
                  <div className="flex gap-2">
                    {DAYS.map(day => (
                      <Button
                        key={day}
                        variant={newReminderRepeatDays.includes(day) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleRepeatDay(day)}
                        className={cn(
                          "flex-1 font-bold rounded-xl transition-all px-2",
                          newReminderRepeatDays.includes(day)
                            ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white border-0"
                            : isDarkMode 
                              ? "bg-white/10 border-2 border-white/20 text-white hover:bg-white/20"
                              : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className={cn("text-sm font-bold uppercase tracking-wider", isDarkMode ? "text-violet-300" : "text-violet-700")}>
                    Notes
                  </label>
                  <Textarea
                    value={newReminderNotes}
                    onChange={(e) => setNewReminderNotes(e.target.value)}
                    placeholder="Add any additional notes..."
                    className={cn(
                      "rounded-xl font-medium resize-none",
                      isDarkMode 
                        ? "bg-black/30 border-2 border-violet-400/30 text-white placeholder:text-slate-500 focus:border-violet-400" 
                        : "bg-white border-2 border-violet-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-400"
                    )}
                    rows={2}
                  />
                </div>
              </div>
            )}

            {/* Add Button */}
            <SoundButton 
              onClick={addReminder}
              disabled={!newReminderText.trim() || !newReminderTime}
              className={cn(
                "w-full h-12 font-bold text-base rounded-xl transition-all hover:scale-[1.02]",
                isDarkMode 
                  ? "bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white disabled:opacity-50" 
                  : "bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white disabled:opacity-50"
              )}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Reminder
            </SoundButton>
          </CardContent>
        </Card>

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.length === 0 ? (
            <Card className={cn(
              "shadow-xl border-0 backdrop-blur-xl animate-fade-in",
              isDarkMode 
                ? "bg-gradient-to-br from-white/10 to-purple-900/20 border-2 border-violet-500/30" 
                : "bg-white/90 border-2 border-violet-200"
            )}>
              <CardContent className="text-center py-16">
                <div className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-violet-500 to-pink-500 shadow-xl"
                )}>
                  <Clock className="h-12 w-12 text-white" />
                </div>
                <p className={cn(
                  "text-2xl font-bold mb-2",
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
            reminders.map((reminder, index) => {
              const isRinging = ringingReminderId === reminder.id;
              const priorityConfig = getPriorityConfig(reminder.priority);
              const categoryConfig = getCategoryConfig(reminder.category);
              
              return (
                <Card 
                  key={reminder.id} 
                  className={cn(
                    "shadow-xl border-0 backdrop-blur-xl transition-all duration-300 animate-fade-in overflow-hidden",
                    isRinging 
                      ? "bg-red-500/20 border-2 border-red-500/50 animate-pulse shadow-red-500/50" 
                      : isDarkMode 
                        ? "bg-gradient-to-br from-white/10 to-purple-900/20 border-2 border-white/20 hover:border-violet-400/50" 
                        : "bg-white/90 border-2 border-violet-100 hover:border-violet-300 hover:shadow-2xl"
                  )}
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      {/* Toggle Button */}
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all duration-300 shrink-0 flex items-center justify-center mt-1",
                          reminder.isActive 
                            ? `bg-gradient-to-br ${priorityConfig.gradient} border-0 shadow-lg` 
                            : isDarkMode 
                              ? "border-slate-600 hover:border-slate-400" 
                              : "border-slate-300 hover:border-slate-400"
                        )}
                      >
                        {reminder.isActive && <CheckCircle2 className="h-5 w-5 text-white" />}
                      </button>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-bold text-lg leading-tight transition-all",
                          reminder.isActive 
                            ? isDarkMode ? "text-white" : "text-slate-900"
                            : isDarkMode ? "text-slate-500 line-through" : "text-slate-400 line-through"
                        )}>
                          {reminder.text}
                        </p>
                        
                        {/* Notes */}
                        {reminder.notes && (
                          <p className={cn(
                            "text-sm mt-1",
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          )}>
                            📝 {reminder.notes}
                          </p>
                        )}
                        
                        {/* Badges */}
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <Badge className={cn(
                            "font-bold rounded-lg",
                            isDarkMode 
                              ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" 
                              : "bg-violet-100 text-violet-700 border border-violet-200"
                          )}>
                            <Clock className="h-3 w-3 mr-1" />
                            {reminder.time}
                          </Badge>
                          
                          <Badge className={cn(
                            "font-bold rounded-lg capitalize",
                            priorityConfig.bg,
                            priorityConfig.text,
                            `border ${priorityConfig.border}`
                          )}>
                            {reminder.priority === 'high' ? <Flame className="h-3 w-3 mr-1" /> : reminder.priority === 'medium' ? <Zap className="h-3 w-3 mr-1" /> : <Star className="h-3 w-3 mr-1" />}
                            {reminder.priority}
                          </Badge>

                          <Badge className={cn(
                            "font-bold rounded-lg capitalize",
                            isDarkMode 
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" 
                              : "bg-purple-100 text-purple-700 border border-purple-200"
                          )}>
                            {categoryConfig.icon} {reminder.category}
                          </Badge>

                          {reminder.repeatDays.length > 0 && (
                            <Badge className={cn(
                              "font-bold rounded-lg",
                              isDarkMode 
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                                : "bg-blue-100 text-blue-700 border border-blue-200"
                            )}>
                              <Repeat className="h-3 w-3 mr-1" />
                              {reminder.repeatDays.join(', ')}
                            </Badge>
                          )}
                          
                          {isRinging ? (
                            <Badge 
                              onClick={stopAlarm}
                              className="bg-red-500/30 text-red-300 border-red-500/50 cursor-pointer hover:bg-red-500/40 animate-bounce font-bold"
                            >
                              <Volume2 className="h-3 w-3 mr-1" />
                              Click to Stop
                            </Badge>
                          ) : (
                            <Badge 
                              className={cn(
                                "cursor-pointer transition-all font-bold",
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
                          "shrink-0 rounded-xl h-10 w-10",
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