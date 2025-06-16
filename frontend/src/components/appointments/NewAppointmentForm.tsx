
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const appointmentSchema = z.object({
  type: z.string().min(1, 'Le type de rendez-vous est requis'),
  doctor: z.string().min(1, 'Le médecin est requis'),
  date: z.date({
    required_error: 'La date est requise',
  }),
  time: z.string().min(1, 'L\'heure est requise'),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface NewAppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
}

const NewAppointmentForm = ({ onSubmit, onCancel }: NewAppointmentFormProps) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const appointmentType = watch('type');

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const handleFormSubmit = (data: AppointmentFormData) => {
    onSubmit(data);
    toast.success('Rendez-vous programmé avec succès');
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Type de rendez-vous</Label>
        <Select onValueChange={(value) => setValue('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consultation">Consultation médicale</SelectItem>
            <SelectItem value="followup">Suivi</SelectItem>
            <SelectItem value="specialist">Spécialiste</SelectItem>
            <SelectItem value="emergency">Urgence</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="doctor">Médecin</Label>
        <Select onValueChange={(value) => setValue('doctor', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un médecin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dr-martin">Dr. Martin Dubois</SelectItem>
            <SelectItem value="dr-sophie">Dr. Sophie Laurent</SelectItem>
            <SelectItem value="dr-jean">Dr. Jean Moreau</SelectItem>
            <SelectItem value="marie-nutritionist">Marie Lefebvre (Nutritionniste)</SelectItem>
          </SelectContent>
        </Select>
        {errors.doctor && <p className="text-sm text-destructive">{errors.doctor.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Sélectionner une date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setValue('date', date as Date);
              }}
              disabled={(date) => date < new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Heure</Label>
        <Select onValueChange={(value) => setValue('time', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner l'heure" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.time && <p className="text-sm text-destructive">{errors.time.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Motif (optionnel)</Label>
        <Input
          id="reason"
          placeholder="Motif de la consultation"
          {...register('reason')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optionnel)</Label>
        <Textarea
          id="notes"
          placeholder="Notes supplémentaires"
          {...register('notes')}
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="flex-1">
          Confirmer le rendez-vous
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default NewAppointmentForm;
