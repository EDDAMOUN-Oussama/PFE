
import { HealthProvider } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Apple, Coffee, UtensilsCrossed, Plus } from 'lucide-react';

const NutritionPageContent = () => {
  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-6">Suivi Nutritionnel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Coffee className="mr-2 h-5 w-5 text-muted-foreground" />
                Petit-déjeuner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">450 kcal</p>
              <p className="text-sm text-muted-foreground">2 éléments suivis</p>
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
              <p className="text-2xl font-bold">620 kcal</p>
              <p className="text-sm text-muted-foreground">3 éléments suivis</p>
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
              <p className="text-2xl font-bold">780 kcal</p>
              <p className="text-sm text-muted-foreground">4 éléments suivis</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Journal Alimentaire d'Aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Suivez vos repas pour surveiller votre apport calorique et nutritionnel.</p>
            <div className="border rounded-md p-6 text-center">
              <p className="mb-4">Utilisez le bouton "Ajouter Aliment" pour commencer à suivre vos repas d'aujourd'hui.</p>
              <Button className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Aliment
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
