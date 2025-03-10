
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

type EligibilitySubmission = Tables<'eligibility_submissions'>;

const statusColors: Record<string, string> = {
  nouveau: 'bg-gray-500',
  contacté: 'bg-indigo-500',
  'rendez-vous': 'bg-amber-500',
  travaux: 'bg-blue-500',
  payé: 'bg-emerald-500',
};

const RecentContacts: React.FC = () => {
  const [contacts, setContacts] = useState<EligibilitySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchContacts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('eligibility_submissions')
          .select('*')
          .order('submitted_at', { ascending: false })
          .limit(5);
        
        if (error) {
          console.error("Erreur lors de la récupération des contacts:", error);
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les contacts de la base de données.",
            variant: "destructive",
          });
        } else if (data) {
          setContacts(data);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, [toast]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'PPP', { locale: fr });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contacts récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">Chargement des contacts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts récents</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Téléphone</TableHead>
              <TableHead className="hidden md:table-cell">Date de soumission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">
                  <Link
                    to={`/contacts/${contact.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {contact.name}
                  </Link>
                </TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell className="hidden md:table-cell">{contact.phone}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(contact.submitted_at)}
                </TableCell>
              </TableRow>
            ))}
            {contacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Aucun contact récent à afficher
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Link
            to="/contacts"
            className="text-fhhabitat hover:text-fhhabitat/80 text-sm font-medium"
          >
            Voir tous les contacts →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentContacts;
