
import React from 'react';
import { useContacts } from '@/context/ContactContext';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Contact } from '@/types/contact';
import { Link } from 'react-router-dom';
import { Eye, Phone, Mail, Ban } from 'lucide-react';

const ContactsTable: React.FC = () => {
  const { filteredContacts, updateContactMethod } = useContacts();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'PPP', { locale: fr });
  };

  const getStatusBadge = (contact: Contact) => {
    const statusColors: Record<string, string> = {
      nouveau: 'bg-gray-500',
      contacté: 'bg-indigo-500',
      'rendez-vous': 'bg-amber-500',
      travaux: 'bg-blue-500',
      payé: 'bg-emerald-500',
    };

    return (
      <Badge className={statusColors[contact.status]}>
        {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
      </Badge>
    );
  };

  const getContactMethodIcon = (contact: Contact) => {
    switch (contact.contactMethod) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'téléphone':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'aucun':
        return <Ban className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const handleContactByEmail = (id: string) => {
    updateContactMethod(id, 'email');
  };

  const handleContactByPhone = (id: string) => {
    updateContactMethod(id, 'téléphone');
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Téléphone</TableHead>
            <TableHead className="hidden md:table-cell">Ville</TableHead>
            <TableHead className="hidden md:table-cell">Dernière action</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">
                {contact.prénom} {contact.nom}
              </TableCell>
              <TableCell>{getStatusBadge(contact)}</TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex justify-center">{getContactMethodIcon(contact)}</div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{contact.email}</TableCell>
              <TableCell className="hidden md:table-cell">{contact.téléphone}</TableCell>
              <TableCell className="hidden md:table-cell">{contact.ville}</TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(contact.dateContact || contact.dateMeeting)}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleContactByEmail(contact.id)}
                    title="Contacter par email"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleContactByPhone(contact.id)}
                    title="Contacter par téléphone"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Link to={`/contacts/${contact.id}`}>
                    <Button size="sm" variant="ghost" title="Voir les détails">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filteredContacts.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Aucun contact trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContactsTable;
