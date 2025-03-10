
import React from 'react';
import { AlertCircle, FileText, File, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";

interface ContactDocument {
  id: string;
  contact_id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  upload_date: string;
}

interface DocumentsListProps {
  documents: ContactDocument[];
  isLoadingDocuments: boolean;
  selectedContact: string;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  isLoadingDocuments,
  selectedContact
}) => {
  const getPublicUrl = (filePath: string): string => {
    // Get public URL for the file
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };

  const renderDocumentIcon = (type: string) => {
    switch (type) {
      case 'cni':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'avis':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!selectedContact) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Documents du contact
          {isLoadingDocuments && (
            <Loader2 className="h-4 w-4 animate-spin inline-block ml-2" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between border p-3 rounded-md">
                <div className="flex items-center gap-2">
                  {renderDocumentIcon(doc.document_type)}
                  <div>
                    <p className="text-sm font-medium">{doc.document_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Ajouté le {new Date(doc.upload_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.open(getPublicUrl(doc.file_path), '_blank')}
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
  );
};

export default DocumentsList;
