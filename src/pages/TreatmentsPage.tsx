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

const emptyForm = { animalId: '', animalName: '', medicine: '', description: '', cost: 0, date: '', status: 'ongoing' as 'ongoing' | 'completed' };

const TreatmentsPage: React.FC = () => {
  const { treatments, animals, addTreatment, updateTreatment, deleteTreatment } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    return treatments.filter(t => {
      const matchSearch = t.animalName.toLowerCase().includes(search.toLowerCase()) || t.medicine.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || t.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [treatments, search, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };
  const openEdit = (t: typeof treatments[0]) => {
    setForm({ animalId: t.animalId, animalName: t.animalName, medicine: t.medicine, description: t.description, cost: t.cost, date: t.date, status: t.status });
    setEditingId(t.id);
    setDialogOpen(true);
  };

  const handleAnimalSelect = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (animal) setForm(f => ({ ...f, animalId, animalName: animal.name }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.animalName || !form.medicine || !form.date) { toast.error('Please fill required fields'); return; }
    if (editingId) {
      updateTreatment(editingId, form);
      toast.success('Treatment updated');
    } else {
      addTreatment(form);
      toast.success('Treatment added');
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Treatments</h1>
          <p className="text-muted-foreground">Track medications and treatment history</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add Treatment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Treatment' : 'Add Treatment'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Animal *</Label>
                  <Select value={form.animalId} onValueChange={handleAnimalSelect}>
                    <SelectTrigger><SelectValue placeholder="Select animal" /></SelectTrigger>
                    <SelectContent>{animals.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Medicine *</Label>
                  <Input value={form.medicine} onChange={e => setForm(f => ({ ...f, medicine: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Cost ($)</Label>
                  <Input type="number" min={0} step={0.01} value={form.cost} onChange={e => setForm(f => ({ ...f, cost: +e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              {editingId && (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v: 'ongoing' | 'completed') => setForm(f => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button type="submit" className="w-full">{editingId ? 'Update' : 'Add Treatment'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by animal or medicine..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
        </div>
        <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal</TableHead>
                <TableHead>Medicine</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No treatments found</TableCell></TableRow>
              ) : paginated.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.animalName}</TableCell>
                  <TableCell>{t.medicine}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{t.description}</TableCell>
                  <TableCell>${t.cost}</TableCell>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.status === 'completed' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                    }`}>{t.status}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { deleteTreatment(t.id); toast.success('Deleted'); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

export default TreatmentsPage;
