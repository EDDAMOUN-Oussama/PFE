import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHealth, HealthProvider } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Apple, Coffee, UtensilsCrossed, Plus } from 'lucide-react';
import AddFoodForm from '@/components/nutrition/AddFoodForm';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const NutritionPageContent = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const location = useLocation();

const { foodEntries } = useHealth();

const calculateMealData = (mealType: string) => {
  const meals = foodEntries.filter(entry => entry.maleType === mealType);
  const totalCalories = meals.reduce((sum, item) => sum + item.calories, 0);
  return {
    calories: totalCalories,
    count: meals.length
  };
};

const breakfast = calculateMealData('breakfast');
const lunch = calculateMealData('lunch');
const dinner = calculateMealData('dinner');


  useEffect(() => {
    // Check if we should open the form based on navigation state
    if (location.state?.openForm) {
      setShowAddForm(true);
    }
  }, [location.state]);

  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-6">Suivi Nutritionnel
          <span className="text-muted-foreground text-lg ml-2">
            {format(new Date(), "dd MMMM yyyy", { locale: fr })}
          </span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Coffee className="mr-2 h-5 w-5 text-muted-foreground" />
                Petit-déjeuner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{breakfast.calories} kcal</p>
              <p className="text-sm text-muted-foreground">{breakfast.count} éléments suivis</p>

            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <UtensilsCrossed className="mr-2 h-5 w-5 text-muted-foreground" />
                Déjeuner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{lunch.calories} kcal</p>
              <p className="text-sm text-muted-foreground">{lunch.count} éléments suivis</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Apple className="mr-2 h-5 w-5 text-muted-foreground" />
                Dîner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{dinner.calories} kcal</p>
              <p className="text-sm text-muted-foreground">{dinner.count} éléments suivis</p>

            </CardContent>
          </Card>
        </div>
        
        {/* Conditionally show Add Food Form */}
        {showAddForm && <AddFoodForm />}
        
        {/* Food Journal */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Journal Alimentaire d'Aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Suivez vos repas pour surveiller votre apport calorique et nutritionnel.</p>
            <div className="border rounded-md p-6 text-center">
              <p className="mb-4">Utilisez le bouton "Ajouter Aliment" pour commencer à suivre vos repas d'aujourd'hui.</p>
              <Button 
                className="mt-2"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {showAddForm ? 'Masquer le formulaire' : 'Ajouter Aliment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const NutritionPage = () => {
  return (
    <HealthProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <NutritionPageContent />
      </div>
    </HealthProvider>
  );
};

export default NutritionPage;
