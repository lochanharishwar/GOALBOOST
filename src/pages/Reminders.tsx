import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { TimePicker } from '@/components/ui/time-picker';
import { Bell, Plus, Trash2, Clock, BellRing, Volume2, VolumeX, CheckCircle2, AlertCircle, Tag, Flame, Star, Zap, Repeat, Sparkles } from 'lucide-react';
import { SoundButton } from '@/components/SoundButton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useClickSound } from '@/utils/soundUtils';
import { useTheme } from '@/contexts/ThemeContext';

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
  { value: 'low', label: 'Low', icon: Star },
  { value: 'medium', label: 'Medium', icon: Zap },
  { value: 'high', label: 'High', icon: Flame }
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
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [ringingReminderId, setRingingReminderId] = useState<string | null>(null);
  const { toast } = useToast();
  const { playClickSound } = useClickSound();
  
  const alarmContextRef = useRef<AudioContext | null>(null);
  const alarmIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load reminders from localStorage
  useEffect(() => {
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

    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('goalflow-reminders', JSON.stringify(reminders));
    } catch (error) {
      console.warn('Failed to save reminders:', error);
    }
  }, [reminders]);

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

  const addReminder = () => {
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

      setReminders([newReminder, ...reminders]);
      
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
        return { className: 'bg-destructive/20 text-destructive border-destructive/40' };
      case 'medium':
        return { className: 'bg-warning/20 text-warning border-warning/40' };
      default:
        return { className: 'bg-success/20 text-success border-success/40' };
    }
  };

  const getCategoryConfig = (category: string) => {
    const configs: Record<string, { icon: string }> = {
      general: { icon: '📌' },
      work: { icon: '💼' },
      health: { icon: '💊' },
      personal: { icon: '👤' },
      study: { icon: '📚' },
      fitness: { icon: '🏋️' }
    };
    return configs[category] || configs.general;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return { displayHour: displayHour.toString().padStart(2, '0'), minutes, ampm };
  };

  const activeReminders = reminders.filter(r => r.isActive).length;
  const totalReminders = reminders.length;
  const highPriorityCount = reminders.filter(r => r.priority === 'high' && r.isActive).length;

  return (
    <div className="min-h-screen relative overflow-hidden transition-all duration-500 bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-success/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl animate-pulse" />
              <div className="relative p-4 rounded-2xl gradient-primary glow-primary">
                <Bell className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-gradient tracking-tight">
                Reminders
              </h1>
              <p className="text-muted-foreground text-lg font-semibold">
                Never miss what matters
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 mt-6">
            <Badge className="px-4 py-2 text-sm font-bold rounded-xl bg-primary/20 text-primary border border-primary/30">
              {activeReminders} of {totalReminders} active
            </Badge>
            {highPriorityCount > 0 && (
              <Badge className="px-4 py-2 text-sm font-bold rounded-xl animate-pulse bg-destructive/20 text-destructive border border-destructive/30">
                <Flame className="h-4 w-4 mr-1" />
                {highPriorityCount} urgent
              </Badge>
            )}
          </div>
        </div>

        {/* Notification Permission Banner */}
        {notificationPermission !== 'granted' && (
          <Card className="glass-bold border-2 border-warning/30 mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/20 shrink-0">
                  <AlertCircle className="h-6 w-6 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground">Enable Device Notifications</p>
                  <p className="text-sm text-muted-foreground">
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
                  className="shrink-0 font-bold rounded-xl bg-warning text-warning-foreground hover:bg-warning/90"
                >
                  Enable Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add New Reminder - Clock Style */}
        <Card className="glass-bold border-2 border-primary/20 mb-8 overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-success" />
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">New Reminder</CardTitle>
              {notificationPermission === 'granted' && (
                <Badge className="ml-auto text-xs font-bold bg-success/20 text-success border-success/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Alarms Enabled
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Reminder Text + Time - Inline */}
            <div className="flex gap-3 items-center">
              <Input
                value={newReminderText}
                onChange={(e) => setNewReminderText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What should I remind you about?"
                className="flex-1 h-12 text-base font-medium rounded-xl bg-background border-2 border-input focus:border-primary"
              />
              <TimePicker
                value={newReminderTime}
                onChange={setNewReminderTime}
              />
            </div>

            {/* Advanced Options Toggle */}
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full font-semibold rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Hide Options' : 'More Options'}
            </Button>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="space-y-6 animate-fade-in">
                {/* Priority */}
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Priority
                  </label>
                  <div className="flex gap-3">
                    {PRIORITIES.map(p => (
                      <Button
                        key={p.value}
                        variant={newReminderPriority === p.value ? 'default' : 'outline'}
                        size="lg"
                        onClick={() => setNewReminderPriority(p.value as 'low' | 'medium' | 'high')}
                        className={cn(
                          "flex-1 font-bold rounded-xl transition-all",
                          newReminderPriority === p.value && "gradient-primary text-primary-foreground"
                        )}
                      >
                        <p.icon className="h-4 w-4 mr-2" />
                        {p.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
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
                          newReminderCategory === cat && "gradient-primary text-primary-foreground"
                        )}
                      >
                        {getCategoryConfig(cat).icon} {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Repeat Days */}
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
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
                          newReminderRepeatDays.includes(day) && "gradient-accent text-accent-foreground"
                        )}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Notes
                  </label>
                  <Textarea
                    value={newReminderNotes}
                    onChange={(e) => setNewReminderNotes(e.target.value)}
                    placeholder="Add any additional notes..."
                    className="rounded-xl font-medium resize-none bg-background border-2 border-input focus:border-primary"
                    rows={2}
                  />
                </div>
              </div>
            )}

            {/* Add Button */}
            <SoundButton 
              onClick={addReminder}
              disabled={!newReminderText.trim() || !newReminderTime}
              className="w-full h-14 font-bold text-lg rounded-xl gradient-primary text-primary-foreground shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Bell className="h-5 w-5 mr-2" />
              Set Reminder
            </SoundButton>
          </CardContent>
        </Card>

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.map((reminder) => {
            const priorityConfig = getPriorityConfig(reminder.priority);
            const categoryConfig = getCategoryConfig(reminder.category);
            const timeDisplay = formatTime(reminder.time);
            const isRinging = ringingReminderId === reminder.id;

            return (
              <Card
                key={reminder.id}
                className={cn(
                  "glass-bold border-2 transition-all duration-300 overflow-hidden",
                  isRinging && "border-destructive animate-pulse shadow-lg shadow-destructive/30",
                  !reminder.isActive && "opacity-60",
                  reminder.isActive && !isRinging && "border-border hover:border-primary/50"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Time Display - Clock Style */}
                    <div className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-2xl min-w-[100px]",
                      reminder.isActive ? "bg-primary/10 border-2 border-primary/30" : "bg-muted border-2 border-border"
                    )}>
                      <span className={cn(
                        "text-3xl font-black",
                        reminder.isActive ? "text-primary" : "text-muted-foreground"
                      )}>
                        {timeDisplay.displayHour}:{timeDisplay.minutes}
                      </span>
                      <span className={cn(
                        "text-xs font-bold",
                        reminder.isActive ? "text-primary" : "text-muted-foreground"
                      )}>
                        {timeDisplay.ampm}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <p className={cn(
                          "font-bold text-lg",
                          reminder.isActive ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {reminder.text}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={cn("text-xs font-bold rounded-full border", priorityConfig.className)}>
                          {reminder.priority === 'high' ? <Flame className="h-3 w-3 mr-1" /> : 
                           reminder.priority === 'medium' ? <Zap className="h-3 w-3 mr-1" /> : 
                           <Star className="h-3 w-3 mr-1" />}
                          {reminder.priority}
                        </Badge>
                        <Badge className="text-xs font-bold rounded-full bg-muted text-muted-foreground border border-border">
                          {categoryConfig.icon} {reminder.category}
                        </Badge>
                        {reminder.repeatDays.length > 0 && (
                          <Badge className="text-xs font-semibold rounded-full bg-accent/20 text-accent border border-accent/30">
                            <Repeat className="h-3 w-3 mr-1" />
                            {reminder.repeatDays.join(', ')}
                          </Badge>
                        )}
                      </div>
                      
                      {reminder.notes && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                          📝 {reminder.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isRinging && (
                        <Button
                          onClick={() => stopAlarm()}
                          className="font-bold rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 animate-pulse"
                        >
                          <VolumeX className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleReminder(reminder.id)}
                        className={cn(
                          "h-10 w-10 rounded-xl",
                          reminder.isActive ? "text-success hover:bg-success/20" : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {reminder.isActive ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleDeviceAlarm(reminder.id)}
                        className={cn(
                          "h-10 w-10 rounded-xl",
                          reminder.hasDeviceAlarm ? "text-primary hover:bg-primary/20" : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {reminder.hasDeviceAlarm ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReminder(reminder.id)}
                        className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/20"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {reminders.length === 0 && (
          <Card className="glass-bold border-2 border-muted/30 text-center py-16">
            <CardContent>
              <div className="p-6 rounded-3xl bg-primary/10 inline-block mb-6">
                <Clock className="h-16 w-16 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">No reminders yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first reminder to stay on track with your goals!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Reminders;
