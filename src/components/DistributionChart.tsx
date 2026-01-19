import { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface DistributionChartProps {
  realData: any[];
  syntheticData: any[];
  column: string;
  type: 'numerical' | 'categorical';
}

const DistributionChart = ({ realData, syntheticData, column, type }: DistributionChartProps) => {
  const chartData = useMemo(() => {
    if (type === 'numerical') {
      return createKDEData(realData, syntheticData, column);
    } else {
      return createCategoricalData(realData, syntheticData, column);
    }
  }, [realData, syntheticData, column, type]);

  if (type === 'numerical') {
    return (
      <div className="glass-card p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]" />
          <span className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]" />
          {column}
          <span className="text-xs text-muted-foreground ml-2">(KDE)</span>
        </h4>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`colorReal-${column}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id={`colorSynthetic-${column}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              dataKey="value" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              tickFormatter={(v) => typeof v === 'number' ? v.toFixed(1) : v}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              label={{ value: 'Density', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value: number) => value.toFixed(4)}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="Real" 
              stroke="hsl(var(--chart-1))" 
              fill={`url(#colorReal-${column})`}
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="Synthetic" 
              stroke="hsl(var(--chart-2))" 
              fill={`url(#colorSynthetic-${column})`}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Categorical bar chart
  return (
    <div className="glass-card p-6">
      <h4 className="font-semibold mb-4 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]" />
        <span className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]" />
        {column}
        <span className="text-xs text-muted-foreground ml-2">(Categorical)</span>
      </h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis 
            dataKey="category" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            tickLine={false}
            label={{ value: 'Count', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
            }}
          />
          <Legend />
          <Bar 
            dataKey="Real" 
            fill="hsl(var(--chart-1))" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="Synthetic" 
            fill="hsl(var(--chart-2))" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Create KDE-like smooth distribution data
function createKDEData(realData: any[], syntheticData: any[], column: string) {
  const realValues = realData.map(d => d[column]).filter(v => v !== undefined && v !== null && !isNaN(v));
  const synthValues = syntheticData.map(d => d[column]).filter(v => v !== undefined && v !== null && !isNaN(v));
  
  if (realValues.length === 0) return [];
  
  const allValues = [...realValues, ...synthValues];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min;
  
  // Use Scott's rule for bandwidth estimation
  const realStd = std(realValues);
  const bandwidth = 1.06 * realStd * Math.pow(realValues.length, -0.2);
  
  const points = 50;
  const step = range / points;
  const data = [];
  
  for (let i = 0; i <= points; i++) {
    const x = min + i * step;
    data.push({
      value: x,
      Real: gaussianKDE(realValues, x, bandwidth),
      Synthetic: gaussianKDE(synthValues, x, bandwidth)
    });
  }
  
  return data;
}

// Gaussian Kernel Density Estimation
function gaussianKDE(values: number[], x: number, bandwidth: number): number {
  if (values.length === 0 || bandwidth === 0) return 0;
  
  const sum = values.reduce((acc, xi) => {
    const u = (x - xi) / bandwidth;
    return acc + Math.exp(-0.5 * u * u);
  }, 0);
  
  return sum / (values.length * bandwidth * Math.sqrt(2 * Math.PI));
}

function std(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

// Create categorical comparison data
function createCategoricalData(realData: any[], syntheticData: any[], column: string) {
  const realValues = realData.map(d => d[column]).filter(v => v !== undefined && v !== null);
  const synthValues = syntheticData.map(d => d[column]).filter(v => v !== undefined && v !== null);
  
  // Count occurrences
  const realCounts: Record<string, number> = {};
  const synthCounts: Record<string, number> = {};
  
  realValues.forEach(v => {
    const key = String(v);
    realCounts[key] = (realCounts[key] || 0) + 1;
  });
  
  synthValues.forEach(v => {
    const key = String(v);
    synthCounts[key] = (synthCounts[key] || 0) + 1;
  });
  
  // Get all unique categories
  const allCategories = [...new Set([...Object.keys(realCounts), ...Object.keys(synthCounts)])].sort();
  
  // Limit to top 10 categories for readability
  const topCategories = allCategories
    .map(cat => ({ cat, total: (realCounts[cat] || 0) + (synthCounts[cat] || 0) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map(x => x.cat);
  
  return topCategories.map(cat => ({
    category: cat.length > 15 ? cat.slice(0, 12) + '...' : cat,
    Real: realCounts[cat] || 0,
    Synthetic: synthCounts[cat] || 0
  }));
}

export default DistributionChart;
