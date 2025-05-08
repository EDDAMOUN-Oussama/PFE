
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff, CalendarIcon,  ChevronLeft, ChevronRight} from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useEffect } from 'react'; 
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'; 

const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  currentWeight: z.preprocess(
  (value) => parseFloat(value as string),
  z.number().min(1).max(500)
),
goalWeight: z.preprocess(
  (value) => parseFloat(value as string),
  z.number().min(1).max(500)
),
height: z.preprocess(
  (value) => value === '' ? undefined : parseFloat(value as string),
  z.number({
    required_error: 'This field is required',
    invalid_type_error: 'Invalid number',
  }).min(1).max(500)
),
age: z.preprocess(
  (value) => parseFloat(value as string),
  z.number().min(0).max(150)
),
gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
activityLevel: z.enum(["sedentary", "light", "active", "veryActive"], { required_error: "Activity level is required" }),
password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
message: "Passwords don't match",
path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  
  const [submittedData, setSubmittedData] = useState<RegisterFormValues | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      currentWeight: undefined,
      goalWeight: undefined,
      height: undefined,
      age: undefined,
      gender: 'male',
      activityLevel: 'sedentary',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(data: RegisterFormValues) {
    fetch('http://localhost/pfe/backend/controllers/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        if (res.success) {
          console.log('Registration with:', data);
          setSubmittedData(data);
  
          // Simulate sending verification code to email
          const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
          console.log('Verification code:', randomCode); // In a real app, this would be sent to the email
  
          toast.success(`Verification code sent to ${data.email}`, {
            description: "Please check your email and enter the code to verify your account."
          });
          setIsVerifying(true);
          // You may want to store the code in state if you want to validate against it
          setGeneratedCode(randomCode); // Assuming you have a useState for it
        } else {
          toast.error(res.message || 'Registration failed');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong');
        console.error(err);
      });
  }
  
  function verifyCode() {
    // In a real app, we would validate the code against what was sent
    // For demo purposes, any 6-digit code is accepted
    if (verificationCode.length === 6) {
      toast.success('Email verified successfully!');
      
      // Complete the registration
      setTimeout(() => {
        toast.success('Account created successfully!');
        navigate('/login');
      }, 1000);
    } else {
      toast.error('Invalid verification code. Please try again.');
    }
  }

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Generate years from 1900 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  if (isVerifying) {
    return (
      <AuthLayout 
        title="Verify your email" 
        subtitle={`Enter the 6-digit code sent to ${submittedData?.email}`}
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="h-12 w-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={verificationCode[index] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9]$/.test(value) || value === '') {
                      const newCode = verificationCode.split('');
                      newCode[index] = value;
                      setVerificationCode(newCode.join(''));
                      
                      // Auto-focus next input
                      if (value !== '' && index < 5) {
                        const nextInput = e.target.parentElement?.children[index + 1] as HTMLInputElement;
                        if (nextInput) nextInput.focus();
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    // Handle backspace to go to previous input
                    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                      const prevInput = e.currentTarget.parentElement?.children[index - 1] as HTMLInputElement;
                      if (prevInput) prevInput.focus();
                    }
                  }}
                />
              ))}
            </div>
          </div>
          
          <Button onClick={verifyCode} className="w-full">
            Verify Email
          </Button>
          
          <div className="text-center text-sm">
            <p>
              Didn't receive the code?{' '}
              <Button variant="link" className="p-0 h-auto" onClick={() => {
                toast.success('Verification code resent');
              }}>
                Resend
              </Button>
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }
  

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Enter your information to get started"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="KADOUR Omar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />  

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
            
            <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="flex justify-between p-3 border-b">
                      <Select
                        value={calendarMonth.getMonth().toString()}
                        onValueChange={(value) => {
                          const newDate = new Date(calendarMonth);
                          newDate.setMonth(parseInt(value));
                          setCalendarMonth(newDate);
                        }}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month, index) => (
                            <SelectItem key={month} value={index.toString()}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={calendarMonth.getFullYear().toString()}
                        onValueChange={(value) => {
                          const newDate = new Date(calendarMonth);
                          newDate.setFullYear(parseInt(value));
                          setCalendarMonth(newDate);
                        }}
                      >
                        <SelectTrigger className="w-[90px]">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="h-[200px]">
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      month={calendarMonth}
                      onMonthChange={setCalendarMonth}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
            <FormField
            control={form.control}
            name="currentWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Weight</FormLabel>
                <FormControl>
                  <Input placeholder="80" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goalWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>goal Weight</FormLabel>
                <FormControl>
                  <Input placeholder="70" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>height(cm)</FormLabel>
                <FormControl>
                  <Input placeholder="170" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input placeholder="25" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="gender-male" />
                    <FormLabel htmlFor="gender-male" className="font-normal">
                      Male
                    </FormLabel>
                  </div>
          
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="gender-female" />
                    <FormLabel htmlFor="gender-female" className="font-normal">
                      Female
                    </FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />



          <FormField
            control={form.control}
            name="activityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Level</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded p-2"
                  >
                    <option value="sedentary">Sedentary (little to no exercise)</option>
                    <option value="light">Lightly active (light exercise/sports 1-3 days/week)</option>
                    <option value="active">Active (moderate exercise/sports 3-5 days/week)</option>
                    <option value="veryActive">Very active (hard exercise/sports 6-7 days a week)</option>
                  </select>
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
                <FormLabel>Password</FormLabel>
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
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
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
                        {showConfirmPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Create Account
          </Button>

          <div className="text-center text-sm">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
}
