
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EligibilitySubmission } from '@/types/contact';

interface EligibilityTableProps {
  submissions: EligibilitySubmission[];
  isLoading: boolean;
}

const EligibilityTable: React.FC<EligibilityTableProps> = ({ submissions, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-4">Chargement des données...</div>;
  }

  if (submissions.length === 0) {
    return <div className="text-center py-4">Aucune soumission trouvée</div>;
  }

  const getWorksBadge = (works: string[] | null) => {
    if (!works || works.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1">
        {works.map((work, index) => (
          <Badge key={index} variant="outline" className="whitespace-nowrap">
            {work}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Code Postal</TableHead>
            <TableHead>Logement</TableHead>
            <TableHead>Travaux envisagés</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="font-medium">{submission.name}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{submission.email}</span>
                  <span className="text-gray-500">{submission.phone}</span>
                </div>
              </TableCell>
              <TableCell>{submission.postal_code}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{submission.property_type}</span>
                  <span className="text-gray-500">{submission.construction_year}</span>
                  <span className="text-gray-500">{submission.occupants} occupant(s)</span>
                  {submission.occupancy_status && (
                    <span className="text-gray-500">{submission.occupancy_status}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>{getWorksBadge(submission.planned_works)}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(submission.submitted_at), { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EligibilityTable;
