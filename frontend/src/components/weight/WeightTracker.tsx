
import { useHealth } from '@/contexts/HealthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Scale, ArrowDown, ArrowUp } from 'lucide-react';

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number | string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover text-popover-foreground p-2 rounded-md shadow-md border border-border">
        <p className="font-medium">{format(new Date(label), 'd MMM yyyy')}</p>
        <p className="text-primary">{`Poids: ${payload[0].value} kg`}</p>
      </div>
    );
  }
  return null;
};

const WeightTracker = () => {
  const { weightEntries, user, isLoading } = useHealth();
  if (isLoading || !user) {
    return <div>Chargement des données...</div>;
  }

  // Sort entries by date
  const sortedEntries = [...weightEntries].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );


  // Get first and last entry to calculate overall change
  const firstEntry = sortedEntries[0]?.weight;
  const lastEntry = sortedEntries[sortedEntries.length - 1]?.weight;
  const weightChange = lastEntry && firstEntry ? (lastEntry - firstEntry).toFixed(1) : '0';
  const isWeightLoss = Number(weightChange) < 0;


  // Calculate min and max for y-axis
  const weights = sortedEntries.map(entry => entry.weight);
  const minWeight = Math.floor(Math.min(...weights, user.goalWeight || Infinity)) - 1;
  const maxWeight = Math.ceil(Math.max(...weights)) + 1;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Historique du Poids</CardTitle>
        <div className="flex items-center p-2 bg-primary/10 rounded-md">
          <Scale className="h-5 w-5 text-primary mr-2" />
          <span className="font-semibold">{user.currentWeight} kg</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Évolution Globale</p>
            <div className="flex items-center">
              {isWeightLoss ? (
                <>
                  <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">{Math.abs(Number(weightChange))} kg</span>
                </>
              ) : (
                <>
                  <ArrowUp className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-500 font-medium">{weightChange} kg</span>
                </>
              )}
            </div>
          </div>

          {user.goalWeight && (
            <div>
              <p className="text-sm text-muted-foreground">Poids Objectif</p>
              <div className="flex items-center">
                <span className="font-medium">{user.goalWeight} kg</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({Math.abs(user.currentWeight - user.goalWeight).toFixed(1)} kg restants)
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sortedEntries}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), 'd MMM')}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={[minWeight, maxWeight]}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ stroke: 'hsl(var(--background))', strokeWidth: 2, r: 6 }}
              />
              {user.goalWeight && (
                <Line
                  type="monotone"
                  dataKey={() => user.goalWeight}
                  stroke="hsl(var(--accent-foreground))"
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {weightEntries.length === 0 && (
          <p className="text-center text-muted-foreground mt-4">Aucune donnée de poids disponible pour le moment.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightTracker;

