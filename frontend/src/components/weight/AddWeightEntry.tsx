
import { useState } from 'react';
import { useHealth } from '@/contexts/HealthContext';
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
        <CardTitle className="text-xl font-bold">Add Weight Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="weight" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Weight (kg)
              </label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder={user.currentWeight?.toString() || "Enter weight"}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Date
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
            Add Weight Entry
          </Button>
        </form>
      </CardContent>
      <CardFooter className="bg-muted/50 flex flex-col items-start px-6 py-4">
        <h4 className="text-sm font-semibold mb-1">Weight Tips:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Weigh yourself at the same time each day</li>
          <li>• Use the same scale for consistent measurements</li>
          <li>• Track your weight regularly for better insights</li>
        </ul>
      </CardFooter>
    </Card>
  );
};

export default AddWeightEntry;
