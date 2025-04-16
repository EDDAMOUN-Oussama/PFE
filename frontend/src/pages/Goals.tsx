
import { HealthProvider } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target, Scale, Activity, Utensils, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const GoalsPageContent = () => {
  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-6">Goals</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Scale className="mr-2 h-5 w-5 text-primary" />
                  Weight Goal
                </CardTitle>
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <CardDescription>Target: 75 kg by December 31, 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current: 82 kg</span>
                  <span className="text-sm font-medium">Target: 75 kg</span>
                </div>
                <Progress value={40} className="h-2" />
                <p className="text-sm text-muted-foreground">7 kg to go • 40% complete</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-primary" />
                  Exercise Goal
                </CardTitle>
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <CardDescription>Target: 150 minutes per week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current: 95 min</span>
                  <span className="text-sm font-medium">Target: 150 min</span>
                </div>
                <Progress value={63} className="h-2" />
                <p className="text-sm text-muted-foreground">55 min to go • 63% complete</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Utensils className="mr-2 h-5 w-5 text-primary" />
                  Calorie Goal
                </CardTitle>
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <CardDescription>Target: 2,200 calories per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average: 1,850 cal</span>
                  <span className="text-sm font-medium">Target: 2,200 cal</span>
                </div>
                <Progress value={84} className="h-2" />
                <p className="text-sm text-muted-foreground">350 cal under target • 84% of goal</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Target className="mr-2 h-5 w-5 text-primary" />
                Create New Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Setting clear, measurable goals helps you stay motivated on your health journey.
              </p>
              <div className="border rounded-md p-4 text-center">
                <p>Click here to create a new health or fitness goal</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const GoalsPage = () => {
  return (
    <HealthProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <GoalsPageContent />
      </div>
    </HealthProvider>
  );
};

export default GoalsPage;
