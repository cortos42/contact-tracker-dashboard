
import React from 'react';
import { useContacts } from '@/context/ContactContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ContactStatus } from '@/types/contact';

const ContactProgress: React.FC = () => {
  const { contacts } = useContacts();

  // Préparation des données pour le graphique
  const statusCounts: Record<ContactStatus, number> = {
    nouveau: 0,
    contacté: 0,
    'rendez-vous': 0,
    travaux: 0,
    payé: 0,
  };

  contacts.forEach((contact) => {
    statusCounts[contact.status]++;
  });

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
  }));

  const colors = {
    Nouveau: '#94a3b8',
    Contacté: '#818cf8',
    'Rendez-vous': '#f59e0b',
    Travaux: '#3b82f6',
    Payé: '#10b981',
  };

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
