
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHealth } from '@/contexts/HealthContext';
import { useToast } from '@/hooks/use-toast';

function calculateCalories(protein: number = 0, carbs: number = 0, fat: number = 0): number {
  const caloriesFromProtein = protein * 4;
  const caloriesFromCarbs = carbs * 4;
  const caloriesFromFat = fat * 9;
  return caloriesFromProtein + caloriesFromCarbs + caloriesFromFat;
}

const AddFoodForm = () => {
  const [foodName, setFoodName] = useState('');
  const [mealType, setMealType] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const { addFoodEntry } = useHealth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodName || !mealType || !calories) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const newFoodEntry = {
      name: foodName,
      mealType,
      calories: parseInt(calories),
      protein: protein ? parseInt(protein) : 0,
      carbs: carbs ? parseInt(carbs) : 0,
      fat: fat ? parseInt(fat) : 0,
      date: new Date().toISOString(),
    };

    addFoodEntry(newFoodEntry);
    
    // Reset form
    setFoodName('');
    setMealType('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');

  };

  useEffect(() => {
    const p = Number(protein) || 0;
    const c = Number(carbs) || 0;
    const f = Number(fat) || 0;
    const total = calculateCalories(p, c, f);
    setCalories(total.toString());
  }, [protein, carbs, fat]);

  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ajouter un Aliment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="foodName">Nom de l'aliment *</Label>
              <Input
                id="foodName"
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="Ex: Salade César"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="mealType">Type de repas *</Label>
              <Select value={mealType} onValueChange={setMealType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un repas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Petit-déjeuner</SelectItem>
                  <SelectItem value="lunch">Déjeuner</SelectItem>
                  <SelectItem value="dinner">Dîner</SelectItem>
                  <SelectItem value="snack">Collation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="calories">Calories *</Label>
              <Input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="kcal"
                min="0"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="protein">Protéines (g)</Label>
              <Input
                id="protein"
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="g"
                min="0"
              />
            </div>
            
            <div>
              <Label htmlFor="carbs">Glucides (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="g"
                min="0"
              />
            </div>
            
            <div>
              <Label htmlFor="fat">Lipides (g)</Label>
              <Input
                id="fat"
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="g"
                min="0"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Ajouter à mon journal
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddFoodForm;