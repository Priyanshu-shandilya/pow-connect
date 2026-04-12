import React from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog, Calendar, Stethoscope, Users, DollarSign, TrendingUp } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { animals, appointments, treatments } = useData();

  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  const totalRevenue = treatments.reduce((s, t) => s + t.cost, 0);
  const avgCost = treatments.length ? (totalRevenue / treatments.length).toFixed(2) : '0';
  const uniqueOwners = new Set(animals.map(a => a.ownerName)).size;

  const typeDistribution = animals.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});

  const statusDistribution = appointments.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Total Animals', value: animals.length, icon: Dog, color: 'text-primary' },
          { title: 'Total Appointments', value: appointments.length, icon: Calendar, color: 'text-info' },
          { title: 'Total Treatments', value: treatments.length, icon: Stethoscope, color: 'text-secondary' },
          { title: 'Unique Owners', value: uniqueOwners, icon: Users, color: 'text-accent-foreground' },
          { title: 'Total Revenue', value: `$${totalRevenue}`, icon: DollarSign, color: 'text-success' },
          { title: 'Avg Treatment Cost', value: `$${avgCost}`, icon: TrendingUp, color: 'text-warning' },
        ].map(stat => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold mt-1 text-foreground">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Animals by Type</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(typeDistribution).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{type}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(count / animals.length) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-foreground w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Appointment Status</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(statusDistribution).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  status === 'completed' ? 'bg-success/20 text-success' :
                  status === 'cancelled' ? 'bg-destructive/20 text-destructive' :
                  'bg-warning/20 text-warning'
                }`}>{status}</span>
                <span className="text-sm font-medium text-foreground">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
