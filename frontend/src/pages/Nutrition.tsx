
import { HealthProvider } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Apple, Coffee, UtensilsCrossed } from 'lucide-react';

const NutritionPageContent = () => {
  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-6">Nutrition Tracking</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Coffee className="mr-2 h-5 w-5 text-muted-foreground" />
                Breakfast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">450 kcal</p>
              <p className="text-sm text-muted-foreground">2 items tracked</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <UtensilsCrossed className="mr-2 h-5 w-5 text-muted-foreground" />
                Lunch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">620 kcal</p>
              <p className="text-sm text-muted-foreground">3 items tracked</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Apple className="mr-2 h-5 w-5 text-muted-foreground" />
                Dinner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">780 kcal</p>
              <p className="text-sm text-muted-foreground">4 items tracked</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Today's Food Log</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Track your meals to monitor your calorie and nutrient intake.</p>
            <div className="border rounded-md p-4 text-center">
              <p>Use the "Add Food" button to start tracking your meals for today.</p>
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
