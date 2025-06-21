
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { Mail, User } from 'lucide-react';
import { EmailVerificationDialog } from './EmailVerificationDialog';
import { DatePickerField } from './DatePickerField';
import { InputField } from './InputField';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  dateOfBirth: z.date({
    required_error: "La date de naissance est requise",
  }),
  age: z.number().min(1, 'L\'âge doit être valide').max(120, 'L\'âge doit être valide'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProfileForm = ({ open, onOpenChange }: EditProfileFormProps) => {
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      dateOfBirth: new Date('1992-01-01'),
      age: 32,
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    const currentEmail = 'john@example.com';
    
    if (data.email !== currentEmail) {
      setNewEmail(data.email);
      setNeedsEmailVerification(true);
      toast.info('Un code de vérification a été envoyé à votre nouvelle adresse email');
    } else {
      toast.success('Profil mis à jour avec succès');
      onOpenChange(false);
    }
  };

  const handleVerificationComplete = () => {
    setNeedsEmailVerification(false);
    onOpenChange(false);
  };

  const handleVerificationCancel = () => {
    setNeedsEmailVerification(false);
  };

  if (needsEmailVerification) {
    return (
      <EmailVerificationDialog
        open={open}
        onOpenChange={onOpenChange}
        newEmail={newEmail}
        onVerificationComplete={handleVerificationComplete}
        onCancel={handleVerificationCancel}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le profil</DialogTitle>
          <DialogDescription>
            Mettez à jour vos informations personnelles
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              control={form.control}
              name="firstName"
              label="Prénom"
              icon={User}
            />

            <InputField
              control={form.control}
              name="lastName"
              label="Nom"
              icon={User}
            />

            <InputField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              icon={Mail}
            />

            <DatePickerField
              control={form.control}
              name="dateOfBirth"
              label="Date de naissance"
            />

            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="flex-1">
                Sauvegarder
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
