
import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
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
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Propriété</TableHead>
            <TableHead>Occupation</TableHead>
            <TableHead>Code Postal</TableHead>
            <TableHead>Revenus</TableHead>
            <TableHead>Travaux envisagés</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="font-mono text-xs">{submission.id}</TableCell>
              <TableCell className="font-medium">{submission.name}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{submission.email}</span>
                  <span className="text-sm text-gray-500">{submission.phone}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{submission.property_type}</span>
                  <span className="text-sm text-gray-500">Construction: {submission.construction_year}</span>
                  <span className="text-sm text-gray-500">{submission.occupants} occupant(s)</span>
                </div>
              </TableCell>
              <TableCell>
                {submission.occupancy_status ? (
                  <span className="text-sm">{submission.occupancy_status}</span>
                ) : (
                  <span className="text-sm text-gray-400">Non spécifié</span>
                )}
              </TableCell>
              <TableCell>{submission.postal_code}</TableCell>
              <TableCell>
                {submission.income_range ? (
                  <span className="text-sm">{submission.income_range}</span>
                ) : (
                  <span className="text-sm text-gray-400">Non spécifié</span>
                )}
              </TableCell>
              <TableCell>{getWorksBadge(submission.planned_works)}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{format(new Date(submission.submitted_at), 'dd/MM/yyyy')}</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(submission.submitted_at), { 
                      addSuffix: true, 
                      locale: fr 
                    })}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EligibilityTable;
