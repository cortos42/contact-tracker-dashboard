
import { supabase } from '@/integrations/supabase/client';

export const setupRealtimeForTable = (
  tableName: string, 
  eventType: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*',
  callback: () => void
) => {
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: eventType,
        schema: 'public',
        table: tableName
      },
      () => {
        callback();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
