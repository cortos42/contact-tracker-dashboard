
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, PropositionData } from "@/types/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { generatePropositionPDF } from "@/utils/pdfGenerator";
import { useContacts } from "@/context/ContactContext";
import SignatureCanvas from "react-signature-canvas";

// Add dependency for react-signature-canvas
import SignaturePad from "@/components/Propositions/SignaturePad";

// Create form schema
const formSchema = z.object({
  contactId: z.string().min(1, { message: "Veuillez sélectionner un client" }),
  // Rest of form schema will be validated in sections
});

type FormData = z.infer<typeof formSchema>;

interface PropositionFormProps {
  onComplete: () => void;
  contacts: Contact[];
}

const PropositionForm: React.FC<PropositionFormProps> = ({ onComplete, contacts }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactId: "",
    }
  });
  
  const { addSignatureDocument } = useContacts();
  const { toast } = useToast();
  const [signatureURL, setSignatureURL] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(false);
  const [propositionData, setPropositionData] = useState<PropositionData | null>(null);
  
  const contactId = watch("contactId");
  const selectedContact = contacts.find(c => c.id === contactId);
  
  // Handle form data collection
  const collectFormData = (data: FormData): PropositionData => {
    // Get all form values from the DOM
    const form = document.getElementById("proposition-form") as HTMLFormElement;
    
    const propositionData: PropositionData = {
      client: {
        nom: selectedContact?.nom + " " + selectedContact?.prénom || "",
        adresse: selectedContact?.adresse + ", " + selectedContact?.codePostal + " " + selectedContact?.ville || "",
        email: selectedContact?.email || "",
        telephone: selectedContact?.téléphone || "",
      },
      travaux: {
        combles: {
          materiau: form.querySelector<HTMLInputElement>('[name="combles-materiau"]')?.value,
          surface: form.querySelector<HTMLInputElement>('[name="combles-surface"]')?.value,
        },
        sousRampants: {
          materiau: form.querySelector<HTMLInputElement>('[name="sous-rampants-materiau"]')?.value,
          surface: form.querySelector<HTMLInputElement>('[name="sous-rampants-surface"]')?.value,
        },
        planchersBas: {
          materiau: form.querySelector<HTMLInputElement>('[name="planchers-bas-materiau"]')?.value,
          surface: form.querySelector<HTMLInputElement>('[name="planchers-bas-surface"]')?.value,
        },
        murs: {
          methode: form.querySelector<HTMLInputElement>('[name="murs-methode"]:checked')?.value as "interieur" | "exterieur" | undefined,
          materiau: form.querySelector<HTMLInputElement>('[name="murs-materiau"]')?.value,
          surface: form.querySelector<HTMLInputElement>('[name="murs-surface"]')?.value,
        },
        chauffage: {
          actuel: form.querySelector<HTMLInputElement>('[name="chauffage-actuel"]')?.value,
          remplacement: form.querySelector<HTMLInputElement>('[name="chauffage-remplacement"]')?.value,
        },
        chauffeEau: {
          actuel: form.querySelector<HTMLInputElement>('[name="chauffe-eau-actuel"]')?.value,
          propose: form.querySelector<HTMLInputElement>('[name="chauffe-eau-propose"]')?.value,
        },
        ventilation: {
          actuel: form.querySelector<HTMLInputElement>('[name="ventilation-actuel"]')?.value,
          propose: form.querySelector<HTMLInputElement>('[name="ventilation-propose"]')?.value,
          nombreBouche: form.querySelector<HTMLInputElement>('[name="ventilation-bouches"]')?.value,
        },
        menuiseries: {
          materiau: form.querySelector<HTMLInputElement>('[name="menuiseries-materiau"]')?.value,
          couleur: form.querySelector<HTMLInputElement>('[name="menuiseries-couleur"]')?.value,
        },
        panneauxSolaires: {
          marqueModeleOnduleur: form.querySelector<HTMLInputElement>('[name="panneaux-onduleur-modele"]')?.value,
          nombreOnduleur: form.querySelector<HTMLInputElement>('[name="panneaux-onduleur-nombre"]')?.value,
          puissance: form.querySelector<HTMLInputElement>('[name="panneaux-puissance"]')?.value,
          marqueModele: form.querySelector<HTMLInputElement>('[name="panneaux-modele"]')?.value,
          nombrePanneaux: form.querySelector<HTMLInputElement>('[name="panneaux-nombre"]')?.value,
        },
      },
      financier: {
        coutTotal: form.querySelector<HTMLInputElement>('[name="cout-total"]')?.value,
        montantSubventions: form.querySelector<HTMLInputElement>('[name="montant-subventions"]')?.value,
        restantCharge: form.querySelector<HTMLInputElement>('[name="restant-charge"]')?.value,
      },
    };
    
    return propositionData;
  };
  
  // Preview PDF
  const handlePreview = (data: FormData) => {
    const formData = collectFormData(data);
    setPropositionData(formData);
    setShowSignature(true);
  };
  
  // Handle signature completion
  const handleSignatureComplete = async (signatureDataURL: string) => {
    setSignatureURL(signatureDataURL);
    
    if (!propositionData || !contactId) return;
    
    try {
      // Generate PDF
      const pdfUrl = await generatePropositionPDF(propositionData, signatureDataURL);
      
      // Save signature document
      addSignatureDocument({
        contactId,
        propositionData,
        signatureUrl: signatureDataURL,
        pdfUrl,
      });
      
      // Show success toast
      toast({
        title: "Proposition créée",
        description: "La proposition a été créée avec succès et le PDF a été généré.",
      });
      
      // Go to list view
      onComplete();
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création du PDF.",
        variant: "destructive",
      });
    }
  };
  
  // Cancel signature
  const handleCancelSignature = () => {
    setShowSignature(false);
    setSignatureURL(null);
  };
  
  return (
    <form id="proposition-form" onSubmit={handleSubmit(handlePreview)} className="space-y-8">
      {showSignature ? (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Signature du client</h2>
          <SignaturePad onComplete={handleSignatureComplete} onCancel={handleCancelSignature} />
        </div>
      ) : (
        <>
          {/* Client Selection */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Sélection du client</h2>
            <div className="space-y-2">
              <Label htmlFor="contactId">Client</Label>
              <Select onValueChange={(value) => setValue("contactId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.prénom} {contact.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.contactId && (
                <p className="text-sm text-red-500">{errors.contactId.message}</p>
              )}
            </div>
          </div>
          
          {selectedContact && (
            <>
              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-gray-50">
                <div>
                  <p className="text-sm font-semibold">Nom</p>
                  <p>{selectedContact.prénom} {selectedContact.nom}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <p>{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Téléphone</p>
                  <p>{selectedContact.téléphone}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Adresse</p>
                  <p>{selectedContact.adresse}, {selectedContact.codePostal} {selectedContact.ville}</p>
                </div>
              </div>

              {/* Travaux sections */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Description des travaux proposés</h2>
                
                {/* Isolation des combles */}
                <div className="space-y-3 p-4 border rounded-md">
                  <h3 className="font-medium">Isolation des combles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="combles-materiau">Type de matériau</Label>
                      <Input id="combles-materiau" name="combles-materiau" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="combles-surface">Surface</Label>
                      <Input id="combles-surface" name="combles-surface" />
                    </div>
                  </div>
                </div>
                
                {/* Isolation des sous-rampants */}
                <div className="space-y-3 p-4 border rounded-md">
                  <h3 className="font-medium">Isolation des sous-rampants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sous-rampants-materiau">Type de matériau</Label>
                      <Input id="sous-rampants-materiau" name="sous-rampants-materiau" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sous-rampants-surface">Surface</Label>
                      <Input id="sous-rampants-surface" name="sous-rampants-surface" />
                    </div>
                  </div>
                </div>
                
                {/* Isolation des planchers bas */}
                <div className="space-y-3 p-4 border rounded-md">
                  <h3 className="font-medium">Isolation des planchers bas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="planchers-bas-materiau">Type de matériau</Label>
                      <Input id="planchers-bas-materiau" name="planchers-bas-materiau" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="planchers-bas-surface">Surface</Label>
                      <Input id="planchers-bas-surface" name="planchers-bas-surface" />
                    </div>
                  </div>
                </div>
                
                {/* Isolation des murs */}
                <div className="space-y-3 p-4 border rounded-md">
                  <h3 className="font-medium">Isolation des murs donnant sur l'extérieur</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Méthode</Label>
                      <RadioGroup defaultValue="interieur" name="murs-methode" className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="interieur" id="murs-methode-interieur" />
                          <Label htmlFor="murs-methode-interieur">Par l'intérieur</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="exterieur" id="murs-methode-exterieur" />
                          <Label htmlFor="murs-methode-exterieur">Par l'extérieur</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="murs-materiau">Type de matériau</Label>
                        <Input id="murs-materiau" name="murs-materiau" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="murs-surface">Surface</Label>
                        <Input id="murs-surface" name="murs-surface" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Remplacement du chauffage */}
                <div className="space-y-3 p-4 border rounded-md">
                  <h3 className="font-medium">Remplacement du mode de chauffage actuel</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chauffage-actuel">Chauffage actuel</Label>
                      <Input id="chauffage-actuel" name="chauffage-actuel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chauffage-remplacement">Remplacer par</Label>
                      <Input id="chauffage-remplacement" name="chauffage-remplacement" />
                    </div>
                  </div>
                </div>
                
                {/* Remplacement du chauffe-eau */}
                <div className="space-y-3 p-4 border rounded-md">
                  <h3 className="font-medium">Remplacement du système de chauffe-eau actuel</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chauffe-eau-actuel">Actuel</Label>
                      <Input id="chauffe-eau-actuel" name="chauffe-eau-actuel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chauffe-eau-propose">Système proposé</Label>
                      <Input id="chauffe-eau-propose" name="chauffe-eau-propose" />
                    </div>
                  </div>
                </div>
                
                {/* Ventilation */}
                <div className="space-y-3 p-4 border rounded-md">
                  <h3 className="font-medium">Remplacement du système de ventilation actuel</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ventilation-actuel">Type de ventilation actuel</Label>
                      <Input id="ventilation-actuel" name="ventilation-actuel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ventilation-propose">Type de ventilation proposé</Label>
                      <Input id="ventilation-propose" name="ventilation-propose" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ventilation-bouches">Nombre de bouches</Label>
                      <Input id="ventilation-bouches" name="ventilation-bouches" type="number" min="0" />
                    </div>
                  </div>
                </div>
                
                {/* Menuiseries */}
                <div className="space-y-3 p-4 border rounded-md">
                  <h3 className="font-medium">Remplacement des menuiseries extérieures</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="menuiseries-materiau">Matériau</Label>
                      <Input id="menuiseries-materiau" name="menuiseries-materiau" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="menuiseries-couleur">Couleur</Label>
                      <Input id="menuiseries-couleur" name="menuiseries-couleur" />
                    </div>
                  </div>
                </div>
                
                {/* Panneaux solaires */}
                <div className="space-y-3 p-4 border rounded-md">
                  <h3 className="font-medium">Panneau solaire photovoltaïque</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="panneaux-onduleur-modele">Marque et modèle onduleur</Label>
                      <Input id="panneaux-onduleur-modele" name="panneaux-onduleur-modele" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panneaux-onduleur-nombre">Nombre d'onduleur</Label>
                      <Input id="panneaux-onduleur-nombre" name="panneaux-onduleur-nombre" type="number" min="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panneaux-puissance">Puissance en Kw/c</Label>
                      <Input id="panneaux-puissance" name="panneaux-puissance" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panneaux-modele">Marque et modèle</Label>
                      <Input id="panneaux-modele" name="panneaux-modele" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panneaux-nombre">Nombre de panneaux</Label>
                      <Input id="panneaux-nombre" name="panneaux-nombre" type="number" min="0" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Estimation financière */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Estimation financière</h2>
                <div className="space-y-3 p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cout-total">Coût total des travaux</Label>
                      <Input id="cout-total" name="cout-total" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="montant-subventions">Montant des subventions</Label>
                      <Input id="montant-subventions" name="montant-subventions" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restant-charge">Restant à charge client</Label>
                      <Input id="restant-charge" name="restant-charge" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Génération en cours..." : "Générer pour signature"}
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </form>
  );
};

export default PropositionForm;
