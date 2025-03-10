
import React from 'react';
import { useContacts } from '@/context/ContactContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ContactStatus } from '@/types/contact';

const statuses: { value: ContactStatus | null; label: string }[] = [
  { value: null, label: 'Tous' },
  { value: 'nouveau', label: 'Nouveaux' },
  { value: 'contacté', label: 'Contactés' },
  { value: 'rendez-vous', label: 'Rendez-vous' },
  { value: 'travaux', label: 'Travaux' },
  { value: 'payé', label: 'Payés' },
];

const StatusFilters: React.FC = () => {
  const { setFilter } = useContacts();
  const [activeFilter, setActiveFilter] = React.useState<ContactStatus | null>(null);

  const handleFilterChange = (status: ContactStatus | null) => {
    setActiveFilter(status);
    setFilter(status);
  };

  return (
    <div className="mb-6 flex overflow-x-auto pb-1 sm:pb-0 gap-2">
      {statuses.map((status) => (
        <Button
          key={status.label}
          variant="outline"
          className={cn(
            'flex-shrink-0 whitespace-nowrap rounded-full',
            activeFilter === status.value && 'bg-fhhabitat text-white border-fhhabitat hover:bg-fhhabitat/90'
          )}
          onClick={() => handleFilterChange(status.value)}
        >
          {status.label}
        </Button>
      ))}
    </div>
  );
};

export default StatusFilters;
