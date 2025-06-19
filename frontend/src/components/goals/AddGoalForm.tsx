
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
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, { message: "Le titre doit contenir au moins 2 caractères." }),
  type: z.enum(["weight", "calories", "exercise"], {
    errorMap: () => ({ message: "Veuillez sélectionner un type d'objectif." }),
  }),
  target: z.coerce.number().min(1, { message: "La cible doit être d'au moins 1." }),
  currentValue: z.coerce.number().min(0, { message: "La valeur actuelle doit être positive." }),
  deadline: z.string().optional(),
});

export function AddGoalForm({ onFinished }: { onFinished?: () => void }) {
  const { addGoal } = useHealth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "weight",
      target: 0,
      currentValue: 0,
      deadline: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const progress = values.target > 0 ? Math.min((values.currentValue / values.target) * 100, 100) : 0;
    
    addGoal({
      title: values.title,
      type: values.type,
      target: values.target,
      currentValue: values.currentValue,
      progress: progress,
      deadline: values.deadline || undefined,
    });
    
    toast.success("Objectif ajouté avec succès !");
    form.reset();
    if (onFinished) {
      onFinished();
    }
  }

  const getUnitLabel = (type: string) => {
    switch (type) {
      case 'weight':
        return 'kg';
      case 'calories':
        return 'kcal';
      case 'exercise':
        return 'min/semaine';
      default:
        return '';
    }
  };

  const watchedType = form.watch("type");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de l'objectif</FormLabel>
              <FormControl>
                <Input placeholder="Mon objectif de poids" {...field} />
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
              <FormLabel>Type d'objectif</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="weight">Poids</SelectItem>
                  <SelectItem value="calories">Calories quotidiennes</SelectItem>
                  <SelectItem value="exercise">Exercice hebdomadaire</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="currentValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valeur actuelle ({getUnitLabel(watchedType)})</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objectif cible ({getUnitLabel(watchedType)})</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date limite (optionnel)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2">
          <Button type="submit">Créer l'objectif</Button>
          {onFinished && (
            <Button type="button" variant="outline" onClick={onFinished}>
              Annuler
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

export default AddGoalForm;
