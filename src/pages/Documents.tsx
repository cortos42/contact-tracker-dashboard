
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useContacts } from '@/context/ContactContext';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, File, FileText, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Documents: React.FC = () => {
  const { contacts, addDocument } = useContacts();
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('cni');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleContactChange = (contactId: string) => {
    setSelectedContact(contactId);
  };

  const handleDocumentTypeChange = (type: string) => {
    setDocumentType(type);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is PDF or image
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Type de fichier non pris en charge",
          description: "Veuillez sélectionner un fichier PDF ou une image",
          variant: "destructive",
        });
        e.target.value = ''; // Reset input
      }
    }
  };

  const getDocumentTypeName = (type: string): string => {
    switch (type) {
      case 'cni': return 'Carte d\'identité';
      case 'avis': return 'Avis d\'imposition';
      default: return type;
    }
  };

  const handleUpload = async () => {
    if (!selectedContact || !file || !documentType) {
      toast({
        title: "Information manquante",
        description: "Veuillez sélectionner un contact, un type de document et un fichier",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // For now, we'll use a URL.createObjectURL to simulate file access
      const fileUrl = URL.createObjectURL(file);
      
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Add document to context
        addDocument({
          contactId: selectedContact,
          name: `${getDocumentTypeName(documentType)} - ${file.name}`,
          type: documentType,
          url: fileUrl,
        });

        // Reset form
        setFile(null);
        setUploadProgress(0);
        setUploading(false);
        
        toast({
          title: "Document téléchargé",
          description: "Le document a été ajouté avec succès",
        });
        
        // Reset file input by clearing value
        const fileInput = document.getElementById('document-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }, 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement du document",
        variant: "destructive",
      });
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const selectedContactData = contacts.find(c => c.id === selectedContact);

  return (
    <Layout>
      <DashboardHeader title="Documents" showSearch={false} />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Importer un document</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="contact-select">Sélectionner un contact</Label>
                <Select 
                  value={selectedContact} 
                  onValueChange={handleContactChange}
                >
                  <SelectTrigger className="w-full" id="contact-select">
                    <SelectValue placeholder="Choisir un contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map(contact => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.prénom} {contact.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedContact && (
                <>
                  <div className="grid gap-3">
                    <Label htmlFor="document-type">Type de document</Label>
                    <Tabs defaultValue="cni" value={documentType} onValueChange={handleDocumentTypeChange}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="cni">Carte d'identité</TabsTrigger>
                        <TabsTrigger value="avis">Avis d'imposition</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="document-upload">Importer le document (PDF ou image)</Label>
                    <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50 ${file ? 'border-primary' : 'border-border'}`}>
                      {!file ? (
                        <>
                          <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-1">Glisser-déposer ou cliquer pour importer</p>
                          <p className="text-xs text-muted-foreground">Formats acceptés: PDF, JPG, PNG</p>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          {file.type === 'application/pdf' ? (
                            <FileText className="h-6 w-6 text-primary" />
                          ) : (
                            <File className="h-6 w-6 text-primary" />
                          )}
                          <span className="text-sm font-medium">{file.name}</span>
                        </div>
                      )}
                      <Input
                        id="document-upload"
                        type="file"
                        accept="application/pdf,image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                    {file && (
                      <div className="w-full mt-2">
                        <Label className="text-xs mb-1 block">
                          {uploadProgress > 0 ? `Téléchargement: ${uploadProgress}%` : "Prêt à télécharger"}
                        </Label>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full"
                  >
                    {uploading ? "Téléchargement en cours..." : "Télécharger le document"}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedContact && (
          <Card>
            <CardHeader>
              <CardTitle>Documents de {selectedContactData?.prénom} {selectedContactData?.nom}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedContactData?.documents && selectedContactData.documents.length > 0 ? (
                <div className="grid gap-4">
                  {selectedContactData.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between border p-3 rounded-md">
                      <div className="flex items-center gap-2">
                        {doc.type === 'cni' ? (
                          <FileText className="h-5 w-5 text-blue-500" />
                        ) : doc.type === 'avis' ? (
                          <FileText className="h-5 w-5 text-green-500" />
                        ) : (
                          <File className="h-5 w-5 text-gray-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Ajouté le {new Date(doc.uploadDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        Voir
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Aucun document trouvé pour ce contact</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Documents;
