
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { PhoneCall, Check, Clock, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CallbackRequest {
  id: string;
  name: string;
  phone: string;
  status: string;
  created_at: string;
}

const fetchCallbackRequests = async (): Promise<CallbackRequest[]> => {
  const { data, error } = await supabase
    .from('callback_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const CallbackRequests = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({ name: '', phone: '' });

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['callbackRequests'],
    queryFn: fetchCallbackRequests,
  });

  const addCallbackRequest = useMutation({
    mutationFn: async (request: { name: string; phone: string }) => {
      const { data, error } = await supabase
        .from('callback_requests')
        .insert([
          { 
            name: request.name, 
            phone: request.phone,
            status: 'pending'
          }
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callbackRequests'] });
      setNewRequest({ name: '', phone: '' });
      setOpen(false);
      toast({
        title: "Demande créée",
        description: "La demande de rappel a été créée avec succès",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la demande", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la demande de rappel",
        variant: "destructive",
      });
    },
  });

  const updateCallbackStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('callback_requests')
        .update({ status })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callbackRequests'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la demande a été mis à jour",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du statut", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    },
  });

  const deleteCallbackRequest = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('callback_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callbackRequests'] });
      toast({
        title: "Demande supprimée",
        description: "La demande de rappel a été supprimée",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la demande",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRequest.name.trim() === '' || newRequest.phone.trim() === '') {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }
    addCallbackRequest.mutate(newRequest);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    updateCallbackStatus.mutate({ id, status: newStatus });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1" /> Complété</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> En attente</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Demandes de rappel</h1>
          <p className="text-gray-500 mt-1">Gérez les demandes de rappel des clients</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-fhhabitat hover:bg-fhhabitat/90">
              <Plus className="mr-2 h-4 w-4" /> Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle demande de rappel</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={newRequest.name}
                    onChange={(e) => setNewRequest({ ...newRequest, name: e.target.value })}
                    placeholder="Nom du client"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={newRequest.phone}
                    onChange={(e) => setNewRequest({ ...newRequest, phone: e.target.value })}
                    placeholder="Numéro de téléphone"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={addCallbackRequest.isPending}
                  className="bg-fhhabitat hover:bg-fhhabitat/90"
                >
                  {addCallbackRequest.isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    'Créer la demande'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes les demandes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <RefreshCw className="h-6 w-6 animate-spin text-fhhabitat" />
            </div>
          ) : error ? (
            <Alert>
              <AlertDescription>
                Une erreur s'est produite lors du chargement des demandes.
              </AlertDescription>
            </Alert>
          ) : requests && requests.length > 0 ? (
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
                    <TableCell>
                      {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Select
                          value={request.status}
                          onValueChange={(value) => handleStatusChange(request.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="completed">Complété</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteCallbackRequest.mutate(request.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-8">
              <PhoneCall className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande</h3>
              <p className="mt-1 text-sm text-gray-500">
                Vous n'avez pas encore de demandes de rappel.
              </p>
              <div className="mt-6">
                <DialogTrigger asChild>
                  <Button className="bg-fhhabitat hover:bg-fhhabitat/90">
                    <Plus className="mr-2 h-4 w-4" /> Nouvelle demande
                  </Button>
                </DialogTrigger>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default CallbackRequests;
