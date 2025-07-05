
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHealth } from '@/contexts/HealthContext';
import { useToast } from '@/hooks/use-toast';

function calculateCalories(protein: number = 0, carbs: number = 0, fats: number = 0): number {
  const caloriesFromProtein = protein * 4;
  const caloriesFromCarbs = carbs * 4;
  const caloriesFromFats = fats * 9;
  return caloriesFromProtein + caloriesFromCarbs + caloriesFromFats;
}

const AddFoodForm = () => {
  const [foodName, setFoodName] = useState('');
  const [maleType, setmaleType] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const { addFoodEntry } = useHealth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodName || !maleType || !calories) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const newFoodEntry = {
      name: foodName,
      maleType,
      calories: parseInt(calories),
      protein: protein ? parseInt(protein) : 0,
      carbs: carbs ? parseInt(carbs) : 0,
      fats: fats ? parseInt(fats) : 0,
      date: new Date().toISOString(),
    };

    addFoodEntry(newFoodEntry);
    
    // Reset form
    setFoodName('');
    setmaleType('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');

  };

  useEffect(() => {
    const p = Number(protein) || 0;
    const c = Number(carbs) || 0;
    const f = Number(fats) || 0;
    const total = calculateCalories(p, c, f);
    setCalories(total.toString());
  }, [protein, carbs, fats]);

  
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
              <Label htmlFor="maleType">Type de repas *</Label>
              <Select value={maleType} onValueChange={setmaleType} required>
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
              <Label htmlFor="fats">Lipides (g)</Label>
              <Input
                id="fats"
                type="number"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
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