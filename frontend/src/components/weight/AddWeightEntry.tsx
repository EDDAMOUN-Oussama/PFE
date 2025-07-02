
import { useState } from 'react';
import { useHealth } from '@/contexts/HealthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddWeightEntry = () => {
  const { addWeightEntry, user, isLoading } = useHealth();
  const { t } = useI18n();
  const { toast } = useToast();
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState<Date>(new Date());

  if (isLoading || !user) {
    return <div>{t('loading')}</div>;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight || isNaN(Number(weight))) {
      toast({
        title: "Invalid weight",
        description: "Please enter a valid weight value",
        variant: "destructive",
      });
      return;
    }
    
    if (!date || isNaN(new Date(date).getTime())) {
      toast({
        title: "Invalid date",
        description: "Please select a valid date",
        variant: "destructive",
      });
      return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      toast({
        title: "Date invalide",
        description: "Vous ne pouvez pas entrer un poids pour une date future.",
        variant: "destructive",
      });
      return;
    }
    
    // Add the weight entry
    addWeightEntry({
      date: format(date, 'yyyy-MM-dd'),
      weight: Number(weight),
    });
    
    // Reset form
    setWeight('');
    
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Ajouter une entrée de poids</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="weight" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Poids (kg)
              </label>
              <Input
                id="weight"
                type="number"
                step="1"
                placeholder={user.currentWeight?.toString() || t('weight.enterWeight')}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Date
              </label>
              <Input
                id="date"
                type="date"
                value={format(date, 'yyyy-MM-dd')}
                onChange={(e) => setDate(new Date(e.target.value))}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-4">
            {t('weight.addWeightEntry')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="bg-muted/50 flex flex-col items-start px-6 py-4">
        <h4 className="text-sm font-semibold mb-1">{t('weight.tips')}</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>{t('weight.tip1')}</li>
          <li>{t('weight.tip2')}</li>
          <li>{t('weight.tip3')}</li>
        </ul>
      </CardFooter>
    </Card>
  );
};

export default AddWeightEntry;
