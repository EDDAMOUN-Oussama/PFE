
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff, CalendarIcon } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { format, differenceInYears } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }),
  dateOfBirth: z.date({
    required_error: "La date de naissance est requise",
  }),
  currentWeight: z.number().int().min(1, { message: 'Le poids actuel est requis' }),
  goalWeight: z.number().int().min(1, { message: 'Le poids objectif est requis' }),
  goalCalories: z.number().int().min(1, { message: 'Le poids objectif est requis' }),
  height: z.number().int().min(1, { message: 'La taille est requise' }),
  gender: z.enum(['male', 'female'], { message: 'Veuillez sélectionner votre sexe' }),
  activityLevel: z.enum(['Sédentaire', 'Léger', 'Modéré', 'Actif', 'Très actif'], { 
    message: 'Veuillez sélectionner votre niveau d\'activité' 
  }),
  password: z.string().min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [submittedData, setSubmittedData] = useState<RegisterFormValues | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const dateOfBirth = form.watch('dateOfBirth');
  const calculatedAge = dateOfBirth ? differenceInYears(new Date(), dateOfBirth) : null;

  async function onSubmit(data: RegisterFormValues) {
    try {
      const formattedData = {
        ...data,
        dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
      };
      const response = await fetch('http://localhost/pfe/PFE/backend/controllers/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      console.log('Registration result:', formattedData);
      const result = await response.json();
      if (result.success) {
        toast.success(`Code de vérification envoyé à ${data.email}`, {
          description: "Veuillez vérifier votre email et entrer le code pour vérifier votre compte.",
        });
        setSubmittedData(data);
        setIsVerifying(true);
      } else {
        toast.error(result.message || 'Échec de l\'inscription. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      toast.error('Une erreur s\'est produite. Veuillez réessayer.');
    }
  }

  async function resendVerificationCode() {
    if (!submittedData?.email) {  
      toast.error('Aucun email soumis pour renvoyer le code de vérification.');
      return;
    }
    console.log('Renvoyer le code de vérification à:', submittedData.email);
    try {
      const resendResponse = await fetch('http://localhost/pfe/PFE/backend/controllers/resend_code.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: submittedData.email }),
      });

      const resendResult = await resendResponse.json();
      if (resendResult.success) {
        toast.success(`Code de vérification renvoyé à ${submittedData.email}`);
      } else {
        toast.error(resendResult.message || 'Échec de l\'envoi du code de vérification. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de la renvoi du code :', error);
      toast.error('Une erreur s\'est produite lors de l\'envoi du code. Veuillez réessayer.');
    }
  }


  async function verifyCode() {
    try {
      const verifyResponse = await fetch('http://localhost/pfe/PFE/backend/controllers/verify_code.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: submittedData?.email,
          code: verificationCode,
        }),
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResult.success) {
        toast.success('Email vérifié avec succès !');

        setTimeout(() => {
          toast.success('Compte créé avec succès !');
          navigate('/login');
        }, 1000);
      } else {
        toast.error(verifyResult.message || 'Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification :', error);
      toast.error('Une erreur s\'est produite. Veuillez réessayer.');
    }
  }

  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  if (isVerifying) {
    return (
      <AuthLayout 
        title="Vérifiez votre email" 
        subtitle={`Entrez le code à 6 chiffres envoyé à ${submittedData?.email}`}
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
                      
                      if (value !== '' && index < 5) {
                        const nextInput = e.target.parentElement?.children[index + 1] as HTMLInputElement;
                        if (nextInput) nextInput.focus();
                      }
                    }
                  }}
                  onKeyDown={(e) => {
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
            Vérifier l'email
          </Button>
          
          <div className="text-center text-sm">
            <p>
              Vous n'avez pas reçu le code ?{' '}
              <Button variant="link" onClick={resendVerificationCode}  className="p-0 h-auto">
                Renvoyer
              </Button>
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Créer un compte" 
      subtitle="Entrez vos informations pour commencer"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Nom Prenom" {...field} />
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
                  <Input placeholder="nom@exemple.com" {...field} />
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
                <FormLabel>Date de naissance</FormLabel>
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
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Choisir une date</span>
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
                          <SelectValue placeholder="Mois" />
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
                          <SelectValue placeholder="Année" />
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
                {calculatedAge && (
                  <p className="text-sm text-muted-foreground">
                    Âge : {calculatedAge} ans
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="currentWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poids actuel (kg)</FormLabel>
                  <FormControl>
                  <Input
                      type="number"
                      placeholder="70"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : '')}
                    />
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
                  <FormLabel>Poids objectif (kg)</FormLabel>
                  <FormControl>
                  <Input
                      type="number"
                      placeholder="65"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : '')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="goalCalories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories journalières (objectif)</FormLabel>
                  <FormControl>
                  <Input
                      type="number"
                      placeholder="2000"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : '')}
                    />
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
                <FormLabel>Taille (cm)</FormLabel>
                <FormControl>
                <Input
                    type="number"
                    placeholder="175"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : '')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexe</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <label htmlFor="male">Homme</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <label htmlFor="female">Femme</label>
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
                <FormLabel>Niveau d'activité</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre niveau d'activité" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sédentaire">Sédentaire (peu ou pas d'exercice)</SelectItem>
                    <SelectItem value="Léger">Léger (exercice léger 1-3 jours/semaine)</SelectItem>
                    <SelectItem value="Modéré">Modéré (exercice modéré 3-5 jours/semaine)</SelectItem>
                    <SelectItem value="Actif">Actif (exercice intense 6-7 jours/semaine)</SelectItem>
                    <SelectItem value="Très actif">Très actif (exercice très intense et travail physique)</SelectItem>
                  </SelectContent>
                </Select>
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
                        {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
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
                <FormLabel>Confirmer le mot de passe</FormLabel>
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
                        {showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Créer un compte
          </Button>

          <div className="text-center text-sm">
            <p>
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
}
