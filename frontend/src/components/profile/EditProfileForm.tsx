
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
// import { Form } from '@/components/ui/form';
// import { toast } from 'sonner';
// import { Mail, User } from 'lucide-react';
// import { EmailVerificationDialog } from './EmailVerificationDialog';
// import { DatePickerField } from './DatePickerField';
// import { InputField } from './InputField';

// const profileSchema = z.object({
//   FullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
//   email: z.string().email('Adresse email invalide'),
//   dateOfBirth: z.date({
//     required_error: "La date de naissance est requise",
//   }),
//   age: z.number().min(1, 'L\'âge doit être valide').max(200, 'L\'âge doit être valide'),
// });

// type ProfileFormData = z.infer<typeof profileSchema>;

// interface EditProfileFormProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export const EditProfileForm = ({ user, open, onOpenChange, refetchUser }: EditProfileFormProps) => {
//   const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
//   const [newEmail, setNewEmail] = useState('');

//   const calculateAge = (birthdateString) => {
//     if (!birthdateString) return '?';
//     const birthDate = new Date(birthdateString);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const m = today.getMonth() - birthDate.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; }
//     return age;
//   };

//   const form = useForm<ProfileFormData>({
//     resolver: zodResolver(profileSchema),
//     defaultValues: {
//       FullName: user.name || '',
//       email: user.email || '',
//       dateOfBirth: user.birthdate ? new Date(user.birthdate) : null,
//       age: calculateAge(user.birthdate) || 0,
//     },
//   });

//   const onSubmit = (data: ProfileFormData) => {
//     const currentEmail = user.email || '';
//     const updatedData = {
//       name: data.FullName,
//       email: data.email,
//       birthdate: data.dateOfBirth ? data.dateOfBirth.toISOString() : null,
//     };
    
//     if (data.email !== currentEmail) {
//       setNewEmail(data.email);
//       setNeedsEmailVerification(true);
//       toast.info('Un code de vérification a été envoyé à votre nouvelle adresse email');
//     } else {
//       toast.success('Profil mis à jour avec succès');
//       onOpenChange(false);
//     }
//   };

//   const handleVerificationComplete = () => {
//     setNeedsEmailVerification(false);
//     onOpenChange(false);
//   };

//   const handleVerificationCancel = () => {
//     setNeedsEmailVerification(false);
//   };

//   if (needsEmailVerification) {
//     return (
//       <EmailVerificationDialog
//         open={open}
//         onOpenChange={onOpenChange}
//         newEmail={newEmail}
//         onVerificationComplete={handleVerificationComplete}
//         onCancel={handleVerificationCancel}
//       />
//     );
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>Modifier le profil</DialogTitle>
//           <DialogDescription>
//             Mettez à jour vos informations personnelles
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <InputField
//               control={form.control}
//               name="FullName"
//               label="Nom et Prénom"
//               icon={User}
//             />

//             <InputField
//               control={form.control}
//               name="email"
//               label="Email"
//               type="email"
//               icon={Mail}
//             />

//             <DatePickerField
//               control={form.control}
//               name="dateOfBirth"
//               label="Date de naissance"
//             />

//             <div className="flex space-x-2 pt-4">
//               <Button type="submit" className="flex-1">
//                 Sauvegarder
//               </Button>
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={() => onOpenChange(false)}
//                 className="flex-1"
//               >
//                 Annuler
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// };



import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { EmailVerificationDialog } from './EmailVerificationDialog';
import { useForm } from 'react-hook-form';////
import { DatePickerField } from './DatePickerField';/////



export const EditProfileForm = ({ user, open, onOpenChange, refetchUser }) => {
  const [formData, setFormData] = useState({ name: '', email: '', birthdate: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [age, setAge] = useState('?');

  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    if (user) {
      const birthdate = user.birthdate ? user.birthdate.split(' ')[0] : '';
      setFormData({
        name: user.name || '',
        email: user.email || '',
        birthdate,
      });
      setAge(calculateAge(birthdate));
    }
  }, [user, open]);

  const calculateAge = (birthdate) => {
    if (!birthdate) return '?';
    const birth = new Date(birthdate);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      calculatedAge--;
    }
    return calculatedAge.toString();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (id === 'birthdate') {
      setAge(calculateAge(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    await updateUserData();
    if (formData.email !== user.email) {
      setNewEmail(formData.email);
      setNeedsEmailVerification(true);
      toast.info('Un code de vérification a été envoyé à votre nouvelle adresse email');
      return;
    }

  };

  const updateUserData = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost/pfe/backend/controllers/updateUser.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...formData }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Profil mis à jour avec succès !');
        await refetchUser();
        onOpenChange(false);
      } else {
        toast.error(`Erreur : ${result.message}`);
      }
    } catch (error) {
      toast.error('Une erreur de connexion est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationComplete = async () => {
    setNeedsEmailVerification(false);
    await updateUserData(); 
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le profil</DialogTitle>
          <DialogDescription>Mettez à jour vos informations personnelles.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Prénom et Nom</Label>
            <Input id="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="birthdate">Date de naissance</Label>
            <Input id="birthdate" type="date" value={formData.birthdate} onChange={handleChange} />
            <p className="text-sm text-muted-foreground">Âge: {age}</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
