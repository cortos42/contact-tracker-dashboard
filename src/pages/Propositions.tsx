
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropositionForm from "@/components/Propositions/PropositionForm";
import PropositionsList from "@/components/Propositions/PropositionsList";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Contact } from "@/types/contact";

type EligibilitySubmission = Tables<'eligibility_submissions'>;

const Propositions: React.FC = () => {
  const [eligibilitySubmissions, setEligibilitySubmissions] = useState<EligibilitySubmission[]>([]);
  const [mappedContacts, setMappedContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("create");
  
  useEffect(() => {
    async function fetchEligibilitySubmissions() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('eligibility_submissions')
          .select('*');
        
        if (error) {
          console.error("Erreur lors de la récupération des contacts:", error);
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les contacts de la base de données.",
            variant: "destructive",
          });
        } else if (data) {
          setEligibilitySubmissions(data);
          
          // Map eligibility submissions to Contact format
          const contacts: Contact[] = data.map(submission => ({
            id: submission.id,
            nom: submission.name.split(' ').pop() || submission.name,
            prénom: submission.name.split(' ').slice(0, -1).join(' ') || '',
            email: submission.email,
            téléphone: submission.phone,
            adresse: "Adresse non spécifiée",
            ville: "Ville non spécifiée",
            codePostal: submission.postal_code,
            status: "nouveau",
            contactMethod: "aucun",
            documents: []
          }));
          
          setMappedContacts(contacts);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEligibilitySubmissions();
  }, [toast]);
  
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
                {loading ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Chargement des contacts...</p>
                  </div>
                ) : mappedContacts.length > 0 ? (
                  <PropositionForm 
                    onComplete={() => {
                      setSelectedTab("list");
                      toast({
                        title: "Proposition créée",
                        description: "Votre proposition a été créée avec succès.",
                      });
                    }}
                    contacts={mappedContacts}
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
