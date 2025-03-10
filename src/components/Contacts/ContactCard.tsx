
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EligibilitySubmission } from '@/types/contact';

interface ContactCardProps {
  submission: EligibilitySubmission;
}

const ContactCard: React.FC<ContactCardProps> = ({ submission }) => {
  const getWorksBadges = (works: string[] | null) => {
    if (!works || works.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {works.map((work, index) => (
          <Badge key={index} variant="outline" className="whitespace-nowrap">
            {work}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{submission.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium">Contact:</p>
            <p className="text-sm">{submission.email}</p>
            <p className="text-sm">{submission.phone}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Adresse:</p>
            <p className="text-sm">{submission.postal_code}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Logement:</p>
            <p className="text-sm">{submission.property_type} ({submission.construction_year})</p>
            <p className="text-sm">{submission.occupants} occupant(s)</p>
            {submission.occupancy_status && (
              <p className="text-sm">{submission.occupancy_status}</p>
            )}
          </div>
          {submission.planned_works && (
            <div>
              <p className="text-sm font-medium">Travaux envisagés:</p>
              {getWorksBadges(submission.planned_works)}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        {formatDistanceToNow(new Date(submission.submitted_at), { 
          addSuffix: true, 
          locale: fr 
        })}
      </CardFooter>
    </Card>
  );
};

export default ContactCard;
