
export type ContactStatus = "nouveau" | "contacté" | "rendez-vous" | "travaux" | "payé";

export type ContactMethod = "email" | "téléphone" | "aucun";

export type MeetingResult = "concluant" | "non-concluant" | "en_attente";

export type PaymentStatus = "payé" | "partiellement_payé" | "non_payé" | "en_attente";

export type WorkStatus = "terminé" | "en_cours" | "planifié" | "non_commencé";

export interface Contact {
  id: string;
  nom: string;
  prénom: string;
  email: string;
  téléphone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  status: ContactStatus;
  contactMethod: ContactMethod;
  dateContact?: string; // ISO date string
  meetingResult?: MeetingResult;
  dateMeeting?: string; // ISO date string
  workStatus?: WorkStatus;
  dateWorkEnd?: string; // ISO date string
  paymentStatus?: PaymentStatus;
  documents: Document[];
}

export interface Document {
  id: string;
  contactId: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string; // ISO date string
}

export interface SignatureDocument {
  id: string;
  contactId: string;
  propositionData: PropositionData;
  signatureUrl: string;
  dateCreated: string; // ISO date string
  pdfUrl?: string;
}

export interface PropositionData {
  client: {
    nom: string;
    adresse: string;
    email: string;
    telephone: string;
  };
  travaux: {
    combles: {
      materiau?: string;
      surface?: string;
    };
    sousRampants: {
      materiau?: string;
      surface?: string;
    };
    planchersBas: {
      materiau?: string;
      surface?: string;
    };
    murs: {
      methode?: "interieur" | "exterieur";
      materiau?: string;
      surface?: string;
    };
    chauffage: {
      actuel?: string;
      remplacement?: string;
    };
    chauffeEau: {
      actuel?: string;
      propose?: string;
    };
    ventilation: {
      actuel?: string;
      propose?: string;
      nombreBouche?: string;
    };
    menuiseries: {
      materiau?: string;
      couleur?: string;
    };
    panneauxSolaires: {
      marqueModeleOnduleur?: string;
      nombreOnduleur?: string;
      puissance?: string;
      marqueModele?: string;
      nombrePanneaux?: string;
    };
  };
  financier: {
    coutTotal?: string;
    montantSubventions?: string;
    restantCharge?: string;
  };
}
