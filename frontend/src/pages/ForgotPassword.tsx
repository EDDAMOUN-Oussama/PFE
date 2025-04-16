
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

  function onSubmit(data: ForgotPasswordFormValues) {
    console.log('Password reset requested for:', data.email);
    // In a real app, this would be an API call to request a password reset
    
    // For now, let's simulate a successful request
    setTimeout(() => {
      toast.success('Password reset link sent to your email!');
      navigate('/login');
    }, 1000);
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
