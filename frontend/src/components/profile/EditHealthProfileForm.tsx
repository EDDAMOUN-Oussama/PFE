
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Scale, Ruler, Target, Activity } from 'lucide-react';

const healthProfileSchema = z.object({
  currentWeight: z.number().min(20, 'Le poids doit être réaliste').max(300, 'Le poids doit être réaliste'),
  goalWeight: z.number().min(20, 'Le poids doit être réaliste').max(300, 'Le poids doit être réaliste'),
  height: z.number().min(100, 'La taille doit être réaliste').max(250, 'La taille doit être réaliste'),
  goalCalories: z.number().min(800, 'Les calories doivent être réalistes').max(5000, 'Les calories doivent être réalistes'),
  activityLevel: z.string().min(1, 'Veuillez sélectionner un niveau d\'activité'),
});

type HealthProfileFormData = z.infer<typeof healthProfileSchema>;

interface EditHealthProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditHealthProfileForm = ({ open, onOpenChange }: EditHealthProfileFormProps) => {
  const form = useForm<HealthProfileFormData>({
    resolver: zodResolver(healthProfileSchema),
    defaultValues: {
      currentWeight: 75,
      goalWeight: 70,
      height: 175,
      goalCalories: 2000,
      activityLevel: 'moderate',
    },
  });

  const onSubmit = (data: HealthProfileFormData) => {
    console.log('Health profile data:', data);
    toast.success('Profil de santé mis à jour avec succès');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mettre à jour le profil de santé</DialogTitle>
          <DialogDescription>
            Mettez à jour vos données de santé et objectifs
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poids actuel (kg)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Scale className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        className="pl-10" 
                        type="number" 
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </div>
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
                    <div className="relative">
                      <Target className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        className="pl-10" 
                        type="number" 
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </div>
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
                    <div className="relative">
                      <Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        className="pl-10" 
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goalCalories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objectif calorique quotidien</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Activity className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        className="pl-10" 
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </div>
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
                      <SelectItem value="sedentary">Sédentaire</SelectItem>
                      <SelectItem value="light">Légère activité</SelectItem>
                      <SelectItem value="moderate">Activité modérée</SelectItem>
                      <SelectItem value="active">Très actif</SelectItem>
                      <SelectItem value="extra">Extrêmement actif</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="flex-1">
                Sauvegarder
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
