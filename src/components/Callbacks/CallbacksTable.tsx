
import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, Clock, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CallbackRequest = {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  status: string;
};

type CallbacksTableProps = {
  requests: CallbackRequest[];
  isLoading: boolean;
  onRequestsChanged: () => void;
};

const CallbacksTable = ({ requests, isLoading, onRequestsChanged }: CallbacksTableProps) => {
  const { toast } = useToast();

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "d MMMM yyyy 'à' HH:mm", { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
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

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('callback_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating callback request status:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de mettre à jour le statut: ' + error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Succès',
        description: 'Statut mis à jour avec succès',
      });
      onRequestsChanged();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur inattendue est survenue',
        variant: 'destructive',
      });
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('callback_requests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting callback request:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer la demande de rappel: ' + error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Succès',
        description: 'Demande de rappel supprimée avec succès',
      });
      onRequestsChanged();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur inattendue est survenue',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center">Chargement...</div>;
  }

  if (requests.length === 0) {
    return <div className="py-8 text-center">Aucune demande de rappel pour le moment</div>;
  }

  return (
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
  );
};

export default CallbacksTable;
