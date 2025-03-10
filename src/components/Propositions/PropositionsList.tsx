import React from "react";
import { useContacts } from "@/context/ContactContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PropositionsList: React.FC = () => {
  const { signatureDocuments, contacts } = useContacts();
  const { toast } = useToast();

  if (signatureDocuments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucune proposition enregistrée</p>
      </div>
    );
  }

  const getContactName = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? `${contact.prénom} ${contact.nom}` : "Client inconnu";
  };

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
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type de travaux</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signatureDocuments.map((doc) => {
            const travauxTypes = [];
            const data = doc.propositionData.travaux;
            
            if (data.combles?.materiau) travauxTypes.push("Isolation combles");
            if (data.sousRampants?.materiau) travauxTypes.push("Isolation sous-rampants");
            if (data.planchersBas?.materiau) travauxTypes.push("Isolation planchers");
            if (data.murs?.materiau) travauxTypes.push("Isolation murs");
            if (data.chauffage?.remplacement) travauxTypes.push("Chauffage");
            if (data.chauffeEau?.propose) travauxTypes.push("Chauffe-eau");
            if (data.ventilation?.propose) travauxTypes.push("Ventilation");
            if (data.menuiseries?.materiau) travauxTypes.push("Menuiseries");
            if (data.panneauxSolaires?.nombrePanneaux) travauxTypes.push("Panneaux solaires");
            
            return (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">
                  {getContactName(doc.contactId)}
                </TableCell>
                <TableCell>
                  {format(new Date(doc.dateCreated), "dd MMMM yyyy", { locale: fr })}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {travauxTypes.map((type, index) => (
                      <Badge key={index} variant="outline" className="whitespace-nowrap">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {doc.propositionData.financier?.coutTotal || "Non spécifié"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc.pdfUrl)}
                      disabled={!doc.pdfUrl}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Générer PDF
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PropositionsList;
