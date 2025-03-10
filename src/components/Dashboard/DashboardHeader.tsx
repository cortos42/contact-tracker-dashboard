
import React from 'react';
import { useContacts } from '@/context/ContactContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  title: string;
  showAddButton?: boolean;
  showSearch?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  showAddButton = true,
  showSearch = true,
}) => {
  const { setSearchTerm } = useContacts();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full md:w-auto">
        {showSearch && (
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-9 w-full"
              onChange={handleSearchChange}
            />
          </div>
        )}

        {showAddButton && (
          <Link to="/contacts/add">
            <Button className="bg-fhhabitat hover:bg-fhhabitat/90">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau contact
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
