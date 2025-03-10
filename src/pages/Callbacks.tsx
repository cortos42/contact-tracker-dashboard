
import { useState } from 'react';
import { Plus } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CallbacksTable from '@/components/Callbacks/CallbacksTable';
import CallbackForm from '@/components/Callbacks/CallbackForm';
import useCallbackRequests from '@/hooks/useCallbackRequests';

const Callbacks = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const { requests, isLoading, refetch } = useCallbackRequests();

  return (
    <Layout>
      <div className="container mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Demandes de rappel</CardTitle>
              <CardDescription>Gérez les demandes de rappel clients</CardDescription>
            </div>
            <Button onClick={() => setOpenAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle demande
            </Button>
          </CardHeader>
          <CardContent>
            <CallbacksTable 
              requests={requests} 
              isLoading={isLoading}
              onRequestsChanged={refetch}
            />
          </CardContent>
        </Card>
      </div>

      <CallbackForm 
        open={openAddDialog} 
        onOpenChange={setOpenAddDialog}
        onSuccess={refetch}
      />
    </Layout>
  );
};

export default Callbacks;
