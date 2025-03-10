
import React from 'react';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import DocumentUploader from '@/components/Documents/DocumentUploader';
import DocumentsList from '@/components/Documents/DocumentsList';
import { useContactDocuments } from '@/hooks/useContactDocuments';

const Documents: React.FC = () => {
  const { 
    contacts,
    isLoadingContacts,
    documents,
    isLoadingDocuments,
    selectedContact,
    setSelectedContact
  } = useContactDocuments();

  return (
    <Layout>
      <DashboardHeader title="Documents" showSearch={false} />
      
      <div className="grid gap-6">
        <DocumentUploader 
          contacts={contacts}
          isLoadingContacts={isLoadingContacts}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
        />

        {selectedContact && (
          <DocumentsList 
            documents={documents}
            isLoadingDocuments={isLoadingDocuments}
            selectedContact={selectedContact}
          />
        )}
      </div>
    </Layout>
  );
};

export default Documents;
