
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UploadCloud, File, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EligibilitySubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  postal_code: string;
}

interface DocumentUploaderProps {
  contacts: EligibilitySubmission[];
  isLoadingContacts: boolean;
  selectedContact: string;
  setSelectedContact: (contactId: string) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  contacts,
  isLoadingContacts,
  selectedContact,
  setSelectedContact
}) => {
  const [documentType, setDocumentType] = useState<string>('cni');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async ({ 
      contactId, 
      documentName, 
      documentType, 
      file 
    }: { 
      contactId: string; 
      documentName: string; 
      documentType: string; 
      file: File 
    }) => {
      // 1. Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `contact-documents/${contactId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) throw uploadError;
      
      // 2. Create record in contact_documents table
      const { data, error } = await supabase
        .from('contact_documents')
        .insert({
          contact_id: contactId,
          document_name: documentName,
          document_type: documentType,
          file_path: filePath
        })
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-documents', selectedContact] });
      setFile(null);
      setUploadProgress(0);
      
      toast({
        title: "Document téléchargé",
        description: "Le document a été ajouté avec succès",
      });
      
      // Reset file input by clearing value
      const fileInput = document.getElementById('document-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement du document",
        variant: "destructive",
      });
    }
  });

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
      // Simulate upload progress for UX purposes
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const selectedContactData = contacts.find(c => c.id === selectedContact);
      const documentName = `${getDocumentTypeName(documentType)} - ${selectedContactData?.name}`;
      
      // Trigger the mutation
      await uploadDocumentMutation.mutateAsync({
        contactId: selectedContact,
        documentName,
        documentType,
        file
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploading(false);
      
    } catch (error) {
      console.error('Error in handleUpload:', error);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importer un document</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="contact-select">Sélectionner un contact</Label>
            {isLoadingContacts ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
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
                      {contact.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
                <label 
                  htmlFor="document-upload" 
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50 cursor-pointer ${file ? 'border-primary' : 'border-border'}`}
                >
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
                </label>
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
  );
};

export default DocumentUploader;
