
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type EligibilitySubmission = Tables<'eligibility_submissions'>;

const PropositionsList: React.FC = () => {
  const { toast } = useToast();
  const [databaseContacts, setDatabaseContacts] = useState<EligibilitySubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('eligibility_submissions')
          .select('*');
        
        if (error) {
          console.error("Erreur lors de la récupération des contacts:", error);
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les contacts de la base de données.",
            variant: "destructive",
          });
        } else if (data) {
          setDatabaseContacts(data);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, [toast]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Chargement des données...</p>
      </div>
    );
  }

  if (databaseContacts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun contact trouvé dans la base de données</p>
      </div>
    );
  }

  const handleDownload = (pdfUrl?: string) => {
    if (!pdfUrl) {
      toast({
        title: "Erreur",
        description: "Le PDF n'est pas disponible pour cette proposition.",
        variant: "destructive",
      });
      return;
    }

    // Créer un lien temporaire pour le téléchargement
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `Proposition_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement démarré",
      description: "Le PDF a été généré avec succès.",
    });
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Code Postal</TableHead>
            <TableHead>Type de logement</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {databaseContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.phone}</TableCell>
              <TableCell>{contact.postal_code}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {contact.property_type}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Information",
                        description: "Aucun PDF disponible pour ce contact actuellement.",
                      });
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Générer PDF
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PropositionsList;
