
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
  deadline: z.string().refine((date) => !date || new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "La date limite ne peut pas être antérieure à aujourd'hui."
  })
});

export function AddGoalForm({ onFinished }: { onFinished?: () => void }) {
  const { user, addGoal } = useHealth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "weight",
      target: 0,
      currentValue: user?.currentWeight ?? 0,
      deadline: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const progress = values.target > 0 ? Math.min((values.currentValue / values.target) * 100, 100) : 0;
    // if (values.type === "weight" && values.currentValue > values.target) {
    //   toast.error("La valeur actuelle ne peut pas être inférieure ou égale à la cible pour un objectif de poids.");
    //   return;
    // } else
     if (values.type === "calories" && values.currentValue > values.target) {
      toast.error("La valeur actuelle ne peut pas être supérieure à la cible pour un objectif de calories.");
      return;
    } else if (values.type === "exercise" && values.currentValue > values.target) {
      toast.error("La valeur actuelle ne peut pas être supérieure à la cible pour un objectif d'exercice.");
      return;
    }

    try {
    await addGoal({
      title: values.title,
      type: values.type,
      target: values.target,
      currentValue: values.currentValue,
      progress: progress,
      deadline: values.deadline || undefined,
    });

    form.reset();
    if (onFinished) {
      onFinished();
    }
    } catch (error) { toast.error(error instanceof Error ? error.message : "Creation impossible."); }
  }

  const getUnitLabel = (type: string) => {
    switch (type) {
      case 'weight':
        return 'kg';
      case 'calories':
        return 'kcal';
      case 'exercise':
        return 'min';
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
                <Input placeholder="Mon objectif " {...field} />
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
                  <SelectItem value="calories">Calories sur la periode</SelectItem>
                  <SelectItem value="exercise">Exercice sur la periode</SelectItem>
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
                  <Input type="number" step="0.1" placeholder="0" {...field} />
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
                  <Input type="number" step="0.1" placeholder="0" {...field} />
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
              <FormLabel>Date limite</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>Créer l'objectif</Button>
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
