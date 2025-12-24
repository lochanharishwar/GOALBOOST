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

const FloatingTimerWrapper = () => {
  const { isPiPActive } = useTimer();
  return isPiPActive ? <FloatingTimer /> : null;
};

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FloatingTimerWrapper />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <TimerProvider>
      <AppContent />
    </TimerProvider>
  );
}

export default App;
