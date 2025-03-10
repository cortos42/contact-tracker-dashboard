
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Search, Info, Check, X, Clock, CircleDollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { EligibilitySubmission } from '@/types/contact';
import ContactsTable from '@/components/Contacts/ContactsTable';

const Contacts: React.FC = () => {
  const [submissions, setSubmissions] = useState<EligibilitySubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<EligibilitySubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data initially
  useEffect(() => {
    fetchSubmissions();
    
    // Setup real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'eligibility_submissions'
        },
        () => {
          fetchSubmissions(); // Refetch on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter data when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSubmissions(submissions);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = submissions.filter(
      (submission) =>
        submission.name?.toLowerCase().includes(term) ||
        submission.email?.toLowerCase().includes(term) ||
        submission.phone?.toLowerCase().includes(term) ||
        submission.postal_code?.toLowerCase().includes(term)
    );
    
    setFilteredSubmissions(filtered);
  }, [searchTerm, submissions]);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('eligibility_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        throw error;
      }

      setSubmissions(data || []);
      setFilteredSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching eligibility submissions:', error);
      toast.error('Erreur lors du chargement des soumissions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Contacts</h1>

        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher par nom, email, téléphone ou code postal..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <ContactsTable 
        submissions={filteredSubmissions} 
        isLoading={isLoading} 
      />
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Légende des icônes:</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" /> 
            <span>Contacté / Rendez-vous concluant / Travaux terminés</span>
          </li>
          <li className="flex items-center gap-2">
            <X className="h-4 w-4 text-red-500" /> 
            <span>Non contacté / Rendez-vous non concluant / Travaux non commencés</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" /> 
            <span>Rendez-vous en attente / Travaux planifiés</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" /> 
            <span>Travaux en cours</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4 text-green-500" /> 
            <span>Payé</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4 text-amber-500" /> 
            <span>Paiement partiellement payé</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4 text-red-500" /> 
            <span>Paiement non payé</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" /> 
            <span>Paiement en attente</span>
          </li>
        </ul>
      </div>
    </Layout>
  );
};

export default Contacts;
