
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface EligibilitySubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  postal_code: string;
}

interface ContactDocument {
  id: string;
  contact_id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  upload_date: string;
}

export const useContactDocuments = () => {
  const [selectedContact, setSelectedContact] = useState<string>('');
  const { toast } = useToast();

  // Fetch contacts from Supabase (eligibility submissions)
  const { 
    data: contacts = [], 
    isLoading: isLoadingContacts 
  } = useQuery({
    queryKey: ['eligibility-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eligibility_submissions')
        .select('id, name, email, phone, postal_code');
        
      if (error) {
        console.error('Error fetching contacts:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les contacts",
          variant: "destructive",
        });
        return [];
      }
      return data as EligibilitySubmission[];
    }
  });

  // Fetch documents for selected contact
  const { 
    data: documents = [], 
    isLoading: isLoadingDocuments 
  } = useQuery({
    queryKey: ['contact-documents', selectedContact],
    queryFn: async () => {
      if (!selectedContact) return [];
      
      const { data, error } = await supabase
        .from('contact_documents')
        .select('*')
        .eq('contact_id', selectedContact);
        
      if (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les documents",
          variant: "destructive",
        });
        return [];
      }
      return data as ContactDocument[];
    },
    enabled: !!selectedContact
  });

  return {
    contacts,
    isLoadingContacts,
    documents,
    isLoadingDocuments,
    selectedContact,
    setSelectedContact
  };
};
