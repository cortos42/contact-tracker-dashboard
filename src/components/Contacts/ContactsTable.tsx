
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { EligibilitySubmission } from '@/types/contact';
import { Info, Check, X, Clock, CircleDollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ContactsTableProps {
  submissions: EligibilitySubmission[];
  isLoading: boolean;
}

// Update the types to match the database enums
type ContactStatus = "nouveau" | "contacté";
type MeetingResult = "concluant" | "non-concluant" | "en_attente";
type WorkStatus = "terminé" | "en_cours" | "planifié" | "non_commencé";
type PaymentStatus = "payé" | "partiellement_payé" | "non_payé" | "en_attente";

interface ContactWithStatus extends EligibilitySubmission {
  contactStatus?: ContactStatus;
  meetingResult?: MeetingResult;
  workStatus?: WorkStatus;
  paymentStatus?: PaymentStatus;
  comment?: string;
  projectId?: string;
}

const ContactsTable: React.FC<ContactsTableProps> = ({ submissions, isLoading }) => {
  const [selectedContact, setSelectedContact] = useState<ContactWithStatus | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contacts, setContacts] = useState<ContactWithStatus[]>([]);
  
  // Initialize contacts with submissions data
  useEffect(() => {
    if (submissions.length > 0) {
      // Fetch project data for each submission
      const fetchProjectData = async () => {
        const contactsWithStatus: ContactWithStatus[] = [...submissions];
        
        for (let contact of contactsWithStatus) {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('eligibility_submission_id', contact.id)
            .single();
          
          if (error) {
            console.error('Error fetching project for contact', contact.id, error);
          }
          
          if (data) {
            // Map project data to contact
            contact.projectId = data.id;
            
            // Log the actual data from the database
            console.log('Project data from DB:', data);
            
            // Fix the value mappings here to match database enums
            contact.contactStatus = data.contact_status === 'success' ? 'contacté' : 'nouveau';
            
            if (data.appointment_status === 'success') {
              contact.meetingResult = 'concluant';
            } else if (data.appointment_status === 'failure') {
              contact.meetingResult = 'non-concluant';
            } else {
              contact.meetingResult = 'en_attente';
            }
            
            // Update work status mapping
            if (data.work_status === 'completed') {
              contact.workStatus = 'terminé';
            } else if (data.work_status === 'in_progress') {
              contact.workStatus = 'en_cours';
            } else if (data.work_status === 'not_started') {
              contact.workStatus = 'non_commencé';
            } else {
              contact.workStatus = 'planifié';
            }
            
            // Update payment status mapping
            if (data.payment_status === 'paid') {
              contact.paymentStatus = 'payé';
            } else if (data.payment_status === 'pending') {
              contact.paymentStatus = 'en_attente';
            } else if (data.payment_status === 'rejected') {
              contact.paymentStatus = 'non_payé';
            } else {
              contact.paymentStatus = 'partiellement_payé'; 
            }
            
            contact.comment = data.contact_comment;
          } else {
            console.log('No project data found for contact', contact.id);
          }
        }
        
        console.log('Contacts with status:', contactsWithStatus);
        setContacts(contactsWithStatus);
      };
      
      fetchProjectData();
    }
  }, [submissions]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'Pp', { locale: fr });
  };

  const handleViewDetails = (contact: ContactWithStatus) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };
  
  const handleStatusChange = async (
    contact: ContactWithStatus, 
    field: 'contactStatus' | 'meetingResult' | 'workStatus' | 'paymentStatus', 
    value: string
  ) => {
    try {
      // Map UI field names to database field names
      const fieldMappings: Record<string, string> = {
        'contactStatus': 'contact_status',
        'meetingResult': 'appointment_status',
        'workStatus': 'work_status',
        'paymentStatus': 'payment_status'
      };
      
      // Fix the value mappings to match the database enums
      const valueMappings: Record<string, Record<string, string>> = {
        'contactStatus': {
          'contacté': 'success',
          'nouveau': 'pending'
        },
        'meetingResult': {
          'concluant': 'success',
          'non-concluant': 'failure',
          'en_attente': 'pending'
        },
        'workStatus': {
          'terminé': 'completed',
          'en_cours': 'in_progress',
          'planifié': 'not_started',
          'non_commencé': 'not_started'
        },
        'paymentStatus': {
          'payé': 'paid',
          'partiellement_payé': 'partial',
          'non_payé': 'rejected',
          'en_attente': 'pending'
        }
      };
      
      const dbField = fieldMappings[field];
      const dbValue = valueMappings[field][value as any];
      
      console.log(`Updating ${dbField} to ${dbValue} for contact ${contact.id}`);
      
      if (!contact.projectId) {
        // Create a new project if it doesn't exist
        console.log('Creating new project for contact', contact.id);
        const { data, error } = await supabase
          .from('projects')
          .insert({
            eligibility_submission_id: contact.id,
            [dbField]: dbValue
          })
          .select()
          .single();
          
        if (error) {
          console.error('Error creating project:', error);
          throw error;
        }
        
        // Update the contact with the new project ID
        if (data) {
          contact.projectId = data.id;
          console.log('Created new project:', data.id);
        }
      } else {
        // Update existing project
        console.log('Updating existing project', contact.projectId);
        const { error } = await supabase
          .from('projects')
          .update({ [dbField]: dbValue })
          .eq('id', contact.projectId);
          
        if (error) {
          console.error('Error updating project:', error);
          throw error;
        }
        
        console.log(`Updated project ${contact.projectId} successfully`);
      }
      
      // Update local state
      setContacts(prev => prev.map(c => {
        if (c.id === contact.id) {
          return {
            ...c,
            [field]: value
          };
        }
        return c;
      }));
      
      toast.success('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };
  
  const handleCommentChange = async (contact: ContactWithStatus, comment: string) => {
    try {
      if (!contact.projectId) {
        // Create a new project if it doesn't exist
        console.log('Creating new project with comment for contact', contact.id);
        const { data, error } = await supabase
          .from('projects')
          .insert({
            eligibility_submission_id: contact.id,
            contact_comment: comment
          })
          .select()
          .single();
          
        if (error) {
          console.error('Error creating project with comment:', error);
          throw error;
        }
        
        // Update the contact with the new project ID
        if (data) {
          contact.projectId = data.id;
          console.log('Created new project with comment:', data.id);
        }
      } else {
        // Update existing project
        console.log('Updating comment for project', contact.projectId);
        const { error } = await supabase
          .from('projects')
          .update({ contact_comment: comment })
          .eq('id', contact.projectId);
          
        if (error) {
          console.error('Error updating comment:', error);
          throw error;
        }
        
        console.log(`Updated comment for project ${contact.projectId} successfully`);
      }
      
      // Update local state
      setContacts(prev => prev.map(c => {
        if (c.id === contact.id) {
          return {
            ...c,
            comment
          };
        }
        return c;
      }));
      
      toast.success('Commentaire enregistré avec succès');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Erreur lors de l\'enregistrement du commentaire');
    }
  };
  
  // Utiliser ces fonctions pour garantir la cohérence avec la légende
  const getStatusIcon = (status: ContactStatus | undefined) => {
    if (status === "contacté") return <Check className="h-4 w-4 text-green-500" />;
    return <X className="h-4 w-4 text-red-500" />;
  };

  const getMeetingResultIcon = (result: MeetingResult | undefined) => {
    if (result === "concluant") return <Check className="h-4 w-4 text-green-500" />;
    if (result === "non-concluant") return <X className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-amber-500" />;
  };
  
  const getWorkStatusIcon = (status: WorkStatus | undefined) => {
    if (status === "terminé") return <Check className="h-4 w-4 text-green-500" />;
    if (status === "en_cours") return <Clock className="h-4 w-4 text-blue-500" />;
    if (status === "planifié") return <Clock className="h-4 w-4 text-amber-500" />;
    return <X className="h-4 w-4 text-red-500" />;
  };
  
  const getPaymentStatusIcon = (status: PaymentStatus | undefined) => {
    if (status === "payé") return <CircleDollarSign className="h-4 w-4 text-green-500" />;
    if (status === "partiellement_payé") return <CircleDollarSign className="h-4 w-4 text-amber-500" />;
    if (status === "non_payé") return <CircleDollarSign className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-amber-500" />;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Chargement des données...</p>
      </div>
    );
  }

  if (submissions.length === 0) {
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
              <TableHead className="text-center">Contacté</TableHead>
              <TableHead className="text-center">Rendez-vous</TableHead>
              <TableHead className="text-center">Travaux</TableHead>
              <TableHead className="text-center">Paiement</TableHead>
              <TableHead className="text-center">Détails</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.postal_code}</TableCell>
                <TableCell className="text-center">
                  <Select
                    value={contact.contactStatus || "nouveau"}
                    onValueChange={(value) => handleStatusChange(contact, 'contactStatus', value)}
                  >
                    <SelectTrigger className="w-10 h-10 p-0 border-none">
                      <SelectValue>
                        {getStatusIcon(contact.contactStatus)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contacté">Contacté</SelectItem>
                      <SelectItem value="nouveau">Non contacté</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center">
                  <Select
                    value={contact.meetingResult || "en_attente"}
                    onValueChange={(value) => handleStatusChange(contact, 'meetingResult', value)}
                  >
                    <SelectTrigger className="w-10 h-10 p-0 border-none">
                      <SelectValue>
                        {getMeetingResultIcon(contact.meetingResult)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concluant">Concluant</SelectItem>
                      <SelectItem value="non-concluant">Non concluant</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center">
                  <Select
                    value={contact.workStatus || "non_commencé"}
                    onValueChange={(value) => handleStatusChange(contact, 'workStatus', value as WorkStatus)}
                  >
                    <SelectTrigger className="w-10 h-10 p-0 border-none">
                      <SelectValue>
                        {getWorkStatusIcon(contact.workStatus)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="terminé">Terminé</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="planifié">Planifié</SelectItem>
                      <SelectItem value="non_commencé">Non commencé</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center">
                  <Select
                    value={contact.paymentStatus || "en_attente"}
                    onValueChange={(value) => handleStatusChange(contact, 'paymentStatus', value as PaymentStatus)}
                  >
                    <SelectTrigger className="w-10 h-10 p-0 border-none">
                      <SelectValue>
                        {getPaymentStatusIcon(contact.paymentStatus)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payé">Payé</SelectItem>
                      <SelectItem value="partiellement_payé">Partiellement payé</SelectItem>
                      <SelectItem value="non_payé">Non payé</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(contact)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
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
                <div className="col-span-2">
                  <p className="text-sm font-medium">Commentaire:</p>
                  <Textarea 
                    className="mt-1"
                    placeholder="Ajouter un commentaire..."
                    value={selectedContact.comment || ""}
                    onChange={(e) => {
                      const updatedContact = { ...selectedContact, comment: e.target.value };
                      setSelectedContact(updatedContact);
                    }}
                    onBlur={(e) => handleCommentChange(selectedContact, e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsTable;
