
import { useState, useEffect } from 'react';
import { Check, Clock, PhoneCall, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type CallbackRequest = {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  status: string;
};

const Callbacks = () => {
  const [requests, setRequests] = useState<CallbackRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newRequest, setNewRequest] = useState({ name: '', phone: '' });
  const { toast } = useToast();

  const fetchCallbackRequests = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('callback_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching callback requests:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les demandes de rappel',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    setRequests(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCallbackRequests();
  }, []);

  const handleAddRequest = async () => {
    if (!newRequest.name || !newRequest.phone) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('callback_requests')
      .insert([
        {
          name: newRequest.name,
          phone: newRequest.phone,
          status: 'pending',
        },
      ]);

    if (error) {
      console.error('Error adding callback request:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la demande de rappel',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Succès',
      description: 'Demande de rappel ajoutée avec succès',
    });
    setNewRequest({ name: '', phone: '' });
    setOpenAddDialog(false);
    fetchCallbackRequests();
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('callback_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating callback request status:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Succès',
      description: 'Statut mis à jour avec succès',
    });
    fetchCallbackRequests();
  };

  const deleteRequest = async (id: string) => {
    const { error } = await supabase
      .from('callback_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting callback request:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la demande de rappel',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Succès',
      description: 'Demande de rappel supprimée avec succès',
    });
    fetchCallbackRequests();
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "d MMMM yyyy 'à' HH:mm", { locale: fr });
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'completed':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Complété';
      default:
        return 'Inconnu';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Demandes de rappel</CardTitle>
              <CardDescription>Gérez les demandes de rappel clients</CardDescription>
            </div>
            <Button onClick={() => setOpenAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle demande
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">Chargement...</div>
            ) : requests.length === 0 ? (
              <div className="py-8 text-center">Aucune demande de rappel pour le moment</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Date de demande</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.phone}</TableCell>
                      <TableCell>{formatDate(request.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          {getStatusLabel(request.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Select
                            value={request.status}
                            onValueChange={(value) => updateStatus(request.id, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente ⏳</SelectItem>
                              <SelectItem value="completed">Complété ✅</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteRequest(request.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog pour ajouter une nouvelle demande */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle demande de rappel</DialogTitle>
            <DialogDescription>
              Ajouter une nouvelle demande de rappel client
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={newRequest.name}
                onChange={(e) => setNewRequest({ ...newRequest, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="phone"
                value={newRequest.phone}
                onChange={(e) => setNewRequest({ ...newRequest, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddRequest}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Callbacks;
