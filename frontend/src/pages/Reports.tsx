import { apiFetch } from '@/lib/api';
import { useState, useEffect } from 'react';
import { HealthProvider, useHealth } from '@/contexts/HealthContext';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

    setLoading(true); setError(null);
    let active = true;
    Promise.all([
      apiFetch(`getWeightStats.php?user_id=${user.id}`).then(r => r.json()),
      apiFetch(`getCalorieStats.php?user_id=${user.id}`).then(r => r.json()),
      apiFetch(`getMacroStats.php?user_id=${user.id}`).then(r => r.json()),
      apiFetch(`getMonthlySummary.php?user_id=${user.id}`).then(r => r.json())
    ])
    .then(([w, c, m, summary]) => {
      if (!active) return;
      if (!w.success || !c.success || !m.success || !summary.success) throw new Error('Rapports indisponibles.');
      if (w.success) setWeightData(w.data);
      if (c.success) setCalorieData(c.data);
      if (m.success) setMacroData(m.data);
      if (summary.success) setMonthlySummary(summary.data);
    })
    .catch(e => { if (active) setError(e instanceof Error ? e.message : 'Rapports indisponibles.'); })
    .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user]);


  if (!user) {
    {console.log('User not found, redirecting to login');}
    return <div className="flex items-center justify-center h-screen">Veuillez vous connecter pour accéder aux rapports.</div>;
  }
  if (loading) return <p className="app-content p-6" role="status">Chargement des rapports...</p>;
  if (error) return <p className="app-content p-6" role="alert">{error}</p>;
  if (!weightData.length && !calorieData.length && !macroData.length) return <p className="app-content p-6">Ajoutez des mesures, des repas ou des exercices pour consulter vos rapports.</p>;
  async function exportPdf() {
    try {
      const response = await apiFetch(`exportUserReport.php?user_id=${user.id}`);
      if (!response.ok) throw new Error('Export impossible.');
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a'); link.href = url; link.download = 'healthytrack.pdf'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setError('Export impossible. Reessayez plus tard.'); }
  }
  return (
    <div className="app-content">
      <div className="container p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Rapports et Analyses</h1>
          <Button variant="outline" className="flex items-center"   onClick={exportPdf}>
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
              <XAxis
                dataKey="name"
                interval={Math.ceil((weightData.length - 1) / 4)}
                tick={{ fontSize: 12 }}
              />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
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
                <ReBarChart data={calorieData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} maxBarSize={60}>
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
              <Tooltip formatter={(value) => [`${value} g`, '']} />
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

        <ReportsPageContent />
      </div>
    </HealthProvider>
  );
};

export default ReportsPage;
