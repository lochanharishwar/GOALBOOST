import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
}

interface YearlyHeatmapProps {
  habits: Habit[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const YearlyHeatmap = ({ habits }: YearlyHeatmapProps) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const getYearDates = () => {
    const dates: string[] = [];
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    
    const current = new Date(startDate);
    while (current <= endDate) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const getMonthDates = (month: number) => {
    const dates: string[] = [];
    const startDate = new Date(selectedYear, month, 1);
    const endDate = new Date(selectedYear, month + 1, 0);
    
    const current = new Date(startDate);
    while (current <= endDate) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const getCompletionLevel = (date: string) => {
    if (habits.length === 0) return 0;
    const completedCount = habits.filter(h => h.completedDates.includes(date)).length;
    const percentage = (completedCount / habits.length) * 100;
    
    if (percentage === 0) return 0;
    if (percentage <= 25) return 1;
    if (percentage <= 50) return 2;
    if (percentage <= 75) return 3;
    return 4;
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-muted/30';
      case 1: return 'bg-success/20';
      case 2: return 'bg-success/40';
      case 3: return 'bg-success/70';
      case 4: return 'bg-success';
      default: return 'bg-muted/30';
    }
  };

  const getCompletedCount = (date: string) => {
    return habits.filter(h => h.completedDates.includes(date)).length;
  };

  const yearDates = getYearDates();
  const today = new Date().toISOString().split('T')[0];
  
  // Get total completions for the year
  const yearCompletions = yearDates.reduce((total, date) => {
    return total + getCompletedCount(date);
  }, 0);

  // Get the longest streak in the year
  const calculateLongestStreak = () => {
    let maxStreak = 0;
    let currentStreak = 0;
    
    yearDates.forEach(date => {
      if (getCompletedCount(date) > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  };

  const longestStreak = calculateLongestStreak();

  // Group dates by week for the yearly view
  const getWeeksForYear = () => {
    const weeks: string[][] = [];
    let currentWeek: string[] = [];
    
    // Add empty slots for the first week
    const firstDayOfYear = new Date(selectedYear, 0, 1).getDay();
    for (let i = 0; i < firstDayOfYear; i++) {
      currentWeek.push('');
    }
    
    yearDates.forEach(date => {
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // Add remaining days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push('');
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const weeks = getWeeksForYear();

  // Get month labels with their approximate positions
  const getMonthLabels = () => {
    const labels: { month: string; weekIndex: number }[] = [];
    let currentMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      week.forEach(date => {
        if (date) {
          const month = new Date(date).getMonth();
          if (month !== currentMonth) {
            currentMonth = month;
            labels.push({ month: MONTHS[month], weekIndex });
          }
        }
      });
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  // Monthly view calendar
  const renderMonthlyView = () => {
    if (selectedMonth === null) return null;
    
    const monthDates = getMonthDates(selectedMonth);
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    
    const calendarDays: (string | null)[] = [];
    
    // Add empty slots for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null);
    }
    
    // Add all days of the month
    monthDates.forEach(date => calendarDays.push(date));
    
    // Fill remaining slots to complete the grid
    while (calendarDays.length % 7 !== 0) {
      calendarDays.push(null);
    }

    return (
      <Card className="glass-bold border-2 border-primary/20 mt-6 overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-success" />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {MONTHS[selectedMonth]} {selectedYear}
                </CardTitle>
                <p className="text-sm text-muted-foreground font-medium">Daily habit completion</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setSelectedMonth(null)}
              className="border-2 font-semibold"
            >
              Back to Year View
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-center text-xs font-bold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={index} className="aspect-square" />;
              }
              
              const level = getCompletionLevel(date);
              const isToday = date === today;
              const completedCount = getCompletedCount(date);
              
              return (
                <div
                  key={date}
                  className={cn(
                    "aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105",
                    getLevelColor(level),
                    isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  <span className={cn(
                    "text-sm font-bold",
                    level >= 3 ? "text-success-foreground" : "text-foreground"
                  )}>
                    {new Date(date).getDate()}
                  </span>
                  {completedCount > 0 && (
                    <span className={cn(
                      "text-xs font-semibold",
                      level >= 3 ? "text-success-foreground/80" : "text-muted-foreground"
                    )}>
                      {completedCount}/{habits.length}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Tooltip */}
          {hoveredDate && (
            <div className="mt-4 p-3 bg-muted/50 rounded-xl border border-border/50">
              <p className="text-sm font-semibold text-foreground">
                {new Date(hoveredDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                {getCompletedCount(hoveredDate)} of {habits.length} habits completed
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Yearly Heatmap Card */}
      <Card className="glass-bold border-2 border-success/20 overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-success via-primary to-accent" />
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-success/20">
                <Calendar className="h-6 w-6 text-success" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Yearly Activity Heatmap
                </CardTitle>
                <p className="text-sm text-muted-foreground font-medium">
                  Click on a month to see detailed view
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedYear(selectedYear - 1)}
                className="h-9 w-9 p-0 border-2 hover:bg-success/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-black text-foreground min-w-[80px] text-center">
                {selectedYear}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedYear(selectedYear + 1)}
                disabled={selectedYear >= new Date().getFullYear()}
                className="h-9 w-9 p-0 border-2 hover:bg-success/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Year Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-success" />
                <span className="text-xs font-bold text-muted-foreground">Total Completions</span>
              </div>
              <span className="text-2xl font-black text-success">{yearCompletions}</span>
            </div>
            <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="h-4 w-4 text-warning" />
                <span className="text-xs font-bold text-muted-foreground">Longest Streak</span>
              </div>
              <span className="text-2xl font-black text-warning">{longestStreak} days</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Month labels */}
          <div className="flex mb-2 ml-8 overflow-x-auto">
            <div className="flex" style={{ minWidth: `${weeks.length * 14}px` }}>
              {monthLabels.map(({ month, weekIndex }) => (
                <span
                  key={`${month}-${weekIndex}`}
                  className="text-xs font-bold text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  style={{ 
                    position: 'absolute',
                    left: `${32 + weekIndex * 14}px`
                  }}
                  onClick={() => setSelectedMonth(MONTHS.indexOf(month))}
                >
                  {month}
                </span>
              ))}
            </div>
          </div>
          
          {/* Heatmap grid */}
          <div className="flex gap-1 overflow-x-auto pb-4 pt-6">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2 shrink-0">
              {DAYS.map((day, i) => (
                <div 
                  key={day} 
                  className="h-3 text-xs font-medium text-muted-foreground flex items-center"
                  style={{ visibility: i % 2 === 1 ? 'visible' : 'hidden' }}
                >
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>
            
            {/* Weeks */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((date, dayIndex) => {
                    if (!date) {
                      return <div key={dayIndex} className="w-3 h-3" />;
                    }
                    
                    const level = getCompletionLevel(date);
                    const isToday = date === today;
                    const month = new Date(date).getMonth();
                    
                    return (
                      <div
                        key={date}
                        className={cn(
                          "w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-foreground/20",
                          getLevelColor(level),
                          isToday && "ring-1 ring-primary"
                        )}
                        title={`${date}: ${getCompletedCount(date)}/${habits.length} completed`}
                        onClick={() => setSelectedMonth(month)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <span className="text-xs text-muted-foreground font-medium">Less</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={cn(
                    "w-3 h-3 rounded-sm",
                    getLevelColor(level)
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">More</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Monthly detailed view */}
      {selectedMonth !== null && renderMonthlyView()}
    </div>
  );
};
