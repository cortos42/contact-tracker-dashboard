
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

type EligibilitySubmission = Tables<'eligibility_submissions'>;

type ContactStatus = "nouveau" | "contacté" | "rendez-vous" | "travaux" | "payé";
type MeetingResult = "concluant" | "non-concluant" | "en_attente";
type WorkStatus = "terminé" | "en_cours" | "planifié" | "non_commencé";
type PaymentStatus = "payé" | "partiellement_payé" | "non_payé" | "en_attente";

interface ContactWithStatus extends EligibilitySubmission {
  contactStatus?: ContactStatus;
  meetingResult?: MeetingResult;
  workStatus?: WorkStatus;
  paymentStatus?: PaymentStatus;
}

const RecentContacts: React.FC = () => {
  const [contacts, setContacts] = useState<ContactWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactWithStatus | null>(null);
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
          // Simulate status data (in a real app, this would come from the database)
          const contactsWithStatus: ContactWithStatus[] = data.map(contact => ({
            ...contact,
            contactStatus: Math.random() > 0.5 ? "contacté" : "nouveau",
            meetingResult: ["concluant", "non-concluant", "en_attente"][Math.floor(Math.random() * 3)] as MeetingResult,
            workStatus: ["terminé", "en_cours", "planifié", "non_commencé"][Math.floor(Math.random() * 4)] as WorkStatus,
            paymentStatus: ["payé", "partiellement_payé", "non_payé", "en_attente"][Math.floor(Math.random() * 4)] as PaymentStatus,
          }));
          setContacts(contactsWithStatus);
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

  const getStatusIcon = (status: ContactStatus | undefined) => {
    if (status === "contacté") return <Check className="h-4 w-4 text-green-500" />;
    return <X className="h-4 w-4 text-red-500" />;
  };

  const getMeetingResultIcon = (result: MeetingResult | undefined) => {
    if (!result) return null;
    if (result === "concluant") return <Check className="h-4 w-4 text-green-500" />;
    if (result === "non-concluant") return <X className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-amber-500" />;
  };

  const getWorkStatusBadge = (status: WorkStatus | undefined) => {
    if (!status) return null;
    
    const statusMap = {
      "terminé": { label: "Terminé", variant: "outline" as const, className: "bg-green-100 text-green-800" },
      "en_cours": { label: "En cours", variant: "outline" as const, className: "bg-blue-100 text-blue-800" },
      "planifié": { label: "Planifié", variant: "outline" as const, className: "bg-amber-100 text-amber-800" },
      "non_commencé": { label: "Non commencé", variant: "outline" as const, className: "bg-gray-100 text-gray-800" },
    };
    
    const config = statusMap[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: PaymentStatus | undefined) => {
    if (!status) return null;
    
    const statusMap = {
      "payé": { label: "Payé", variant: "outline" as const, className: "bg-green-100 text-green-800" },
      "partiellement_payé": { label: "Partiellement payé", variant: "outline" as const, className: "bg-amber-100 text-amber-800" },
      "non_payé": { label: "Non payé", variant: "outline" as const, className: "bg-red-100 text-red-800" },
      "en_attente": { label: "En attente", variant: "outline" as const, className: "bg-gray-100 text-gray-800" },
    };
    
    const config = statusMap[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
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
              <TableHead>Téléphone</TableHead>
              <TableHead>Code postal</TableHead>
              <TableHead className="text-center">Infos</TableHead>
              <TableHead className="text-center">Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
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
                      {getStatusIcon(contact.contactStatus)}
                    </div>
                    <div title="Rendez-vous">
                      {getMeetingResultIcon(contact.meetingResult)}
                    </div>
                    <div title="Travaux">
                      {getWorkStatusBadge(contact.workStatus)}
                    </div>
                    <div title="Paiement">
                      {getPaymentStatusBadge(contact.paymentStatus)}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {contacts.length === 0 && (
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
      </CardContent>
    </Card>
  );
};

export default RecentContacts;
