import { useState, useEffect } from 'react';
import { HealthProvider, useHealth } from '@/contexts/HealthContext';
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




const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const ReportsPageContent = () => {
  const { user } = useHealth();
  const [weightData, setWeightData] = useState([]);
  const [calorieData, setCalorieData] = useState([]);
  const [macroData, setMacroData] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState<{
    deltaWeight: number;
    avgCalories: number;
    percentRegular: number;
    daysEx: number;
    daysInMonth: number;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      fetch(`http://localhost/pfe/backend/controllers/getWeightStats.php?user_id=${user.id}`).then(r => r.json()),
      fetch(`http://localhost/pfe/backend/controllers/getCalorieStats.php?user_id=${user.id}`).then(r => r.json()),
      fetch(`http://localhost/pfe/backend/controllers/getMacroStats.php?user_id=${user.id}`).then(r => r.json()),
      fetch(`http://localhost/pfe/backend/controllers/getMonthlySummary.php?user_id=${user.id}`).then(r => r.json())
    ])
    .then(([w, c, m, summary]) => {
      if (w.success) setWeightData(w.data);
      if (c.success) setCalorieData(c.data);
      if (m.success) setMacroData(m.data);
      if (summary.success) setMonthlySummary(summary.data);
    })
    .catch(console.error);
  }, [user]);


  if (!user) {
    return <div className="flex items-center justify-center h-screen">Veuillez vous connecter pour accéder aux rapports.</div>;
  }
  if (weightData.length === 0 || calorieData.length === 0 || macroData.length === 0) {
    return <div className="flex items-center justify-center h-screen">Chargement des données...</div>;
  }
  if (weightData.length === 0 && calorieData.length === 0 && macroData.length === 0) {
    return <div className="flex items-center justify-center h-screen">Aucune donnée disponible pour l'instant.</div>;
  }


  return (
    <div className="flex-1 ml-64">
      <div className="container p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Rapports et Analyses</h1>
          <Button variant="outline" className="flex items-center"   onClick={() => {const userId = localStorage.getItem('user_id'); if (userId) {window.open(`http://localhost/pfe/backend/controllers/exportUserReport.php?user_id=${userId}`, '_blank');}}}>
            <Download className="mr-2 h-4 w-4" />
            Exporter les Données
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="mr-2 h-5 w-5 text-primary" />
                Évolution du Poids
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={weightData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[80, 85]} />
                    <Tooltip formatter={(value) => [`${value} kg`, 'Poids']} />
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
                Apport Calorique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={calorieData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} kcal`, 'Calories']} />
                    <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
            <PieChart className="mr-2 h-5 w-5 text-primary" />
            Répartition des Macronutriments
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
              <Tooltip formatter={(value) => [`${value}%`, '']} />
              </RePieChart>
            </ResponsiveContainer>
            </div>
          </CardContent>
          </Card>
          
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Résumé Mensuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monthlySummary ? (
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="font-medium">Évolution du Poids</p>
                  <p className={`text-2xl font-bold ${monthlySummary.deltaWeight < 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {monthlySummary.deltaWeight > 0 ? '+' : ''}{monthlySummary.deltaWeight.toFixed(1)} kg
                  </p>
                  <p className="text-sm text-muted-foreground">Comparé au début du mois</p>
                </div>
            
                <div className="border-b pb-2">
                  <p className="font-medium">Calories Moyennes Journ.</p>
                  <p className="text-2xl font-bold">{monthlySummary.avgCalories} kcal</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.goalCalories
                      ? `${Math.round((monthlySummary.avgCalories / user.goalCalories) * 100)}% de l'objectif`
                      : 'Pas d\'objectif défini'}
                  </p>
                </div>
                    
                <div>
                  <p className="font-medium">Régularité des Exercices</p>
                  <p className="text-2xl font-bold">{monthlySummary.percentRegular}%</p>
                  <p className="text-sm text-muted-foreground">
                    Entraînements complétés : {monthlySummary.daysEx}/{monthlySummary.daysInMonth}
                  </p>
                </div>
              </div>
            ) : (
              <p>Chargement…</p>
            )}
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
