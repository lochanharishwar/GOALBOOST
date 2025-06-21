import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, Trash2, Clock } from 'lucide-react';
import { SoundButton } from '@/components/SoundButton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useClickSound, playBellSound } from '@/utils/soundUtils';

interface Reminder {
  id: string;
  text: string;
  time: string;
  isActive: boolean;
  createdAt: string;
}

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toast } = useToast();
  const { playClickSound } = useClickSound();

  useEffect(() => {
    const savedReminders = localStorage.getItem('aspiraReminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aspiraReminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      
      reminders.forEach(reminder => {
        if (reminder.isActive && reminder.time === currentTime) {
          playBellSound(); // Use the new bell sound
          toast({
            title: "🔔 Reminder!",
            description: reminder.text,
            duration: 5000,
          });
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders, toast]);

  const addReminder = () => {
    if (newReminderText.trim() && newReminderTime) {
      playClickSound();
      const newReminder: Reminder = {
        id: crypto.randomUUID(),
        text: newReminderText.trim(),
        time: newReminderTime,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setReminders([...reminders, newReminder]);
      setNewReminderText('');
      setNewReminderTime('');
      toast({
        title: "⏰ Reminder Set!",
        description: `Reminder set for ${newReminderTime}`,
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

  const deleteReminder = (reminderId: string) => {
    playClickSound();
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

  const toggleTheme = () => {
    playClickSound();
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-all duration-500",
      isDarkMode 
        ? "bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900" 
        : "bg-gradient-to-br from-purple-50 via-indigo-50 to-slate-100"
    )}>
      <Header 
        isDarkMode={isDarkMode} 
        onToggleTheme={toggleTheme}
      />

      <div className="relative max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Reminders</h1>
          <p className="text-gray-300">Never miss what matters</p>
        </div>

        {/* Add New Reminder */}
        <Card className="mb-8 shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Add New Reminder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                value={newReminderText}
                onChange={(e) => setNewReminderText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What should I remind you about?"
                className="flex-1 bg-black/30 border-purple-400/30 text-white placeholder:text-gray-400"
              />
              <Input
                type="time"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                className="bg-black/30 border-purple-400/30 text-white"
              />
              <SoundButton 
                onClick={addReminder}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
              >
                <Plus className="h-5 w-5" />
              </SoundButton>
            </div>
          </CardContent>
        </Card>

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.length === 0 ? (
            <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-purple-500/20">
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">⏰</div>
                <p className="text-white text-lg font-medium">No reminders set.</p>
                <p className="text-gray-400 text-sm">Add your first reminder above.</p>
              </CardContent>
            </Card>
          ) : (
            reminders.map((reminder) => (
              <Card key={reminder.id} className="shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 transition-all duration-300",
                          reminder.isActive 
                            ? "bg-purple-500 border-purple-400" 
                            : "border-gray-500"
                        )}
                      />
                      <div>
                        <p className={cn(
                          "font-medium transition-all duration-200",
                          reminder.isActive ? "text-white" : "text-gray-400 line-through"
                        )}>
                          {reminder.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                            <Clock className="h-3 w-3 mr-1" />
                            {reminder.time}
                          </Badge>
                          <Badge className={cn(
                            reminder.isActive 
                              ? "bg-green-500/20 text-green-300 border-green-400/30"
                              : "bg-gray-500/20 text-gray-300 border-gray-400/30"
                          )}>
                            {reminder.isActive ? 'Active' : 'Paused'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <SoundButton
                      onClick={() => deleteReminder(reminder.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-400 hover:text-red-300 border-red-400/30 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </SoundButton>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminders;
