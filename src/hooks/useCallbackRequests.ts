
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type CallbackRequest = {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  status: string;
};

export const useCallbackRequests = () => {
  const [requests, setRequests] = useState<CallbackRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCallbackRequests = async () => {
    setIsLoading(true);
    console.log("Fetching callback requests...");
    
    try {
      const { data, error } = await supabase
        .from('callback_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching callback requests:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les demandes de rappel: ' + error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      console.log("Callback requests received:", data);
      setRequests(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur inattendue est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCallbackRequests();
  }, []);

  return { requests, isLoading, refetch: fetchCallbackRequests };
};

export default useCallbackRequests;
