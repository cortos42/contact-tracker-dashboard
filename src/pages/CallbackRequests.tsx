
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
      // Log Supabase client information without accessing protected properties
      console.log('Attempting to connect to Supabase...');
      
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

  // Test Supabase connection on mount
  React.useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase
          .from('callback_requests')
          .select('count');
        
        if (error) {
          console.error('Supabase connection test failed:', error);
        } else {
          console.log('Supabase connection successful:', data);
        }
      } catch (e) {
        console.error('Unexpected error testing Supabase connection:', e);
      }
    };

    testConnection();
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
