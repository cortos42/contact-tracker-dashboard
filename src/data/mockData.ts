
import { Contact, Document, SignatureDocument } from "../types/contact";

// Mock data for contacts
export const mockContacts: Contact[] = [
  {
    id: "1",
    nom: "Dupont",
    prénom: "Jean",
    email: "jean.dupont@example.com",
    téléphone: "0123456789",
    adresse: "123 rue de Paris",
    ville: "Paris",
    codePostal: "75001",
    status: "nouveau",
    contactMethod: "email",
    documents: []
  },
  {
    id: "2",
    nom: "Martin",
    prénom: "Sophie",
    email: "sophie.martin@example.com",
    téléphone: "0987654321",
    adresse: "456 avenue des Champs-Élysées",
    ville: "Paris",
    codePostal: "75008",
    status: "contacté",
    contactMethod: "téléphone",
    dateContact: new Date().toISOString(),
    documents: []
  },
  {
    id: "3",
    nom: "Petit",
    prénom: "Marie",
    email: "marie.petit@example.com",
    téléphone: "0654321987",
    adresse: "789 boulevard Saint-Michel",
    ville: "Paris",
    codePostal: "75005",
    status: "rendez-vous",
    contactMethod: "téléphone",
    dateContact: new Date().toISOString(),
    dateMeeting: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    meetingResult: "en_attente",
    documents: []
  }
];

// Mock data for documents
export const mockDocuments: Document[] = [
  {
    id: "d1",
    contactId: "1",
    name: "Carte d'identité - Jean Dupont",
    type: "cni",
    url: "/placeholder.svg",
    uploadDate: new Date().toISOString()
  },
  {
    id: "d2",
    contactId: "2",
    name: "Avis d'imposition 2023 - Sophie Martin",
    type: "avis",
    url: "/placeholder.svg",
    uploadDate: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
  }
];

export const mockSignatureDocuments: SignatureDocument[] = [];

// Function to return contacts with their documents
export const getContactsWithDocuments = (): Contact[] => {
  return mockContacts.map(contact => {
    const contactDocuments = mockDocuments.filter(doc => doc.contactId === contact.id);
    return { ...contact, documents: contactDocuments };
  });
};
