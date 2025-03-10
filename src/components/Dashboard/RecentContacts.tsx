
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Check, X, Clock, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type EligibilitySubmission = Tables<'eligibility_submissions'>;
type Project = Tables<'projects'>;

interface ContactWithStatus extends EligibilitySubmission {
  project?: Project;
}

const RecentContacts: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<ContactWithStatus | null>(null);
  const { toast } = useToast();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['recentContacts'],
    queryFn: async () => {
      try {
        // Fetch recent eligibility submissions
        const { data: submissions, error: submissionError } = await supabase
          .from('eligibility_submissions')
          .select('*')
          .order('submitted_at', { ascending: false })
          .limit(5);
        
        if (submissionError) throw submissionError;
        
        // Get associated projects
        const contactsWithProjects: ContactWithStatus[] = [];
        
        for (const submission of submissions || []) {
          const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('*')
            .eq('eligibility_submission_id', submission.id)
            .maybeSingle();
            
          if (projectError) {
            console.error("Error fetching project:", projectError);
          }
          
          contactsWithProjects.push({
            ...submission,
            project: project || undefined
          });
        }
        
        return contactsWithProjects;
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les contacts.",
          variant: "destructive",
        });
        return [];
      }
    }
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'PPP', { locale: fr });
  };

  const getStatusIcon = (status?: string) => {
    if (status === "success") return <Check className="h-4 w-4 text-green-500" />;
    if (status === "failure") return <X className="h-4 w-4 text-red-500" />;
    return <X className="h-4 w-4 text-red-500" />;
  };

  const getMeetingResultIcon = (result?: string) => {
    if (!result) return null;
    if (result === "success") return <Check className="h-4 w-4 text-green-500" />;
    if (result === "failure") return <X className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-amber-500" />;
  };

  const getWorkStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusMap = {
      "completed": { label: "Terminé", variant: "outline" as const, className: "bg-green-100 text-green-800" },
      "in_progress": { label: "En cours", variant: "outline" as const, className: "bg-blue-100 text-blue-800" },
      "not_started": { label: "Non commencé", variant: "outline" as const, className: "bg-gray-100 text-gray-800" },
    };
    
    const config = statusMap[status as keyof typeof statusMap] || statusMap["not_started"];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusMap = {
      "paid": { label: "Payé", variant: "outline" as const, className: "bg-green-100 text-green-800" },
      "pending": { label: "En attente", variant: "outline" as const, className: "bg-amber-100 text-amber-800" },
      "rejected": { label: "Refusé", variant: "outline" as const, className: "bg-red-100 text-red-800" },
    };
    
    const config = statusMap[status as keyof typeof statusMap] || statusMap["pending"];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
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
              <TableHead>Téléphone</TableHead>
              <TableHead>Code postal</TableHead>
              <TableHead className="text-center">Infos</TableHead>
              <TableHead className="text-center">Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts && contacts.length > 0 ? contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.postal_code}</TableCell>
                <TableCell className="text-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedContact(contact)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Détails du contact</DialogTitle>
                        <DialogDescription>
                          Informations complètes sur le contact
                        </DialogDescription>
                      </DialogHeader>
                      {selectedContact && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">ID:</p>
                              <p className="text-sm text-muted-foreground">{selectedContact.id}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Nom:</p>
                              <p className="text-sm text-muted-foreground">{selectedContact.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Email:</p>
                              <p className="text-sm text-muted-foreground">{selectedContact.email}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Téléphone:</p>
                              <p className="text-sm text-muted-foreground">{selectedContact.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Code postal:</p>
                              <p className="text-sm text-muted-foreground">{selectedContact.postal_code}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Type de propriété:</p>
                              <p className="text-sm text-muted-foreground">{selectedContact.property_type}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Année de construction:</p>
                              <p className="text-sm text-muted-foreground">{selectedContact.construction_year}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Occupants:</p>
                              <p className="text-sm text-muted-foreground">{selectedContact.occupants}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Statut d'occupation:</p>
                              <p className="text-sm text-muted-foreground">{selectedContact.occupancy_status || "Non spécifié"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Tranche de revenus:</p>
                              <p className="text-sm text-muted-foreground">{selectedContact.income_range || "Non spécifié"}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm font-medium">Date de soumission:</p>
                              <p className="text-sm text-muted-foreground">{formatDate(selectedContact.submitted_at)}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm font-medium">Travaux prévus:</p>
                              <p className="text-sm text-muted-foreground">
                                {selectedContact.planned_works && selectedContact.planned_works.length > 0
                                  ? selectedContact.planned_works.join(", ")
                                  : "Non spécifié"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center space-x-2">
                    <div title="Contacté">
                      {getStatusIcon(contact.project?.contact_status)}
                    </div>
                    <div title="Rendez-vous">
                      {getMeetingResultIcon(contact.project?.appointment_status)}
                    </div>
                    <div title="Travaux">
                      {getWorkStatusBadge(contact.project?.work_status)}
                    </div>
                    <div title="Paiement">
                      {getPaymentStatusBadge(contact.project?.payment_status)}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Aucun contact récent à afficher
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Link
            to="/contacts"
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Voir tous les contacts →
          </Link>
        </div>
        <div className="mt-4 text-xs text-muted-foreground border-t pt-2">
          <p className="font-medium mb-1">Légende des statuts :</p>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-500" /> Contacté / ✓ Rendez-vous réussi
            </li>
            <li className="flex items-center gap-2">
              <X className="h-3 w-3 text-red-500" /> Non contacté / ✗ Rendez-vous non concluant
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-amber-500" /> Rendez-vous en attente
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="h-4 bg-green-100 text-green-800 text-xs">Terminé</Badge> Travaux terminés
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="h-4 bg-blue-100 text-blue-800 text-xs">En cours</Badge> Travaux en cours
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="h-4 bg-gray-100 text-gray-800 text-xs">Non commencé</Badge> Travaux non commencés
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentContacts;
