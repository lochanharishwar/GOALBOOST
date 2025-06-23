
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/Dashboard';
import Analytics from '@/pages/Analytics';
import Habits from '@/pages/Habits';
import Pomodoro from '@/pages/Pomodoro';
import Reminders from '@/pages/Reminders';
import Exercises from '@/pages/Exercises';
import NotFound from '@/pages/NotFound';

function App() {
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
      <Toaster />
    </>
  );
}

export default App;
