
import React from 'react';
import { useContacts } from '@/context/ContactContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ContactStatus } from '@/types/contact';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';

const ContactProgress: React.FC = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projectsStatus'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('contact_status, appointment_status, work_status, payment_status');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Préparer les données pour le graphique
  const statusCounts: Record<string, number> = {
    'Nouveau': 0,
    'Contacté': 0,
    'Rendez-vous': 0,
    'Travaux': 0,
    'Payé': 0,
  };

  if (projects && !isLoading) {
    // Count contacts by status
    projects.forEach(project => {
      if (project.contact_status === 'pending') statusCounts['Nouveau']++;
      if (project.contact_status === 'success') statusCounts['Contacté']++;
      if (project.appointment_status === 'success') statusCounts['Rendez-vous']++;
      if (project.work_status === 'in_progress' || project.work_status === 'completed') statusCounts['Travaux']++;
      if (project.payment_status === 'paid') statusCounts['Payé']++;
    });
  }

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  const colors = {
    Nouveau: '#94a3b8',
    Contacté: '#818cf8',
    'Rendez-vous': '#f59e0b',
    Travaux: '#3b82f6',
    Payé: '#10b981',
  };

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Progression des contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">Chargement des données...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Progression des contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Nombre de contacts">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[entry.status as keyof typeof colors]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactProgress;
