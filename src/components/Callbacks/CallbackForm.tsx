
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type CallbackFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const CallbackForm = ({ open, onOpenChange, onSuccess }: CallbackFormProps) => {
  const [newRequest, setNewRequest] = useState({ name: '', phone: '' });
  const { toast } = useToast();

  const handleAddRequest = async () => {
    if (!newRequest.name || !newRequest.phone) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('callback_requests')
        .insert([
          {
            name: newRequest.name,
            phone: newRequest.phone,
            status: 'pending',
          },
        ]);

      if (error) {
        console.error('Error adding callback request:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible d\'ajouter la demande de rappel: ' + error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Succès',
        description: 'Demande de rappel ajoutée avec succès',
      });
      setNewRequest({ name: '', phone: '' });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur inattendue est survenue',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle demande de rappel</DialogTitle>
          <DialogDescription>
            Ajouter une nouvelle demande de rappel client
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input
              id="name"
              value={newRequest.name}
              onChange={(e) => setNewRequest({ ...newRequest, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Téléphone
            </Label>
            <Input
              id="phone"
              value={newRequest.phone}
              onChange={(e) => setNewRequest({ ...newRequest, phone: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddRequest}>
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallbackForm;
