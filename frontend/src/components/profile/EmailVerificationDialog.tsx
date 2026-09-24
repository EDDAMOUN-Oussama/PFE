import { apiFetch } from '@/lib/api';
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
  onVerificationComplete: () => void | Promise<void>;
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
  const [isVerifying, setIsVerifying] = useState(false);

  const handleEmailVerification = async () => {
    if (!/^\d{6}$/.test(verificationCode)) {
      toast.error('Veuillez entrer le code de vérification.');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await apiFetch('verify_code_Modifer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newEmail,
          code: verificationCode,
          id: localStorage.getItem('user_id'),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Email vérifié et profil mis à jour avec succès');
        await onVerificationComplete();
      } else {
        toast.error(result.message || 'Code de vérification invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification :', error);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vérification de l'email</DialogTitle>
          <DialogDescription>
            Veuillez entrer le code de vérification envoyé à <strong>{newEmail}</strong>
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
              inputMode="numeric" autoComplete="one-time-code" maxLength={6}
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleEmailVerification} className="flex-1" disabled={isVerifying}>
              {isVerifying ? 'Vérification...' : 'Vérifier'}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isVerifying}
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
