
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AuthLayout from '@/components/auth/AuthLayout';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    try {
      const response = await fetch('http://localhost/pfe/backend/controllers/forgotPassword.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log('Réinitialisation du mot de passe demandée pour:', data.email);
      const result = await response.json();

      if (response.ok) {
        toast.success(`Code de vérification envoyé à ${data.email}`, {
              description: "Veuillez vérifier votre email et entrer le code pour vérifier votre compte.",
            });
        setTimeout(() => {
          toast.success('Redirection vers la page de réinitialisation du mot de passe...');
          localStorage.setItem('email', data.email);
          navigate('/reset-password');
        }, 1000);
      } else {
        toast.error(result.message || 'Échec de l\'envoi du code de vérification. Veuillez réessayer.'); 
      }
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation du mot de passe :', error);
      toast.error('Une erreur est survenue lors de la demande de réinitialisation du mot de passe. Veuillez réessayer plus tard.');
    }
  }

  return (
    <AuthLayout 
      title="Réinitialiser votre mot de passe" 
      subtitle="Entrez votre email pour recevoir un lien de réinitialisation"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="nom@exemple.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Envoyer le lien
          </Button>

          <div className="text-center text-sm">
            <p>
              Vous vous souvenez de votre mot de passe ?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                Retour à la connexion
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
}
