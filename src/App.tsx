import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TimerProvider, useTimer } from '@/contexts/TimerContext';
import { FloatingTimer } from '@/components/FloatingTimer';
import Dashboard from '@/pages/Dashboard';
import Analytics from '@/pages/Analytics';
import Habits from '@/pages/Habits';
import Pomodoro from '@/pages/Pomodoro';
import Reminders from '@/pages/Reminders';
import Exercises from '@/pages/Exercises';
import NotFound from '@/pages/NotFound';

function FloatingTimerWrapper() {
  const { isPiPActive } = useTimer();
  if (!isPiPActive) return null;
  return <FloatingTimer />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/habits" element={<Habits />} />
      <Route path="/pomodoro" element={<Pomodoro />} />
      <Route path="/reminders" element={<Reminders />} />
      <Route path="/exercises" element={<Exercises />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <TimerProvider>
      <AppRoutes />
      <FloatingTimerWrapper />
      <Toaster />
    </TimerProvider>
  );
}

export default App;
