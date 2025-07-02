
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useHealth } from "@/contexts/HealthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  type: z.enum(["cardio", "Musculation", "Flexibilité", "sports", "Autre"], {
    errorMap: () => ({ message: "Veuillez sélectionner un type d'exercice." }),
  }),
  duration: z.coerce.number().min(1, { message: "La durée doit être d'au moins 1 minute." }),
  caloriesBurned: z.coerce.number().min(0, { message: "Les calories doivent être d'au moins 1." }),
});

const MET_VALUES: Record<string, number> = {
  cardio: 7,     
  Musculation: 6,
  Flexibilité: 3,
  sports: 8,     
  Autre: 5,      
};

function calculateCaloriesBurned(
  type: string,
  duration: number,
  weightKg: number
): number {
  const met = MET_VALUES[type] || 5;
  const durationHours = duration / 60;
  return Math.round(met * weightKg * durationHours);
};


export function AddExerciseForm({ onFinished }: { onFinished?: () => void }) {
  const { addExerciseEntry, user } = useHealth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "cardio",
      duration: 30,
      caloriesBurned: 0,
    },
  });

  const watchType = form.watch('type');
  const watchDuration = form.watch('duration');

  useEffect(() => {
    if (user && watchType && watchDuration > 0) {
      const calculated = calculateCaloriesBurned(watchType, watchDuration, user.currentWeight);
      form.setValue('caloriesBurned', calculated, { shouldValidate: true });
    }
  }, [watchType, watchDuration, user]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    addExerciseEntry({
      name: values.name,
      type: values.type,
      duration: values.duration,
      caloriesBurned: values.caloriesBurned,
      date: new Date().toISOString(),
    });
    form.reset();
    if (onFinished) {
      onFinished();
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ajouter un exercice</CardTitle>
        <CardDescription>Remplissez les détails de votre séance d'exercice.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'exercice</FormLabel>
                  <FormControl>
                    <Input placeholder="Course à pied" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'exercice</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="Musculation">Musculation</SelectItem>
                      <SelectItem value="Flexibilité">Flexibilité</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée (min)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="caloriesBurned"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calories brûlées</FormLabel>
                    <FormControl>
                      <Input type="number"  {...field} min={1} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Ajouter l'exercice</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default AddExerciseForm;
