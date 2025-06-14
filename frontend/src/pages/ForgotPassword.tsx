
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
  email: z.string().email({ message: 'Please enter a valid email address' }),
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
      console.log('Password reset requested for:', data.email);
      const result = await response.json();

      if (response.ok) {
        toast.success(`Verification code sent to ${data.email}`, {
          description: "Please check your email and enter the code to verify your account.",
        });
        setTimeout(() => {
          toast.success('Redirecting to reset password page...');
          localStorage.setItem('email', data.email);
          navigate('/reset-password');
        }, 2000);
      } else {
        toast.error(result.message || 'Failed to send verification code. Please try again.'); 
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
      toast.error('An error occurred while requesting password reset. Please try again later.');
    }
  }

      

  return (
    <AuthLayout 
      title="Reset your password" 
      subtitle="Enter your email to receive a password reset link"
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
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>

          <div className="text-center text-sm">
            <p>
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                Back to login
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
}
