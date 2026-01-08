import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Area, AreaChart, Tooltip } from 'recharts';
import { Calendar, TrendingUp, Target, Award, CheckCircle, Zap, ArrowUpRight, ArrowDownRight, Lightbulb, Sparkles, Star, Brain } from 'lucide-react';
import { Task } from '@/types/task';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const Analytics = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { isDarkMode } = useTheme();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeChart, setActiveChart] = useState(0);

  useEffect(() => {
    const savedTasks = localStorage.getItem('goalflow-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'goalflow-tasks' && e.newValue) {
        setTasks(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const handleLocalUpdate = () => {
      const updatedTasks = localStorage.getItem('goalflow-tasks');
      if (updatedTasks) {
        setTasks(JSON.parse(updatedTasks));
      }
    };

    const interval = setInterval(handleLocalUpdate, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const scrollToChart = (index: number) => {
    if (carouselRef.current) {
      const chartWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({ left: chartWidth * index, behavior: 'smooth' });
      setActiveChart(index);
    }
  };

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const cancelledTasks = tasks.filter(task => task.cancelled).length;
  
  // Priority distribution
  const urgentTasks = tasks.filter(task => task.priority === 'urgent').length;
  const dailyTasks = tasks.filter(task => task.priority === 'daily').length;
  const longTermTasks = tasks.filter(task => task.priority === 'long-term').length;

  // Weekly data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
    const dayTasks = tasks.filter(task => task.date === date);
    const dayCompleted = dayTasks.filter(task => task.completed).length;
    
    return {
      date: format(subDays(new Date(), 6 - i), 'EEE'),
      fullDate: format(subDays(new Date(), 6 - i), 'MMM dd'),
      tasks: dayTasks.length,
      completed: dayCompleted,
      completionRate: dayTasks.length > 0 ? Math.round((dayCompleted / dayTasks.length) * 100) : 0
    };
  });

  // Priority pie chart data
  const priorityData = [
    { name: 'Urgent', value: urgentTasks, color: '#ef4444' },
    { name: 'Daily', value: dailyTasks, color: '#3b82f6' },
    { name: 'Long-term', value: longTermTasks, color: '#8b5cf6' },
  ].filter(item => item.value > 0);

  const chartConfig = {
    tasks: { label: "Total Tasks", color: "#3b82f6" },
    completed: { label: "Completed", color: "#10b981" },
    completionRate: { label: "Completion Rate %", color: "#f59e0b" }
  };

  // Calculate trend
  const lastWeekCompletion = last7Days.slice(0, 3).reduce((acc, d) => acc + d.completionRate, 0) / 3;
  const thisWeekCompletion = last7Days.slice(4).reduce((acc, d) => acc + d.completionRate, 0) / 3;
  const trend = thisWeekCompletion - lastWeekCompletion;

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-all duration-500",
      "bg-background"
    )}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-success/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl animate-pulse" />
              <div className="relative p-4 rounded-2xl gradient-primary glow-primary">
                <TrendingUp className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gradient tracking-tight">Analytics Dashboard</h1>
              <p className="text-muted-foreground text-base sm:text-lg font-semibold">Track your productivity and goal completion trends</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10">
          <Card className="glass-bold hover-lift group overflow-hidden border-2 border-info/30 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="h-1.5 w-full bg-gradient-to-r from-info to-info/50" />
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm font-bold">Total Goals</p>
                  <p className="text-3xl sm:text-4xl font-black text-info mt-1">{totalTasks}</p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-info/20 group-hover:scale-110 transition-transform">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-bold hover-lift group overflow-hidden border-2 border-success/30 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="h-1.5 w-full bg-gradient-to-r from-success to-success/50" />
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm font-bold">Completed</p>
                  <p className="text-3xl sm:text-4xl font-black text-success mt-1">{completedTasks}</p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-success/20 group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-bold hover-lift group overflow-hidden border-2 border-primary/30 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary/50" />
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm font-bold">Success Rate</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-3xl sm:text-4xl font-black text-primary">{completionRate}%</p>
                    {trend !== 0 && (
                      <span className={cn(
                        "text-xs flex items-center gap-0.5 px-2 py-1 rounded-full font-bold",
                        trend > 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                      )}>
                        {trend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(Math.round(trend))}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-primary/20 group-hover:scale-110 transition-transform">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-bold hover-lift group overflow-hidden border-2 border-warning/30 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="h-1.5 w-full bg-gradient-to-r from-warning to-warning/50" />
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm font-bold">Urgent Goals</p>
                  <p className="text-3xl sm:text-4xl font-black text-warning mt-1">{urgentTasks}</p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-warning/20 group-hover:scale-110 transition-transform">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10">
          {/* Weekly Progress Chart */}
          <Card className="glass-bold border-2 border-info/30 overflow-hidden animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="h-1.5 w-full bg-gradient-to-r from-info via-primary to-success" />
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground flex items-center gap-3 text-base sm:text-lg font-bold">
                <div className="p-2 rounded-xl bg-info/20">
                  <TrendingUp className="h-5 w-5 text-info" />
                </div>
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="w-full h-[200px] sm:h-[250px] lg:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '2px solid hsl(var(--border))',
                        borderRadius: '12px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Bar dataKey="tasks" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} name="Total" />
                    <Bar dataKey="completed" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card className="glass-bold border-2 border-primary/30 overflow-hidden animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-warning" />
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground flex items-center gap-3 text-base sm:text-lg font-bold">
                <div className="p-2 rounded-xl bg-primary/20">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                Goal Priority Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="w-full h-[200px] sm:h-[250px] lg:h-[280px] flex items-center justify-center">
                {priorityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priorityData}
                        cx="50%"
                        cy="50%"
                        innerRadius="40%"
                        outerRadius="70%"
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                      >
                        {priorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '2px solid hsl(var(--border))',
                          borderRadius: '12px',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">No goals data available</p>
                  </div>
                )}
              </div>
              {/* Legend */}
              {priorityData.length > 0 && (
                <div className="flex justify-center gap-4 mt-2">
                  {priorityData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-muted-foreground font-medium">{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion Rate Trend */}
        <Card className="glass-bold border-2 border-success/30 overflow-hidden mb-8 sm:mb-10 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="h-1.5 w-full bg-gradient-to-r from-success via-success to-primary" />
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground flex items-center gap-3 text-base sm:text-lg font-bold">
              <div className="p-2 rounded-xl bg-success/20">
                <Calendar className="h-5 w-5 text-success" />
              </div>
              Completion Rate Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="w-full h-[180px] sm:h-[220px] lg:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '2px solid hsl(var(--border))',
                      borderRadius: '12px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completionRate" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3}
                    fill="url(#completionGradient)"
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4, stroke: 'hsl(var(--background))' }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--success))', strokeWidth: 2, fill: 'hsl(var(--background))' }}
                    name="Completion Rate"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary Insights & Recommendations - HIGHLIGHTED */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Insights Card - Highlighted */}
          <Card className="glass-bold border-2 border-warning/40 overflow-hidden animate-fade-in relative group" style={{ animationDelay: '0.8s' }}>
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-warning/10 via-transparent to-transparent opacity-50" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-warning/20 rounded-full blur-3xl group-hover:bg-warning/30 transition-colors" />
            
            <div className="h-2 w-full bg-gradient-to-r from-warning via-warning to-accent animate-pulse" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-foreground text-lg sm:text-xl flex items-center gap-3 font-black">
                <div className="p-3 rounded-xl bg-warning/20 glow-accent">
                  <Lightbulb className="h-6 w-6 text-warning" />
                </div>
                <span className="text-gradient">Key Insights</span>
                <Star className="h-5 w-5 text-warning animate-pulse ml-auto" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-warning/10 to-warning/5 border-2 border-warning/30 hover:border-warning/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-warning/20 mt-0.5">
                    <Sparkles className="h-4 w-4 text-warning" />
                  </div>
                  <p className="text-foreground text-sm font-semibold leading-relaxed">
                    {completionRate >= 80 
                      ? "🎉 Excellent! You're maintaining a high completion rate. Keep up the amazing momentum!"
                      : completionRate >= 60
                        ? "👍 Good progress! Consider focusing on fewer, high-priority tasks for even better results."
                        : "💡 Try setting more achievable daily goals to build momentum and consistency."
                    }
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-warning/10 to-warning/5 border-2 border-warning/30 hover:border-warning/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-warning/20 mt-0.5">
                    <Zap className="h-4 w-4 text-warning" />
                  </div>
                  <p className="text-foreground text-sm font-semibold leading-relaxed">
                    {urgentTasks > 0 
                      ? `⚡ You have ${urgentTasks} urgent task${urgentTasks > 1 ? 's' : ''} requiring immediate attention. Prioritize these first!`
                      : "✅ Great! No urgent tasks pending. Perfect time to focus on long-term goals."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations Card - Highlighted */}
          <Card className="glass-bold border-2 border-accent/40 overflow-hidden animate-fade-in relative group" style={{ animationDelay: '0.9s' }}>
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-50" />
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/30 transition-colors" />
            
            <div className="h-2 w-full bg-gradient-to-r from-accent via-primary to-success animate-pulse" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-foreground text-lg sm:text-xl flex items-center gap-3 font-black">
                <div className="p-3 rounded-xl bg-accent/20 glow-primary">
                  <Brain className="h-6 w-6 text-accent" />
                </div>
                <span className="text-gradient">Smart Recommendations</span>
                <Star className="h-5 w-5 text-accent animate-pulse ml-auto" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/30 hover:border-accent/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                    <span className="text-accent font-black">1</span>
                  </div>
                  <p className="text-foreground text-sm font-semibold leading-relaxed">
                    {completionRate < 50 ? "Try the Pomodoro technique to improve focus and productivity" : "Consider setting stretch goals to challenge yourself"}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-primary font-black">2</span>
                  </div>
                  <p className="text-foreground text-sm font-semibold leading-relaxed">
                    {urgentTasks > dailyTasks ? "Balance urgent tasks with regular daily goals for sustainability" : "Great balance between urgent and daily tasks"}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/30 hover:border-success/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                    <span className="text-success font-black">3</span>
                  </div>
                  <p className="text-foreground text-sm font-semibold leading-relaxed">
                    Review and adjust your goal priorities weekly for optimal results
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
