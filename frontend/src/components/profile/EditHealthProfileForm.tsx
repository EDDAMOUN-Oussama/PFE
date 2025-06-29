
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
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetchUser: () => Promise<void>;
}

export const EditHealthProfileForm = ({user, open, onOpenChange, refetchUser }: EditHealthProfileFormProps) => {
  const form = useForm<HealthProfileFormData>({
    resolver: zodResolver(healthProfileSchema),
    defaultValues: {
      currentWeight: user.currentWeight || 70,
      goalWeight: user.goalWeight || 65,
      height: user.height || 175,
      goalCalories: user.goalCalories || 2000,
      activityLevel: user.activityLevel || 'Active',
    },
  });

  const onSubmit = async (data: HealthProfileFormData) => {
    try {
      const response = await fetch ('http://localhost/pfe/backend/controllers/updateUserHealth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...data }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Profil de santé mis à jour avec succès');
        await refetchUser();
        onOpenChange(false);
      } else {
        toast.error('Erreur lors de la mise à jour du profil de santé');
      }
    }
    catch (error) {
      console.error('Error updating health profile:', error);
      toast.error('Erreur lors de la mise à jour du profil de santé');
    } 
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
                        step="1"
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
