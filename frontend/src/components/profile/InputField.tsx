
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  type?: string;
  icon?: LucideIcon;
  placeholder?: string;
}

export const InputField = <T extends FieldValues>({ 
  control, 
  name, 
  label, 
  type = "text",
  icon: Icon,
  placeholder 
}: InputFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
              <Input 
                className={Icon ? "pl-10" : ""} 
                type={type}
                placeholder={placeholder}
                {...field} 
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
