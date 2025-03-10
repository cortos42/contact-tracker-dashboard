
import React from 'react';
import { useContacts } from '@/context/ContactContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Contact } from '@/types/contact';

const statusColors = {
  nouveau: 'bg-gray-500',
  contacté: 'bg-indigo-500',
  'rendez-vous': 'bg-amber-500',
  travaux: 'bg-blue-500',
  payé: 'bg-emerald-500',
};

const RecentContacts: React.FC = () => {
  const { contacts } = useContacts();

  // Trier les contacts par date de la plus récente à la plus ancienne
  const sortedContacts = [...contacts]
    .sort((a, b) => {
      const dateA = a.dateContact || a.dateMeeting || '0';
      const dateB = b.dateContact || b.dateMeeting || '0';
      return dateB.localeCompare(dateA);
    })
    .slice(0, 5);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'PPP', { locale: fr });
  };

  const getStatusBadge = (contact: Contact) => {
    return (
      <Badge className={statusColors[contact.status]}>
        {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts récents</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Téléphone</TableHead>
              <TableHead className="hidden md:table-cell">Dernière action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">
                  <Link
                    to={`/contacts/${contact.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {contact.prénom} {contact.nom}
                  </Link>
                </TableCell>
                <TableCell>{getStatusBadge(contact)}</TableCell>
                <TableCell className="hidden md:table-cell">{contact.email}</TableCell>
                <TableCell className="hidden md:table-cell">{contact.téléphone}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(contact.dateContact || contact.dateMeeting)}
                </TableCell>
              </TableRow>
            ))}
            {sortedContacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Aucun contact récent à afficher
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Link
            to="/contacts"
            className="text-fhhabitat hover:text-fhhabitat/80 text-sm font-medium"
          >
            Voir tous les contacts →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentContacts;
