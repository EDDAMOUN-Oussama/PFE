
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useI18n } from '@/contexts/I18nContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      const res = await fetch('http://localhost/pfe/backend/controllers/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Échec de la connexion');
      }

      const result = await res.json();

      if (result.success) {
        toast.success('Connexion réussie !');
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('user_id', result.user.id.toString());
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion :', error);
      toast.error('Une erreur s\'est produite lors de la connexion');
    }
  }

  return (
    <AuthLayout 
      title={t('auth.welcomeBack')} 
      subtitle={t('auth.signInCredentials')}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.email')}</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link 
                to="/forgot-password" 
                className="font-medium text-primary hover:text-primary/80"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>
          </div>
            <Button type="submit" className="w-full">
            {t('auth.signIn')}
            </Button>

            <div className="text-center text-sm">
            <p>
            Vous n'avez pas de compte ?{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary/80">
              {t('auth.signUp')}
              </Link>
            </p>
            <p className="mt-2">
              <Link to="/" className="font-medium text-primary hover:text-primary/80">
              Retour à l'accueil
              </Link>
            </p>
            </div>
        </form>
      </Form>
    </AuthLayout>
  );
}
