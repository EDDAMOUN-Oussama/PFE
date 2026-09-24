
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { useI18n } from '@/contexts/I18nContext';

const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  code_viryfication: z.string().length(6, { message: 'Le code de vérification doit contenir exactement 6 caractères' }),
  password: z.string().min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: localStorage.getItem('email') || '',
      password: '',
      confirmPassword: '',
      code_viryfication: '', 
    },
  });

  async function onSubmit(data: ResetPasswordFormValues) {
    try {
      const response = await fetch('http://localhost/pfe/PFE/backend/controllers/resetpass.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    console.log('Password reset with:', data);
      const result = await response.json();

      if (response.ok) {
        toast.success('Mot de passe réinitialisé avec succès!', {
              description: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
            });
        setTimeout(() => {
          localStorage.removeItem('email');
          navigate('/login');
        }, 1000);
      } else {
        toast.error(result.message || 'Échec de la réinitialisation du mot de passe. Veuillez réessayer.');
      }
  } catch (error) { 
      console.error('Erreur lors de la réinitialisation du mot de passe :', error);
      toast.error('Une erreur s\'est produite lors de la réinitialisation de votre mot de passe. Veuillez réessayer plus tard.');
    }
  }

  return (
    <AuthLayout 
      title={t('auth.resetPasswordTitle')}
      subtitle={t('auth.resetPasswordSubtitle')}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <FormField
            control={form.control}
            name="code_viryfication"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code Verification</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Input
                        key={index}
                        type="text"
                        maxLength={1}
                        className="w-12 text-center"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d$/.test(value) || value === "") {
                            const newValue = field.value.split("");
                            newValue[index] = value;
                            field.onChange(newValue.join(""));
                            if (value !== "" && index < 5) {
                              const nextInput = document.querySelector(
                                `input[data-index="${index + 1}"]`
                              ) as HTMLInputElement;
                              nextInput?.focus();
                            }
                          }
                        }}
                        value={field.value[index] || ""}
                        data-index={index}
                      />
                    ))}
                  </div>
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
                <FormLabel>{t('auth.newPassword')}</FormLabel>
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
                        {showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.confirmNewPassword')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span className="sr-only">
                        {showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {t('auth.resetPassword')}
          </Button>

          <div className="text-center text-sm">
            <p>
              {t('auth.rememberPassword')}{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                {t('auth.backToLogin')}
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
}
