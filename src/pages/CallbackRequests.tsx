
import React from 'react';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import CallbackRequestsTable from '@/components/Callbacks/CallbackRequestsTable';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const CallbackRequests: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // For testing purposes, this function can be used to add test data
  const addTestCallbackRequest = async () => {
    console.log('Adding test callback request...');
    try {
      // Log Supabase client details (without sensitive info)
      console.log('Supabase client information:', {
        url: supabase.supabaseUrl,
        hasKey: !!supabase.supabaseKey,
      });
      
      const { data, error } = await supabase
        .from('callback_requests')
        .insert([
          {
            name: 'Test User',
            phone: '0612345678',
            status: 'pending'
          }
        ])
        .select();

      if (error) {
        console.error('Error adding test data:', error);
        toast({
          title: 'Erreur',
          description: `Impossible d'ajouter les données de test: ${error.message}`,
          variant: 'destructive',
        });
      } else {
        console.log('Test data added successfully:', data);
        toast({
          title: 'Succès',
          description: 'Données de test ajoutées avec succès',
        });
        queryClient.invalidateQueries({ queryKey: ['callback-requests'] });
      }
    } catch (e) {
      console.error('Unexpected error adding test callback request:', e);
      toast({
        title: 'Erreur',
        description: `Une erreur inattendue s'est produite: ${e instanceof Error ? e.message : 'Erreur inconnue'}`,
        variant: 'destructive',
      });
    }
  };

  // Log RLS information on mount
  React.useEffect(() => {
    const checkRLS = async () => {
      try {
        console.log('Checking RLS policies for callback_requests table...');
        const { data, error } = await supabase.rpc('get_policies', { table_name: 'callback_requests' });
        if (error) {
          console.error('Could not check RLS policies:', error);
        } else {
          console.log('RLS policy information:', data);
        }
      } catch (e) {
        console.error('Error checking RLS policies:', e);
      }
    };

    checkRLS().catch(console.error);
  }, []);

  return (
    <Layout>
      <DashboardHeader title="Demandes de rappel" showSearch={false} />
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-muted-foreground">
            Consultez et gérez les demandes de rappel des clients
          </p>
          <div className="space-x-2">
            <Button variant="outline" onClick={addTestCallbackRequest}>
              Ajouter un test
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['callback-requests'] })}
            >
              Rafraîchir les données
            </Button>
          </div>
        </div>
        <CallbackRequestsTable />
      </div>
    </Layout>
  );
};

export default CallbackRequests;
