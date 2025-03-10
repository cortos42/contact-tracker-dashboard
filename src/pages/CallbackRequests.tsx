
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
        description: 'Données de test ajoutées',
      });
      queryClient.invalidateQueries({ queryKey: ['callback-requests'] });
    }
  };

  return (
    <Layout>
      <DashboardHeader title="Demandes de rappel" showSearch={false} />
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-muted-foreground">
            Consultez et gérez les demandes de rappel des clients
          </p>
          {/* This button is temporarily here for testing - you can remove it in production */}
          <Button variant="outline" onClick={addTestCallbackRequest}>
            Ajouter un test
          </Button>
        </div>
        <CallbackRequestsTable />
      </div>
    </Layout>
  );
};

export default CallbackRequests;
