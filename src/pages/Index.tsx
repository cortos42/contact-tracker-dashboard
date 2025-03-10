
import React from 'react';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import StatCards from '@/components/Dashboard/StatCards';
import ContactProgress from '@/components/Dashboard/ContactProgress';
import RecentContacts from '@/components/Dashboard/RecentContacts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client for this component
const queryClient = new QueryClient();

const Dashboard: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <DashboardHeader title="Tableau de bord" showSearch={false} />
        <StatCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContactProgress />
          <RecentContacts />
        </div>
      </Layout>
    </QueryClientProvider>
  );
};

export default Dashboard;
