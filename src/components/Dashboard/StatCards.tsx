
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Phone, Mail, Calendar, Wrench, CreditCard } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';

const StatCards: React.FC = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('contact_status, appointment_status, work_status, payment_status');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: contacts, isLoading: isLoadingContacts } = useQuery({
    queryKey: ['eligibilitySubmissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eligibility_submissions')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Initial stats
  const stats = [
    {
      title: 'Total contacts',
      value: isLoadingContacts ? '...' : contacts?.length || 0,
      description: 'Contacts au total',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Contactés',
      value: isLoading ? '...' : projects?.filter(p => p.contact_status === 'success').length || 0,
      description: 'Par email ou téléphone',
      icon: Phone,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Par email',
      value: isLoadingContacts ? '...' : contacts?.filter(c => c.email && c.email.length > 0).length || 0,
      description: 'Contacts par email',
      icon: Mail,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Rendez-vous',
      value: isLoading ? '...' : projects?.filter(p => p.appointment_status === 'success').length || 0,
      description: 'Rendez-vous réussis',
      icon: Calendar,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      title: 'En travaux',
      value: isLoading ? '...' : projects?.filter(p => p.work_status === 'in_progress').length || 0,
      description: 'Travaux en cours',
      icon: Wrench,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      title: 'Payés',
      value: isLoading ? '...' : projects?.filter(p => p.payment_status === 'paid').length || 0,
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
