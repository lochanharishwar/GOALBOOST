import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Zap, Mail, Lock, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        toast({
          title: '🎉 Account created!',
          description: 'Please check your email to verify your account before signing in.',
        });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        toast({
          title: '👋 Welcome back!',
          description: 'You have been signed in successfully.',
        });
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      const message = error?.message || 'An unexpected error occurred.';
      toast({
        title: isSignUp ? 'Sign up failed' : 'Sign in failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="w-full max-w-md relative glass-bold border-2 border-primary/20">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-success" />
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 rounded-xl bg-primary/15 shadow-lg">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-gradient tracking-tight">GoalFlow</h1>
          </div>
          <CardTitle className="text-xl font-bold text-foreground">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isSignUp
              ? 'Sign up to sync your data across devices'
              : 'Sign in to access your goals and reminders'}
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-2 border-border focus:border-primary"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-2 border-border focus:border-primary"
                disabled={isLoading}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full font-bold py-5 text-base rounded-xl gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : isSignUp ? (
                <UserPlus className="h-5 w-5 mr-2" />
              ) : (
                <LogIn className="h-5 w-5 mr-2" />
              )}
              {isLoading
                ? 'Please wait...'
                : isSignUp
                ? 'Create Account'
                : 'Sign In'}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline font-semibold"
              disabled={isLoading}
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
