
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Target, Award, Calendar, Zap } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

const Analytics = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTasks = localStorage.getItem('aspiraTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    const savedTheme = localStorage.getItem('aspiraTheme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('aspiraTheme', !isDarkMode ? 'dark' : 'light');
  };

  // Analytics calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const urgentTasks = tasks.filter(task => task.priority === 'urgent').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Weekly data
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weeklyData = weekDays.map(day => {
    const dayString = format(day, 'yyyy-MM-dd');
    const dayTasks = tasks.filter(task => task.date === dayString);
    const completed = dayTasks.filter(task => task.completed).length;
    
    return {
      day: format(day, 'EEE'),
      total: dayTasks.length,
      completed,
      pending: dayTasks.length - completed
    };
  });

  // Priority distribution
  const priorityData = [
    { name: 'Urgent', value: tasks.filter(task => task.priority === 'urgent').length, color: '#ffffff' },
    { name: 'Daily', value: tasks.filter(task => task.priority === 'daily').length, color: '#3b82f6' },
    { name: 'Long-term', value: tasks.filter(task => task.priority === 'long-term').length, color: '#8b5cf6' }
  ];

  // Recent 7 days trend
  const trendData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    const dateString = format(date, 'yyyy-MM-dd');
    const dayTasks = tasks.filter(task => task.date === dateString);
    const completed = dayTasks.filter(task => task.completed).length;
    
    return {
      date: format(date, 'MMM dd'),
      completed,
      total: dayTasks.length,
      rate: dayTasks.length > 0 ? Math.round((completed / dayTasks.length) * 100) : 0
    };
  });

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-all duration-500",
      isDarkMode 
        ? "bg-gradient-to-br from-slate-900 via-red-900 to-blue-900" 
        : "bg-gradient-to-br from-blue-50 via-red-50 to-slate-100"
    )}>
      {/* Premium animated background */}
      <div className={cn(
        "absolute inset-0 transition-all duration-500",
        isDarkMode 
          ? "bg-gradient-to-br from-red-600/10 via-transparent to-blue-600/10"
          : "bg-gradient-to-br from-red-200/20 via-transparent to-blue-200/20"
      )}></div>

      <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

      <div className="relative max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-blue-500 bg-clip-text text-transparent mb-4">
            Executive Analytics
          </h1>
          <p className="text-gray-300 text-lg">
            Premium insights into your productivity performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-blue-500/20">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-400 mb-1">{totalTasks}</div>
              <div className="text-sm text-blue-300">Total Goals</div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-green-500/20">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-400 mb-1">{completedTasks}</div>
              <div className="text-sm text-green-300">Completed</div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-red-500/20">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-white mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{urgentTasks}</div>
              <div className="text-sm text-gray-300">Urgent Tasks</div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-purple-500/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-400 mb-1">{completionRate}%</div>
              <div className="text-sm text-purple-300">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weekly Performance */}
          <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-red-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-400" />
                Weekly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f3f4f6'
                    }} 
                  />
                  <Bar dataKey="completed" fill="#3b82f6" />
                  <Bar dataKey="pending" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                Priority Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f3f4f6'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Completion Trend */}
        <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              7-Day Completion Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-red-600/30 to-blue-600/30 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-xl">🎯 Executive Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Performance Status</h3>
                <Badge className={cn(
                  "px-3 py-1",
                  completionRate >= 80 ? "bg-green-500/20 text-green-300" :
                  completionRate >= 60 ? "bg-blue-500/20 text-blue-300" :
                  "bg-red-500/20 text-red-300"
                )}>
                  {completionRate >= 80 ? 'Elite Performance' :
                   completionRate >= 60 ? 'Strong Performance' :
                   'Needs Improvement'}
                </Badge>
              </div>
              <div className="bg-black/20 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Productivity Trend</h3>
                <p className="text-sm text-gray-300">
                  {trendData.slice(-2)[1]?.rate > trendData.slice(-2)[0]?.rate ? 
                    '📈 Improving trend' : '📉 Focus on consistency'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
