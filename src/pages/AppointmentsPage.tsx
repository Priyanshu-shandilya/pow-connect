import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 6;
const statusOptions = ['pending', 'completed', 'cancelled'] as const;
const vets = ['Dr. Smith', 'Dr. Johnson', 'Dr. Garcia', 'Dr. Lee'];

const emptyForm = { animalId: '', animalName: '', ownerName: '', date: '', time: '', reason: '', status: 'pending' as 'pending' | 'completed' | 'cancelled', veterinarian: '' };

const AppointmentsPage: React.FC = () => {
  const { appointments, animals, addAppointment, updateAppointment, deleteAppointment } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    return appointments.filter(a => {
      const matchSearch = a.animalName.toLowerCase().includes(search.toLowerCase()) || a.ownerName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || a.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [appointments, search, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };
  const openEdit = (a: typeof appointments[0]) => {
    setForm({ animalId: a.animalId, animalName: a.animalName, ownerName: a.ownerName, date: a.date, time: a.time, reason: a.reason, status: a.status, veterinarian: a.veterinarian });
    setEditingId(a.id);
    setDialogOpen(true);
  };

  const handleAnimalSelect = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (animal) setForm(f => ({ ...f, animalId, animalName: animal.name, ownerName: animal.ownerName }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.animalName || !form.date || !form.reason || !form.veterinarian) { toast.error('Please fill required fields'); return; }
    if (editingId) {
      updateAppointment(editingId, form);
      toast.success('Appointment updated');
    } else {
      addAppointment(form);
      toast.success('Appointment booked');
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">Schedule and manage appointments</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Book Appointment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Appointment' : 'Book Appointment'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Animal *</Label>
                  <Select value={form.animalId} onValueChange={handleAnimalSelect}>
                    <SelectTrigger><SelectValue placeholder="Select animal" /></SelectTrigger>
                    <SelectContent>{animals.map(a => <SelectItem key={a.id} value={a.id}>{a.name} ({a.ownerName})</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Veterinarian *</Label>
                  <Select value={form.veterinarian} onValueChange={v => setForm(f => ({ ...f, veterinarian: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select vet" /></SelectTrigger>
                    <SelectContent>{vets.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Time *</Label>
                  <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reason *</Label>
                <Input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} required />
              </div>
              {editingId && (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v: typeof form.status) => setForm(f => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
              <Button type="submit" className="w-full">{editingId ? 'Update' : 'Book Appointment'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
        </div>
        <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Vet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No appointments found</TableCell></TableRow>
              ) : paginated.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.animalName}</TableCell>
                  <TableCell>{a.ownerName}</TableCell>
                  <TableCell>{a.date} {a.time}</TableCell>
                  <TableCell>{a.reason}</TableCell>
                  <TableCell>{a.veterinarian}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      a.status === 'completed' ? 'bg-success/20 text-success' :
                      a.status === 'cancelled' ? 'bg-destructive/20 text-destructive' :
                      'bg-warning/20 text-warning'
                    }`}>{a.status}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { deleteAppointment(a.id); toast.success('Deleted'); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {(page-1)*ITEMS_PER_PAGE+1}-{Math.min(page*ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page===1} onClick={() => setPage(p => p-1)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" disabled={page===totalPages} onClick={() => setPage(p => p+1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
