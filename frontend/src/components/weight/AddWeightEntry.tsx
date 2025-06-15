
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
  const { addWeightEntry, user } = useHealth();
  const { t } = useI18n();
  const { toast } = useToast();
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState<Date>(new Date());

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
    
    // Add the weight entry
    addWeightEntry({
      date: format(date, 'yyyy-MM-dd'),
      weight: Number(weight),
    });
    
    // Reset form
    setWeight('');
    
    // Show success message
    toast({
      title: "Weight added",
      description: "Your weight entry has been recorded successfully",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{t('weight.addEntry')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="weight" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('weight.weightKg')}
              </label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder={user.currentWeight?.toString() || t('weight.enterWeight')}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('weight.date')}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
