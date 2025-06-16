
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const consultationSchema = z.object({
  patientName: z.string().min(1, 'Le nom du patient est requis'),
  consultationType: z.string().min(1, 'Le type de consultation est requis'),
  symptoms: z.string().min(1, 'Les symptômes sont requis'),
  duration: z.string().min(1, 'La durée des symptômes est requise'),
  severity: z.string().min(1, 'La sévérité est requise'),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  previousTreatments: z.string().optional(),
  urgentConsultation: z.boolean().default(false),
  additionalNotes: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

interface ConsultationFormProps {
  onSubmit: (data: ConsultationFormData) => void;
  onCancel: () => void;
}

const ConsultationForm = ({ onSubmit, onCancel }: ConsultationFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  const urgentConsultation = watch('urgentConsultation');

  const handleFormSubmit = (data: ConsultationFormData) => {
    onSubmit(data);
    toast.success('Demande de consultation envoyée avec succès');
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="patientName">Nom du patient</Label>
        <Input
          id="patientName"
          placeholder="Nom complet du patient"
          {...register('patientName')}
        />
        {errors.patientName && <p className="text-sm text-destructive">{errors.patientName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="consultationType">Type de consultation</Label>
        <Select onValueChange={(value) => setValue('consultationType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">Médecine générale</SelectItem>
            <SelectItem value="cardiology">Cardiologie</SelectItem>
            <SelectItem value="dermatology">Dermatologie</SelectItem>
            <SelectItem value="neurology">Neurologie</SelectItem>
            <SelectItem value="orthopedics">Orthopédie</SelectItem>
            <SelectItem value="psychiatry">Psychiatrie</SelectItem>
            <SelectItem value="nutrition">Nutrition</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
        {errors.consultationType && <p className="text-sm text-destructive">{errors.consultationType.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="symptoms">Symptômes</Label>
        <Textarea
          id="symptoms"
          placeholder="Décrivez les symptômes en détail"
          {...register('symptoms')}
        />
        {errors.symptoms && <p className="text-sm text-destructive">{errors.symptoms.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Durée des symptômes</Label>
          <Select onValueChange={(value) => setValue('duration', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-day">Moins d'1 jour</SelectItem>
              <SelectItem value="1-3-days">1-3 jours</SelectItem>
              <SelectItem value="1-week">1 semaine</SelectItem>
              <SelectItem value="1-month">1 mois</SelectItem>
              <SelectItem value="more-month">Plus d'1 mois</SelectItem>
            </SelectContent>
          </Select>
          {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="severity">Sévérité</Label>
          <Select onValueChange={(value) => setValue('severity', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sévérité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mild">Léger</SelectItem>
              <SelectItem value="moderate">Modéré</SelectItem>
              <SelectItem value="severe">Sévère</SelectItem>
              <SelectItem value="critical">Critique</SelectItem>
            </SelectContent>
          </Select>
          {errors.severity && <p className="text-sm text-destructive">{errors.severity.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="medications">Médicaments actuels (optionnel)</Label>
        <Textarea
          id="medications"
          placeholder="Listez les médicaments que vous prenez actuellement"
          {...register('medications')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies connues (optionnel)</Label>
        <Input
          id="allergies"
          placeholder="Allergies médicamenteuses ou autres"
          {...register('allergies')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="previousTreatments">Traitements précédents (optionnel)</Label>
        <Textarea
          id="previousTreatments"
          placeholder="Traitements déjà essayés pour ce problème"
          {...register('previousTreatments')}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="urgentConsultation"
          checked={urgentConsultation}
          onCheckedChange={(checked) => setValue('urgentConsultation', !!checked)}
        />
        <Label htmlFor="urgentConsultation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Consultation urgente
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalNotes">Notes supplémentaires (optionnel)</Label>
        <Textarea
          id="additionalNotes"
          placeholder="Informations supplémentaires importantes"
          {...register('additionalNotes')}
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="flex-1">
          Envoyer la demande
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default ConsultationForm;
