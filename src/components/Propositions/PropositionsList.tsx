
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Check, X, Clock, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generatePropositionPDF } from "@/utils/pdfGenerator";

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
  pdfUrl?: string;
}

const PropositionsList: React.FC = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<ContactWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactWithStatus | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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

  const handleViewDetails = (contact: ContactWithStatus) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleGeneratePDF = async (contact: ContactWithStatus) => {
    try {
      setIsGeneratingPdf(true);
      toast({
        title: "Génération en cours",
        description: "Le PDF est en cours de génération...",
      });

      // Create mock proposition data
      const propositionData = {
        client: {
          nom: contact.name,
          adresse: `Adresse non spécifiée, ${contact.postal_code}`,
          email: contact.email,
          telephone: contact.phone
        },
        travaux: {
          combles: {
            materiau: "Laine de roche",
            surface: "80m²"
          },
          murs: {
            methode: "interieur" as const,
            materiau: "Isolation thermique",
            surface: "120m²"
          },
          chauffage: {
            actuel: "Chauffage électrique",
            remplacement: "Pompe à chaleur"
          }
        },
        financier: {
          coutTotal: "15000€",
          montantSubventions: "8000€",
          restantCharge: "7000€"
        }
      };

      // Mock signature
      const signatureDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAABmJLR0QA/wD/AP+gvaeTAAAD+UlEQVR4nO2cz2sTQRTHv292s1sKtlBtoeK1j0OLeBE82Av9L3rv2ZsX/wEP/gX+CYIexLMe9OA9Yv0uFUUU0tpkd8dDktimaXffpjOb7X4OC2HevPdl8s3MvhkgkUgkEolEIpFIJLqKUuvYmvPbQ24+HMqR49WkJfgcOkC18TkANAB4h8jWU6RrvprmD0J3VFXnp0Cds4A9A5gbAp0B9PQf4M64HJz8Bl1fqOZ6M/SgmXB1TgfrXmR1lKWsQLVMeOwEYgUQvgTMDcA+B/A0YI5KHaBXAKk/XoXYCTCrkwxbcC1C1ZwPzNwLAP1Oo++AXdmrfDOh7j1+Ae4lwN3W6F8s4LoICmTNtQHcCjagR0jHwSr8jjQbvQR7OxqTh8HqrEH6aAHX9bK+A/gZFOlSHq9dP1YgBfxEWYyv9jyG8zZYnXVoXqN5jRaszmtAHkbj0gE0ZTDwcVlRJqNjxTXn+yKocxuQpyOG3YNdLoK7Kpo/AO63RveXgz5ZhsWO4LRZtsdOcPoBsA/H4FBF/UHH7e7zCSBPjsFhsBrtkI7ZZV1fDGF9uqzo1qWMMg/ImeiNEtLvyHnsbSuG0Q+ABBYbBm+R0cQF0nC1X5zLmgGMzyvk1g0LNEUgnXHJXQYJZIeqyxo+oCkHaXO+P1WZVrRZVQIZhVuJ/n7GQ/pQZCwD6YzbmnHf7U+oGLRLfZhj2LQ1bXZFf0NUlyULw+NCAlmD1JfzgboSyBrkYB5GmEBGUXZZDhAfAtGTQMaQDKRXKbN1BUdD/QoMhDvcj4gDo0yd1O5r1B5gfCDOtEcvkUgkEolEIpFIJKaT4HeIP7dVB2BfAdwFyBfg/4bN+tJZaHoB0B3AnASoHzCmANMcvs0vAbwH8BnAJ4CXAPsWrOuALYFl9KBV/p4ZegeAu4A+CtaO9LsOLXeG59YA8xqwTwC8BfAewHtAPoF1fVDTvmDtAJPudfAryuuL64DcAXARoHOAngdoDqCz/cWy/wqTLdnPwP4AcBMwTwD5Cq7VADZtcMcPQAr4ieyNmh+GJ/4K0OO4aUwT8gU6Lx/C3AJoBsDloWZGZ0APgLZ+A2UZrO0I7NLBsQOoQ5g7AP/vjSwLWAf7rH+r0X+l6E8w9/q7sQAA+iKY36H5PrxaCfYMzPMwbxTmP0G2LqJ15ztA50EbHTcPTwENyP3I5WY3IF+FzUOwNsC8DOo9gBdBB/ZgcKt7YJ+HeT12qz1gp7CxqYzZYQ4AvAfLVdDWIaVyBqzVyF+GsHuH0zsABmBzD6znWmN3aNRqQpUXwNQEeG347qoCqk0L9KMuWr4O1v8BrUg2XxnNmOoAAAAASUVORK5CYII=";

      // Generate PDF
      const pdfUrl = await generatePropositionPDF(propositionData, signatureDataURL);
      
      // Update contacts with PDF URL
      setContacts(prev => 
        prev.map(c => c.id === contact.id ? { ...c, pdfUrl } : c)
      );

      toast({
        title: "PDF généré",
        description: "Le PDF a été généré avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownload = (contact: ContactWithStatus) => {
    if (!contact.pdfUrl) {
      toast({
        title: "Erreur",
        description: "Le PDF n'est pas disponible pour cette proposition.",
        variant: "destructive",
      });
      return;
    }

    // Créer un lien temporaire pour le téléchargement
    const link = document.createElement('a');
    link.href = contact.pdfUrl;
    link.download = `Proposition_${contact.name}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement démarré",
      description: "Le PDF a été téléchargé avec succès.",
    });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'Pp', { locale: fr });
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
      <div className="text-center py-8">
        <p className="text-muted-foreground">Chargement des données...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun contact trouvé dans la base de données</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Code Postal</TableHead>
              <TableHead>Type de logement</TableHead>
              <TableHead className="text-center">Contacté</TableHead>
              <TableHead className="text-center">Rendez-vous</TableHead>
              <TableHead className="text-center">Travaux</TableHead>
              <TableHead className="text-center">Paiement</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.postal_code}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {contact.property_type}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {getStatusIcon(contact.contactStatus)}
                </TableCell>
                <TableCell className="text-center">
                  {getMeetingResultIcon(contact.meetingResult)}
                </TableCell>
                <TableCell className="text-center">
                  {getWorkStatusBadge(contact.workStatus)}
                </TableCell>
                <TableCell className="text-center">
                  {getPaymentStatusBadge(contact.paymentStatus)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(contact)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    {contact.pdfUrl ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(contact)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGeneratePDF(contact)}
                        disabled={isGeneratingPdf}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Générer PDF
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
    </div>
  );
};

export default PropositionsList;
