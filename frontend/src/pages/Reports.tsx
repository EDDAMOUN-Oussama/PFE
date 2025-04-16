
import { HealthProvider } from '@/contexts/HealthContext';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  ResponsiveContainer, 
  BarChart as ReBarChart, 
  Bar, 
  LineChart as ReLineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from 'recharts';

const weightData = [
  { name: 'Week 1', weight: 83.5 },
  { name: 'Week 2', weight: 83.0 },
  { name: 'Week 3', weight: 82.2 },
  { name: 'Week 4', weight: 82.0 },
];

const calorieData = [
  { name: 'Mon', calories: 2100 },
  { name: 'Tue', calories: 1950 },
  { name: 'Wed', calories: 2200 },
  { name: 'Thu', calories: 1850 },
  { name: 'Fri', calories: 2050 },
  { name: 'Sat', calories: 2300 },
  { name: 'Sun', calories: 2150 },
];

const macroData = [
  { name: 'Protein', value: 30 },
  { name: 'Carbs', value: 45 },
  { name: 'Fat', value: 25 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const ReportsPageContent = () => {
  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <Button variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="mr-2 h-5 w-5 text-primary" />
                Weight Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={weightData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[80, 85]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary" />
                Calorie Intake
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={calorieData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-primary" />
                Macronutrient Ratio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Monthly Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="font-medium">Weight Change</p>
                  <p className="text-2xl font-bold text-green-500">-1.5 kg</p>
                  <p className="text-sm text-muted-foreground">Compared to last month (-0.8 kg)</p>
                </div>
                
                <div className="border-b pb-2">
                  <p className="font-medium">Average Daily Calories</p>
                  <p className="text-2xl font-bold">2,085 kcal</p>
                  <p className="text-sm text-muted-foreground">5% below your daily target</p>
                </div>
                
                <div>
                  <p className="font-medium">Exercise Consistency</p>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-sm text-muted-foreground">Workouts completed: 18/21</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ReportsPage = () => {
  return (
    <HealthProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <ReportsPageContent />
      </div>
    </HealthProvider>
  );
};

export default ReportsPage;
