
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContacts } from '@/context/ContactContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChevronLeft,
  Phone,
  Mail,
  FileText,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileUp,
  Trash2,
  Edit,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { MeetingResult, WorkStatus, PaymentStatus } from '@/types/contact';

const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    getContactById,
    updateMeetingResult,
    updateWorkStatus,
    updatePaymentStatus,
    getSignatureDocumentsByContactId,
    addDocument,
  } = useContacts();
  const { toast } = useToast();
  
  const contact = getContactById(id || '');
  const signatureDocuments = getSignatureDocumentsByContactId(id || '');
  
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  if (!contact) {
    return (
      <Layout>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Contact non trouvé</h2>
          <Link to="/contacts">
            <Button>Retour à la liste des contacts</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'PPP', { locale: fr });
  };

  const handleMeetingResultChange = (value: string) => {
    updateMeetingResult(contact.id, value as MeetingResult);
  };

  const handleWorkStatusChange = (value: string) => {
    updateWorkStatus(contact.id, value as WorkStatus);
  };

  const handlePaymentStatusChange = (value: string) => {
    updatePaymentStatus(contact.id, value as PaymentStatus);
  };

  const handleDocumentUpload = () => {
    if (!documentName || !documentType) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    // Simulation d'un téléchargement
    addDocument({
      contactId: contact.id,
      name: documentName,
      type: documentType,
      url: `/documents/${documentName.toLowerCase().replace(/\s+/g, '_')}.${documentType.split('/')[1]}`,
    });

    setDocumentName('');
    setDocumentType('');
    setUploadDialogOpen(false);
  };

  const getStatusIcon = () => {
    switch (contact.status) {
      case 'nouveau':
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
      case 'contacté':
        return <Mail className="h-5 w-5 text-indigo-500" />;
      case 'rendez-vous':
        return <Calendar className="h-5 w-5 text-amber-500" />;
      case 'travaux':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'payé':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      default:
        return null;
    }
  };

  const getMeetingResultIcon = () => {
    switch (contact.meetingResult) {
      case 'concluant':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'non-concluant':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'en_attente':
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <ContactProvider>
      <Layout>
        <div className="mb-6">
          <Link to="/contacts" className="flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour aux contacts
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <h1 className="text-2xl font-bold">
              {contact.prénom} {contact.nom}
            </h1>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Appeler
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Link to={`/contacts/${contact.id}/proposition`}>
              <Button className="bg-fhhabitat hover:bg-fhhabitat/90">
                <FileText className="h-4 w-4 mr-2" />
                Créer proposition
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-sm text-gray-500">{contact.téléphone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Adresse</p>
                  <p className="text-sm text-gray-500">
                    {contact.adresse}
                    <br />
                    {contact.codePostal} {contact.ville}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progression</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Contact ({formatDate(contact.dateContact)})</p>
                <div className="flex items-center">
                  <p className="text-sm text-gray-500 mr-2">Méthode de contact:</p>
                  <Badge className="bg-indigo-500">
                    {contact.contactMethod.charAt(0).toUpperCase() + contact.contactMethod.slice(1)}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Rendez-vous ({formatDate(contact.dateMeeting)})</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500 mr-2">Résultat:</p>
                  <Select
                    value={contact.meetingResult}
                    onValueChange={handleMeetingResultChange}
                    disabled={!contact.dateMeeting}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concluant">Concluant</SelectItem>
                      <SelectItem value="non-concluant">Non concluant</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                  {getMeetingResultIcon()}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Travaux ({formatDate(contact.dateWorkEnd)})</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500 mr-2">Statut:</p>
                  <Select
                    value={contact.workStatus}
                    onValueChange={handleWorkStatusChange}
                    disabled={contact.meetingResult !== 'concluant'}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="non_commencé">Non commencé</SelectItem>
                      <SelectItem value="planifié">Planifié</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="terminé">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Paiement</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500 mr-2">Statut:</p>
                  <Select
                    value={contact.paymentStatus}
                    onValueChange={handlePaymentStatusChange}
                    disabled={contact.workStatus !== 'terminé'}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="non_payé">Non payé</SelectItem>
                      <SelectItem value="partiellement_payé">Partiellement payé</SelectItem>
                      <SelectItem value="payé">Payé</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Propositions signées</CardTitle>
            </CardHeader>
            <CardContent>
              {signatureDocuments.length > 0 ? (
                <div className="space-y-2">
                  {signatureDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-fhhabitat" />
                        <span className="text-sm">
                          Proposition de travaux ({formatDate(doc.dateCreated)})
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" title="Voir le PDF">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Éditer">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Aucune proposition signée</p>
                  <Link to={`/contacts/${contact.id}/proposition`}>
                    <Button className="mt-2 text-xs bg-fhhabitat hover:bg-fhhabitat/90">
                      Créer une proposition
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Documents</CardTitle>
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-fhhabitat hover:bg-fhhabitat/90">
                      <FileUp className="h-4 w-4 mr-2" />
                      Ajouter un document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un document</DialogTitle>
                      <DialogDescription>
                        Téléchargez un nouveau document pour ce contact.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="documentName">Nom du document</Label>
                        <Input
                          id="documentName"
                          value={documentName}
                          onChange={(e) => setDocumentName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="documentType">Type de document</Label>
                        <Select
                          value={documentType}
                          onValueChange={setDocumentType}
                        >
                          <SelectTrigger id="documentType">
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="application/pdf">PDF</SelectItem>
                            <SelectItem value="image/jpeg">Image (JPEG)</SelectItem>
                            <SelectItem value="image/png">Image (PNG)</SelectItem>
                            <SelectItem value="application/msword">Document Word</SelectItem>
                            <SelectItem value="application/vnd.ms-excel">Feuille Excel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="documentFile">Fichier</Label>
                        <Input id="documentFile" type="file" className="cursor-pointer" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button 
                        className="bg-fhhabitat hover:bg-fhhabitat/90"
                        onClick={handleDocumentUpload}
                      >
                        Télécharger
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {contact.documents.length > 0 ? (
                  <div className="space-y-2">
                    {contact.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatDate(doc.uploadDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Aucun document disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="newNote">Ajouter une note</Label>
                    <textarea
                      id="newNote"
                      className="w-full min-h-[100px] p-2 mt-1 border rounded-md"
                      placeholder="Écrivez votre note ici..."
                    />
                    <Button className="mt-2 bg-fhhabitat hover:bg-fhhabitat/90">
                      Enregistrer la note
                    </Button>
                  </div>
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Aucune note disponible</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Layout>
    </ContactProvider>
  );
};

export default ContactDetail;
