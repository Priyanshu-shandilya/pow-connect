import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Animal } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 6;
const animalTypes = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Hamster', 'Other'];

const emptyForm = { name: '', type: 'Dog', breed: '', age: 0, ownerName: '', ownerPhone: '', notes: '' };

const AnimalsPage: React.FC = () => {
  const { animals, addAnimal, updateAnimal, deleteAnimal } = useData();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    return animals.filter(a => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.ownerName.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || a.type === filterType;
      return matchSearch && matchType;
    });
  }, [animals, search, filterType]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };
  const openEdit = (a: Animal) => {
    setForm({ name: a.name, type: a.type, breed: a.breed, age: a.age, ownerName: a.ownerName, ownerPhone: a.ownerPhone, notes: a.notes || '' });
    setEditingId(a.id);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.breed || !form.ownerName) { toast.error('Please fill required fields'); return; }
    if (editingId) {
      updateAnimal(editingId, form);
      toast.success('Animal updated');
    } else {
      addAnimal(form);
      toast.success('Animal added');
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteAnimal(id);
    toast.success('Animal removed');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Animals</h1>
          <p className="text-muted-foreground">Manage your registered animals</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add Animal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Animal' : 'Add New Animal'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{animalTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Breed *</Label>
                  <Input value={form.breed} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input type="number" min={0} value={form.age} onChange={e => setForm(f => ({ ...f, age: +e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Owner Name *</Label>
                  <Input value={form.ownerName} onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Owner Phone</Label>
                  <Input value={form.ownerPhone} onChange={e => setForm(f => ({ ...f, ownerPhone: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <Button type="submit" className="w-full">{editingId ? 'Update' : 'Add Animal'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or owner..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
        </div>
        <Select value={filterType} onValueChange={v => { setFilterType(v); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Filter type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {animalTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No animals found</TableCell></TableRow>
              ) : paginated.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">{a.type}</span></TableCell>
                  <TableCell>{a.breed}</TableCell>
                  <TableCell>{a.age} yrs</TableCell>
                  <TableCell>{a.ownerName}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
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

export default AnimalsPage;
