
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Fixed channel configuration for Supabase Realtime
export const channel = supabase.channel("custom-all-channel", {
  config: {
    broadcast: { self: true },
  },
});

// Configure the channel to listen for changes
channel.on(
  'postgres_changes',
  {
    event: '*',
    schema: 'public',
    table: 'contacts',
  },
  (payload) => {
    console.log("Change received!", payload);
  }
);
