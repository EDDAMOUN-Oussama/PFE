
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface EmailVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newEmail: string;
  onVerificationComplete: () => void;
  onCancel: () => void;
}

export const EmailVerificationDialog = ({ 
  open, 
  onOpenChange, 
  newEmail, 
  onVerificationComplete,
  onCancel 
}: EmailVerificationDialogProps) => {
  const [verificationCode, setVerificationCode] = useState('');

  const handleEmailVerification = () => {
    if (verificationCode.length === 6) {
      toast.success('Email vérifié et profil mis à jour avec succès');
      onVerificationComplete();
    } else {
      toast.error('Code de vérification invalide');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vérification de l'email</DialogTitle>
          <DialogDescription>
            Veuillez entrer le code de vérification envoyé à {newEmail}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="verification-code">Code de vérification</Label>
            <Input
              id="verification-code"
              placeholder="Entrez le code à 6 chiffres"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleEmailVerification} className="flex-1">
              Vérifier
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
