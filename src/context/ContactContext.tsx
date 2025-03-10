
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Contact, Document, SignatureDocument, ContactStatus, ContactMethod, MeetingResult, PaymentStatus, WorkStatus } from "../types/contact";
import { getContactsWithDocuments, mockSignatureDocuments } from "../data/mockData";
import { useToast } from "@/components/ui/use-toast";

interface ContactContextType {
  contacts: Contact[];
  filteredContacts: Contact[];
  documents: Document[];
  signatureDocuments: SignatureDocument[];
  setFilter: (status: ContactStatus | null) => void;
  setSearchTerm: (term: string) => void;
  updateContactStatus: (id: string, status: ContactStatus) => void;
  updateContactMethod: (id: string, method: ContactMethod) => void;
  updateMeetingResult: (id: string, result: MeetingResult) => void;
  updateWorkStatus: (id: string, status: WorkStatus) => void;
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
  addDocument: (document: Omit<Document, "id" | "uploadDate">) => void;
  addSignatureDocument: (document: Omit<SignatureDocument, "id" | "dateCreated">) => void;
  getContactById: (id: string) => Contact | undefined;
  getSignatureDocumentsByContactId: (contactId: string) => SignatureDocument[];
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [signatureDocuments, setSignatureDocuments] = useState<SignatureDocument[]>([]);
  const [activeFilter, setActiveFilter] = useState<ContactStatus | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Chargement initial des données simulées
    const contactsWithDocs = getContactsWithDocuments();
    setContacts(contactsWithDocs);
    setFilteredContacts(contactsWithDocs);
    setDocuments(contactsWithDocs.flatMap(contact => contact.documents));
    setSignatureDocuments(mockSignatureDocuments);
  }, []);

  useEffect(() => {
    let result = contacts;
    
    // Appliquer le filtre de statut
    if (activeFilter) {
      result = result.filter(contact => contact.status === activeFilter);
    }
    
    // Appliquer la recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        contact =>
          contact.nom.toLowerCase().includes(term) ||
          contact.prénom.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term) ||
          contact.téléphone.includes(term) ||
          contact.adresse.toLowerCase().includes(term) ||
          contact.ville.toLowerCase().includes(term)
      );
    }
    
    setFilteredContacts(result);
  }, [contacts, activeFilter, searchTerm]);

  const setFilter = (status: ContactStatus | null) => {
    setActiveFilter(status);
  };

  const updateContactStatus = (id: string, status: ContactStatus) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === id
          ? { ...contact, status, ...(status === "contacté" ? { dateContact: new Date().toISOString() } : {}) }
          : contact
      )
    );
    toast({
      title: "Statut mis à jour",
      description: `Le contact a été mis à jour vers le statut: ${status}`,
    });
  };

  const updateContactMethod = (id: string, method: ContactMethod) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === id ? { ...contact, contactMethod: method } : contact
      )
    );
    toast({
      title: "Méthode de contact mise à jour",
      description: `La méthode de contact a été mise à jour: ${method}`,
    });
  };

  const updateMeetingResult = (id: string, result: MeetingResult) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === id ? { ...contact, meetingResult: result } : contact
      )
    );
    toast({
      title: "Résultat du rendez-vous mis à jour",
      description: `Le résultat du rendez-vous a été mis à jour: ${result}`,
    });
  };

  const updateWorkStatus = (id: string, status: WorkStatus) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === id
          ? {
              ...contact,
              workStatus: status,
              ...(status === "terminé" ? { dateWorkEnd: new Date().toISOString() } : {})
            }
          : contact
      )
    );
    toast({
      title: "Statut des travaux mis à jour",
      description: `Le statut des travaux a été mis à jour: ${status}`,
    });
  };

  const updatePaymentStatus = (id: string, status: PaymentStatus) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === id ? { ...contact, paymentStatus: status } : contact
      )
    );
    toast({
      title: "Statut de paiement mis à jour",
      description: `Le statut de paiement a été mis à jour: ${status}`,
    });
  };

  const addDocument = (document: Omit<Document, "id" | "uploadDate">) => {
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString()
    };
    
    setDocuments(prev => [...prev, newDocument]);
    
    // Mettre à jour les documents dans les contacts
    setContacts(prev =>
      prev.map(contact =>
        contact.id === document.contactId
          ? { ...contact, documents: [...contact.documents, newDocument] }
          : contact
      )
    );
    
    toast({
      title: "Document ajouté",
      description: `Le document a été ajouté avec succès.`,
    });
  };

  const addSignatureDocument = (document: Omit<SignatureDocument, "id" | "dateCreated">) => {
    const newDocument: SignatureDocument = {
      ...document,
      id: Date.now().toString(),
      dateCreated: new Date().toISOString()
    };
    
    setSignatureDocuments(prev => [...prev, newDocument]);
    
    toast({
      title: "Proposition signée ajoutée",
      description: `La proposition signée a été ajoutée avec succès.`,
    });
  };

  const getContactById = (id: string): Contact | undefined => {
    return contacts.find(contact => contact.id === id);
  };

  const getSignatureDocumentsByContactId = (contactId: string): SignatureDocument[] => {
    return signatureDocuments.filter(doc => doc.contactId === contactId);
  };

  return (
    <ContactContext.Provider
      value={{
        contacts,
        filteredContacts,
        documents,
        signatureDocuments,
        setFilter,
        setSearchTerm,
        updateContactStatus,
        updateContactMethod,
        updateMeetingResult,
        updateWorkStatus,
        updatePaymentStatus,
        addDocument,
        addSignatureDocument,
        getContactById,
        getSignatureDocumentsByContactId
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error("useContacts must be used within a ContactProvider");
  }
  return context;
};
