
import { Contact, Document, SignatureDocument } from "../types/contact";

// Génération de données pour test 
export const mockContacts: Contact[] = [
  {
    id: "1",
    nom: "Dupont",
    prénom: "Jean",
    email: "jean.dupont@example.com",
    téléphone: "06 12 34 56 78",
    adresse: "123 Rue de la Paix",
    ville: "Paris",
    codePostal: "75001",
    status: "contacté",
    contactMethod: "email",
    dateContact: "2023-05-15T10:30:00Z",
    meetingResult: "concluant",
    dateMeeting: "2023-05-20T14:00:00Z",
    workStatus: "en_cours",
    documents: []
  },
  {
    id: "2",
    nom: "Martin",
    prénom: "Sophie",
    email: "sophie.martin@example.com",
    téléphone: "07 23 45 67 89",
    adresse: "456 Avenue Victor Hugo",
    ville: "Lyon",
    codePostal: "69002",
    status: "rendez-vous",
    contactMethod: "téléphone",
    dateContact: "2023-05-16T11:15:00Z",
    meetingResult: "en_attente",
    dateMeeting: "2023-06-05T10:00:00Z",
    documents: []
  },
  {
    id: "3",
    nom: "Petit",
    prénom: "Marie",
    email: "marie.petit@example.com",
    téléphone: "06 34 56 78 90",
    adresse: "789 Boulevard Saint-Michel",
    ville: "Marseille",
    codePostal: "13001",
    status: "nouveau",
    contactMethod: "aucun",
    documents: []
  },
  {
    id: "4",
    nom: "Durand",
    prénom: "Pierre",
    email: "pierre.durand@example.com",
    téléphone: "07 45 67 89 01",
    adresse: "101 Rue de la République",
    ville: "Toulouse",
    codePostal: "31000",
    status: "travaux",
    contactMethod: "email",
    dateContact: "2023-04-20T09:00:00Z",
    meetingResult: "concluant",
    dateMeeting: "2023-04-25T16:30:00Z",
    workStatus: "terminé",
    dateWorkEnd: "2023-05-15T00:00:00Z",
    paymentStatus: "partiellement_payé",
    documents: []
  },
  {
    id: "5",
    nom: "Lefebvre",
    prénom: "Claire",
    email: "claire.lefebvre@example.com",
    téléphone: "06 56 78 90 12",
    adresse: "202 Avenue des Champs-Élysées",
    ville: "Nice",
    codePostal: "06000",
    status: "payé",
    contactMethod: "téléphone",
    dateContact: "2023-03-10T14:45:00Z",
    meetingResult: "concluant",
    dateMeeting: "2023-03-15T11:00:00Z",
    workStatus: "terminé",
    dateWorkEnd: "2023-04-10T00:00:00Z",
    paymentStatus: "payé",
    documents: []
  }
];

export const mockDocuments: Document[] = [
  {
    id: "1",
    contactId: "1",
    name: "Devis signé",
    type: "application/pdf",
    url: "/documents/devis_1.pdf",
    uploadDate: "2023-05-16T10:00:00Z"
  },
  {
    id: "2",
    contactId: "1",
    name: "Photos avant travaux",
    type: "image/jpeg",
    url: "/documents/photos_1.jpg",
    uploadDate: "2023-05-16T10:05:00Z"
  },
  {
    id: "3",
    contactId: "4",
    name: "Facture",
    type: "application/pdf",
    url: "/documents/facture_4.pdf",
    uploadDate: "2023-05-20T15:30:00Z"
  },
  {
    id: "4",
    contactId: "5",
    name: "Contrat",
    type: "application/pdf",
    url: "/documents/contrat_5.pdf",
    uploadDate: "2023-03-16T09:20:00Z"
  },
  {
    id: "5",
    contactId: "5",
    name: "Photos après travaux",
    type: "image/jpeg",
    url: "/documents/photos_apres_5.jpg",
    uploadDate: "2023-04-12T16:45:00Z"
  }
];

export const mockSignatureDocuments: SignatureDocument[] = [
  {
    id: "1",
    contactId: "1",
    propositionData: {
      client: {
        nom: "Dupont Jean",
        adresse: "123 Rue de la Paix, 75001 Paris",
        email: "jean.dupont@example.com",
        telephone: "06 12 34 56 78"
      },
      travaux: {
        combles: {
          materiau: "Laine de roche",
          surface: "80m²"
        },
        sousRampants: {
          materiau: "Laine de verre",
          surface: "60m²"
        },
        murs: {
          methode: "interieur",
          materiau: "Isolation thermique par l'intérieur",
          surface: "120m²"
        },
        chauffage: {
          actuel: "Chaudière fioul",
          remplacement: "Pompe à chaleur"
        }
      },
      financier: {
        coutTotal: "18500",
        montantSubventions: "8000",
        restantCharge: "10500"
      }
    },
    signatureUrl: "/signatures/signature_1.png",
    dateCreated: "2023-05-20T10:30:00Z",
    pdfUrl: "/propositions/proposition_1.pdf"
  },
  {
    id: "2",
    contactId: "4",
    propositionData: {
      client: {
        nom: "Durand Pierre",
        adresse: "101 Rue de la République, 31000 Toulouse",
        email: "pierre.durand@example.com",
        telephone: "07 45 67 89 01"
      },
      travaux: {
        planchersBas: {
          materiau: "Polyuréthane",
          surface: "70m²"
        },
        murs: {
          methode: "exterieur",
          materiau: "Isolation thermique par l'extérieur",
          surface: "150m²"
        },
        chauffage: {
          actuel: "Radiateurs électriques",
          remplacement: "Pompe à chaleur air-eau"
        },
        panneauxSolaires: {
          marqueModeleOnduleur: "SolarEdge SE5000",
          nombreOnduleur: "1",
          puissance: "5",
          marqueModele: "SunPower Maxeon 5",
          nombrePanneaux: "12"
        }
      },
      financier: {
        coutTotal: "25000",
        montantSubventions: "9500",
        restantCharge: "15500"
      }
    },
    signatureUrl: "/signatures/signature_4.png",
    dateCreated: "2023-04-26T14:15:00Z",
    pdfUrl: "/propositions/proposition_4.pdf"
  }
];

// Associe les documents aux contacts
export const getContactsWithDocuments = (): Contact[] => {
  return mockContacts.map(contact => {
    const contactDocs = mockDocuments.filter(doc => doc.contactId === contact.id);
    return { ...contact, documents: contactDocs };
  });
};
