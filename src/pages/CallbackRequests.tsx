
import React from 'react';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import CallbackRequestsTable from '@/components/Callbacks/CallbackRequestsTable';

const CallbackRequests: React.FC = () => {
  return (
    <Layout>
      <DashboardHeader title="Demandes de rappel" showSearch={false} />
      <div className="mt-6">
        <CallbackRequestsTable />
      </div>
    </Layout>
  );
};

export default CallbackRequests;
