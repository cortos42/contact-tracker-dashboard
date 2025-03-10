
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import EligibilityTable from '@/components/Contacts/EligibilityTable';
import { supabase } from '@/integrations/supabase/client';
import { EligibilitySubmission } from '@/types/contact';

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
      
      <EligibilityTable 
        submissions={filteredSubmissions} 
        isLoading={isLoading} 
      />
    </Layout>
  );
};

export default Contacts;
