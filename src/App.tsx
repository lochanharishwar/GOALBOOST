import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TimerProvider, useTimer } from '@/contexts/TimerContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FloatingTimer } from '@/components/FloatingTimer';
import Dashboard from '@/pages/Dashboard';
import Analytics from '@/pages/Analytics';
import Habits from '@/pages/Habits';
import Pomodoro from '@/pages/Pomodoro';
import Reminders from '@/pages/Reminders';
import Exercises from '@/pages/Exercises';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';

function FloatingTimerWrapper() {
  const { isPiPActive } = useTimer();
  if (!isPiPActive) return null;
  return <FloatingTimer />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
      <Route path="/pomodoro" element={<ProtectedRoute><Pomodoro /></ProtectedRoute>} />
      <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
      <Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TimerProvider>
          <AppRoutes />
          <FloatingTimerWrapper />
          <Toaster />
        </TimerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
