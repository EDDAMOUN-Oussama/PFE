
import { useState } from 'react';
import { format, differenceInYears } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface DatePickerFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
}

export const DatePickerField = <T extends FieldValues>({ 
  control, 
  name, 
  label 
}: DatePickerFieldProps<T>) => {
  const [month, setMonth] = useState<Date>(new Date());

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const calculatedAge = field.value ? differenceInYears(new Date(), field.value) : null;
        
        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "dd/MM/yyyy")
                    ) : (
                      <span>Choisir une date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 border-b">
                  <div className="flex space-x-2">
                    <Select
                      value={month.getMonth().toString()}
                      onValueChange={(value) => {
                        const newMonth = new Date(month);
                        newMonth.setMonth(parseInt(value));
                        setMonth(newMonth);
                      }}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {format(new Date(2000, i, 1), "MMMM")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={month.getFullYear().toString()}
                      onValueChange={(value) => {
                        const newMonth = new Date(month);
                        newMonth.setFullYear(parseInt(value));
                        setMonth(newMonth);
                      }}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 100 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  month={month}
                  onMonthChange={setMonth}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {calculatedAge && (
              <p className="text-sm text-muted-foreground">
                Âge : {calculatedAge} ans
              </p>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
