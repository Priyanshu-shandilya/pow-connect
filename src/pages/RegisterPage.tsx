import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { PawPrint, Mail, Lock, User, Dog, Cat, Rabbit, Bird } from 'lucide-react';

const floatingAnimals = [
  { Icon: Cat, delay: '0s', duration: '7s', left: '8%', top: '12%' },
  { Icon: Dog, delay: '2s', duration: '6s', left: '85%', top: '20%' },
  { Icon: Bird, delay: '1s', duration: '5s', left: '10%', top: '80%' },
  { Icon: Rabbit, delay: '1.5s', duration: '8s', left: '75%', top: '75%' },
];

const RegisterPage: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome to PAW Care! 🐾');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/10 via-background to-primary/10 p-4 relative overflow-hidden">
      {floatingAnimals.map((animal, i) => (
        <div
          key={i}
          className="absolute opacity-10 animate-bounce pointer-events-none"
          style={{ left: animal.left, top: animal.top, animationDelay: animal.delay, animationDuration: animal.duration }}
        >
          <animal.Icon className="h-12 w-12 text-secondary" />
        </div>
      ))}

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="flex items-center justify-center gap-3 mb-8 group cursor-default">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
            <PawPrint className="h-8 w-8 text-primary-foreground animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            PAW Care
          </h1>
        </div>
        <Card className="shadow-2xl border-secondary/20 backdrop-blur-sm bg-card/95 transition-all duration-300 hover:shadow-secondary/10">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Join PAW Care 🐶</CardTitle>
            <CardDescription>Create your account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input id="password" type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20" required />
                </div>
              </div>
              <Button type="submit" className="w-full text-base font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : 'Create Account 🐾'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline transition-colors">Sign in</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
