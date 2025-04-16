
import { useHealth } from '@/contexts/HealthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover text-popover-foreground p-2 rounded-md shadow-md border border-border">
        <p className="font-medium">{format(new Date(label), 'MMM d')}</p>
        <p className="text-primary">{`Weight: ${payload[0].value} kg`}</p>
      </div>
    );
  }
  return null;
};

const WeightChart = () => {
  const { weightEntries, user } = useHealth();
  
  // Get last 14 days of data
  const recentEntries = weightEntries
    .slice(-14)
    .map(entry => ({
      date: entry.date,
      weight: entry.weight
    }));

  // Calculate min and max for y-axis
  const weights = recentEntries.map(entry => entry.weight);
  const minWeight = Math.floor(Math.min(...weights)) - 1;
  const maxWeight = Math.ceil(Math.max(...weights)) + 1;
  
  // Check if there's a goal weight
  const showGoal = user.goalWeight && user.goalWeight > 0;

  return (
    <div className="health-card">
      <div className="health-card-header">
        <h3 className="health-card-title">Weight Trend</h3>
        <span className="text-sm text-muted-foreground">Last 14 days</span>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={recentEntries}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), 'dd')}
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
            {showGoal && (
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
      
      {showGoal && (
        <div className="mt-2 text-sm flex items-center justify-end">
          <div className="w-3 h-1 bg-accent-foreground mr-1"></div>
          <span className="text-muted-foreground">Goal Weight: {user.goalWeight} kg</span>
        </div>
      )}
    </div>
  );
};

export default WeightChart;
