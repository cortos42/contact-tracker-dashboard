
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CallbackRequest {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  status: 'pending' | 'completed';
}

const CallbackRequestsTable: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch callback requests with improved error handling
  const { data: callbackRequests = [], isLoading, error } = useQuery({
    queryKey: ['callback-requests'],
    queryFn: async () => {
      console.log('Fetching callback requests...');
      const { data, error } = await supabase
        .from('callback_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching callback requests:', error);
        throw new Error(error.message);
      }
      
      console.log('Fetched callback requests:', data);
      return data as CallbackRequest[];
    },
  });

  // Update callback request status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      console.log(`Updating status for request ${id} to ${status}`);
      const { error } = await supabase
        .from('callback_requests')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callback-requests'] });
      toast({
        title: 'Succès',
        description: 'Statut mis à jour avec succès',
      });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  // Log state for debugging
  console.log('Current state:', { isLoading, error, callbackRequests });

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Impossible de charger les demandes de rappel. Veuillez réessayer plus tard.
          {error instanceof Error ? ` (${error.message})` : ''}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Date et heure</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[110px]" /></TableCell>
                </TableRow>
              ))
            ) : callbackRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  Aucune demande de rappel trouvée
                </TableCell>
              </TableRow>
            ) : (
              callbackRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>{request.phone}</TableCell>
                  <TableCell>
                    {format(new Date(request.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={request.status}
                      onValueChange={(value) => handleStatusChange(request.id, value)}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Statut">
                          {request.status === 'pending' ? '⏳ En attente' : '✅ Complété'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">⏳ En attente</SelectItem>
                        <SelectItem value="completed">✅ Complété</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default CallbackRequestsTable;
