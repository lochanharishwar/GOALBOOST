import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, Area, AreaChart, Tooltip } from 'recharts';
import { Calendar, TrendingUp, Target, Award, Clock, CheckCircle, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Task } from '@/types/task';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useClickSound } from '@/utils/soundUtils';

const Analytics = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { playClickSound } = useClickSound();

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

  const toggleTheme = () => {
    playClickSound();
    setIsDarkMode(!isDarkMode);
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
      isDarkMode 
        ? "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950" 
        : "bg-gradient-to-br from-purple-50 via-blue-50 to-slate-100"
    )}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <Header 
        isDarkMode={isDarkMode} 
        onToggleTheme={toggleTheme}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-purple-400/30">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-300" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Analytics Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base ml-14">Track your productivity and goal completion trends</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl border-blue-500/30 border overflow-hidden group hover:border-blue-400/50 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">Total Goals</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{totalTasks}</p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/10 backdrop-blur-xl border-green-500/30 border overflow-hidden group hover:border-green-400/50 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">Completed</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{completedTasks}</p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-violet-600/10 backdrop-blur-xl border-purple-500/30 border overflow-hidden group hover:border-purple-400/50 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">Success Rate</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">{completionRate}%</p>
                    {trend !== 0 && (
                      <span className={cn(
                        "text-xs flex items-center gap-0.5 px-1.5 py-0.5 rounded-full",
                        trend > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      )}>
                        {trend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(Math.round(trend))}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/20 to-orange-600/10 backdrop-blur-xl border-amber-500/30 border overflow-hidden group hover:border-amber-400/50 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">Urgent Goals</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{urgentTasks}</p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-amber-500/20 group-hover:bg-amber-500/30 transition-colors">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Weekly Progress Chart */}
          <Card className="bg-gradient-to-br from-black/40 to-blue-900/20 backdrop-blur-xl border-blue-500/20 border overflow-hidden animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="w-full h-[200px] sm:h-[250px] lg:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
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
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total" />
                    <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card className="bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-xl border-purple-500/20 border overflow-hidden animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground flex items-center gap-2 text-base sm:text-lg">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
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
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No goals data available</p>
                  </div>
                )}
              </div>
              {/* Legend */}
              {priorityData.length > 0 && (
                <div className="flex justify-center gap-4 mt-2">
                  {priorityData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion Rate Trend */}
        <Card className="bg-gradient-to-br from-black/40 to-green-900/20 backdrop-blur-xl border-green-500/20 border overflow-hidden mb-6 sm:mb-8 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground flex items-center gap-2 text-base sm:text-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
              Completion Rate Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="w-full h-[180px] sm:h-[220px] lg:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
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
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completionRate" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fill="url(#completionGradient)"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: 'hsl(var(--background))' }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: 'hsl(var(--background))' }}
                    name="Completion Rate"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-black/40 to-blue-900/20 backdrop-blur-xl border-blue-500/20 border overflow-hidden animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground text-base sm:text-lg flex items-center gap-2">
                <span className="text-xl">📊</span> Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                <p className="text-muted-foreground text-sm">
                  {completionRate >= 80 
                    ? "🎉 Excellent! You're maintaining a high completion rate."
                    : completionRate >= 60
                      ? "👍 Good progress! Consider focusing on fewer, high-priority tasks."
                      : "💡 Try setting more achievable daily goals to build momentum."
                  }
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                <p className="text-muted-foreground text-sm">
                  {urgentTasks > 0 
                    ? `⚡ You have ${urgentTasks} urgent task${urgentTasks > 1 ? 's' : ''} that need immediate attention.`
                    : "✅ Great! No urgent tasks pending. Focus on long-term goals."
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-xl border-purple-500/20 border overflow-hidden animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground text-base sm:text-lg flex items-center gap-2">
                <span className="text-xl">🎯</span> Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                <p className="text-muted-foreground text-sm flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  {completionRate < 50 ? "Try the Pomodoro technique to improve focus" : "Consider setting stretch goals to challenge yourself"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                <p className="text-muted-foreground text-sm flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  {urgentTasks > dailyTasks ? "Balance urgent tasks with regular daily goals" : "Good balance between urgent and daily tasks"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                <p className="text-muted-foreground text-sm flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  Review and adjust your goal priorities weekly for better results
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
