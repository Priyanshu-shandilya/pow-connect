import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog, Calendar, Stethoscope, TrendingUp, Clock, CheckCircle2, Cat, Rabbit, Bird } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { animals, appointments, treatments } = useData();

  const pendingAppts = appointments.filter(a => a.status === 'pending').length;
  const completedAppts = appointments.filter(a => a.status === 'completed').length;
  const ongoingTreatments = treatments.filter(t => t.status === 'ongoing').length;
  const totalCost = treatments.reduce((sum, t) => sum + t.cost, 0);

  const stats = [
    { title: 'Total Animals', value: animals.length, icon: Dog, color: 'text-primary' },
    { title: 'Appointments', value: appointments.length, icon: Calendar, color: 'text-info' },
    { title: 'Pending', value: pendingAppts, icon: Clock, color: 'text-warning' },
    { title: 'Completed', value: completedAppts, icon: CheckCircle2, color: 'text-success' },
    { title: 'Active Treatments', value: ongoingTreatments, icon: Stethoscope, color: 'text-destructive' },
    { title: 'Total Revenue', value: `$${totalCost}`, icon: TrendingUp, color: 'text-secondary' },
  ];

  const animalTypes = [
    { type: 'Dogs', icon: Dog, count: animals.filter(a => a.type === 'Dog').length, emoji: '🐶' },
    { type: 'Cats', icon: Cat, count: animals.filter(a => a.type === 'Cat').length, emoji: '🐱' },
    { type: 'Rabbits', icon: Rabbit, count: animals.filter(a => a.type === 'Rabbit').length, emoji: '🐰' },
    { type: 'Birds', icon: Bird, count: animals.filter(a => a.type === 'Bird').length, emoji: '🐦' },
  ];

  const floatingAnimals = [
    { emoji: '🐕', size: 'text-5xl', top: '5%', left: '8%', delay: '0s', duration: '6s' },
    { emoji: '🐈', size: 'text-4xl', top: '15%', right: '10%', delay: '1s', duration: '7s' },
    { emoji: '🐾', size: 'text-3xl', top: '35%', left: '5%', delay: '2s', duration: '5s' },
    { emoji: '🐇', size: 'text-4xl', top: '50%', right: '6%', delay: '0.5s', duration: '8s' },
    { emoji: '🦜', size: 'text-3xl', top: '70%', left: '12%', delay: '1.5s', duration: '6s' },
    { emoji: '🐕‍🦺', size: 'text-4xl', top: '80%', right: '15%', delay: '3s', duration: '7s' },
    { emoji: '🐩', size: 'text-3xl', top: '25%', right: '25%', delay: '2.5s', duration: '5s' },
    { emoji: '🐱', size: 'text-5xl', top: '60%', left: '25%', delay: '1s', duration: '9s' },
  ];

  return (
    <div className="space-y-8 relative overflow-hidden min-h-screen">
      {/* Floating animated animals */}
      {floatingAnimals.map((animal, i) => (
        <span
          key={i}
          className={`absolute ${animal.size} pointer-events-none select-none opacity-10`}
          style={{
            top: animal.top,
            left: animal.left,
            right: animal.right,
            animation: `float ${animal.duration} ease-in-out ${animal.delay} infinite alternate`,
          }}
        >
          {animal.emoji}
        </span>
      ))}

      <div className="animate-fade-in relative z-10">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name} 🐾
        </h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your pet care center today.</p>
      </div>

      {/* Hero animal banner */}
      <Card className="relative z-10 overflow-hidden animate-fade-in border-primary/20 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Your Pet Family</h2>
            <p className="text-muted-foreground text-sm">
              {animals.length === 0
                ? 'No animals yet — start by adding your first pet!'
                : `You have ${animals.length} pet${animals.length > 1 ? 's' : ''} registered`}
            </p>
          </div>
          <div className="flex gap-3 text-4xl">
            {['🐶', '🐱', '🐰', '🐦', '🐾'].map((e, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  animation: `bounce-animal 1.5s ease-in-out ${i * 0.2}s infinite alternate`,
                }}
              >
                {e}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {stats.map((stat, i) => (
          <Card
            key={stat.title}
            className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1 text-foreground">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-xl bg-muted flex items-center justify-center ${stat.color} transition-transform duration-300 hover:scale-110 hover:rotate-12`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Animal Types Summary */}
      <Card className="animate-fade-in relative z-10" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🐾 Animals by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {animalTypes.map((at, i) => (
              <div
                key={at.type}
                className="text-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 hover:scale-105 cursor-default animate-fade-in"
                style={{ animationDelay: `${300 + i * 100}ms` }}
              >
                <span
                  className="text-3xl block mb-2 inline-block"
                  style={{ animation: `bounce-animal 2s ease-in-out ${i * 0.3}s infinite alternate` }}
                >
                  {at.emoji}
                </span>
                <p className="text-2xl font-bold text-foreground">{at.count}</p>
                <p className="text-sm text-muted-foreground">{at.type}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Appointments */}
      <Card className="animate-fade-in relative z-10" style={{ animationDelay: '300ms' }}>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <span className="text-4xl block mb-2">📋</span>
              No appointments yet. Book your first one!
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 5).map((appt, i) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-200 hover:translate-x-1 animate-fade-in"
                  style={{ animationDelay: `${400 + i * 50}ms` }}
                >
                  <div>
                    <p className="font-medium text-foreground">{appt.animalName}</p>
                    <p className="text-sm text-muted-foreground">{appt.reason} • {appt.veterinarian}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">{appt.date}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      appt.status === 'completed' ? 'bg-success/20 text-success' :
                      appt.status === 'cancelled' ? 'bg-destructive/20 text-destructive' :
                      'bg-warning/20 text-warning'
                    }`}>{appt.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
