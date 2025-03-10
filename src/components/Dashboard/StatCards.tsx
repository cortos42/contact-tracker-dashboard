
import React from 'react';
import { useContacts } from '@/context/ContactContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Phone, Mail, Calendar, Wrench, CreditCard } from 'lucide-react';

const StatCards: React.FC = () => {
  const { contacts } = useContacts();

  const stats = [
    {
      title: 'Total contacts',
      value: contacts.length,
      description: 'Contacts au total',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Contactés',
      value: contacts.filter(c => c.status === 'contacté').length,
      description: 'Par email ou téléphone',
      icon: Phone,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Par email',
      value: contacts.filter(c => c.contactMethod === 'email').length,
      description: 'Contacts par email',
      icon: Mail,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Rendez-vous',
      value: contacts.filter(c => c.status === 'rendez-vous').length,
      description: 'Rendez-vous programmés',
      icon: Calendar,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      title: 'En travaux',
      value: contacts.filter(c => c.status === 'travaux').length,
      description: 'Travaux en cours',
      icon: Wrench,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      title: 'Payés',
      value: contacts.filter(c => c.status === 'payé').length,
      description: 'Projets terminés',
      icon: CreditCard,
      color: 'bg-emerald-100 text-emerald-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <CardDescription>{stat.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatCards;
