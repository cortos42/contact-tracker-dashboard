
import React from 'react';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import StatusFilters from '@/components/Dashboard/StatusFilters';
import ContactsTable from '@/components/Contacts/ContactsTable';
import { ContactProvider } from '@/context/ContactContext';

const ContactsPage: React.FC = () => {
  return (
    <ContactProvider>
      <Layout>
        <DashboardHeader title="Contacts" />
        <StatusFilters />
        <ContactsTable />
      </Layout>
    </ContactProvider>
  );
};

export default ContactsPage;
