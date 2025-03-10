
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropositionForm from "@/components/Propositions/PropositionForm";
import PropositionsList from "@/components/Propositions/PropositionsList";
import { useContacts } from "@/context/ContactContext";
import { useToast } from "@/components/ui/use-toast";

const Propositions: React.FC = () => {
  const { contacts } = useContacts();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("create");
  
  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Propositions</h1>
            <p className="text-muted-foreground">
              Créez et gérez vos propositions de travaux
            </p>
          </div>
        </div>

        <Tabs defaultValue="create" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="create">Créer une proposition</TabsTrigger>
            <TabsTrigger value="list">Propositions enregistrées</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nouvelle proposition de travaux</CardTitle>
              </CardHeader>
              <CardContent>
                {contacts && contacts.length > 0 ? (
                  <PropositionForm 
                    onComplete={() => {
                      setSelectedTab("list");
                      toast({
                        title: "Proposition créée",
                        description: "Votre proposition a été créée avec succès.",
                      });
                    }}
                    contacts={contacts}
                  />
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Aucun contact disponible. Veuillez d'abord ajouter des contacts.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Propositions existantes</CardTitle>
              </CardHeader>
              <CardContent>
                <PropositionsList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Propositions;
