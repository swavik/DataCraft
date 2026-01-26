import { useMemo, useState } from 'react';
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
import { Button } from "@/components/ui/button";
import { BarChart3, LineChart } from "lucide-react";

interface DistributionChartProps {
  realData: any[];
  syntheticData: any[];
  column: string;
  type: 'numerical' | 'categorical';
}

const DistributionChart = ({ realData, syntheticData, column, type }: DistributionChartProps) => {
  const [view, setView] = useState<'smooth' | 'discrete'>(type === 'numerical' ? 'smooth' : 'discrete');

  const chartData = useMemo(() => {
    if (type === 'numerical') {
      return view === 'smooth' 
        ? createKDEData(realData, syntheticData, column)
        : createHistogramData(realData, syntheticData, column);
    } else {
      return createCategoricalData(realData, syntheticData, column);
    }
  }, [realData, syntheticData, column, type, view]);

  const renderNumericalChart = () => {
    if (view === 'smooth') {
      return (
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`colorReal-${column}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-real))" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="hsl(var(--chart-real))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id={`colorSynthetic-${column}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-synthetic))" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="hsl(var(--chart-synthetic))" stopOpacity={0}/>
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
            label={{ value: 'Density', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'hsl(var(--muted-foreground))', offset: 10 }}
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
          <Legend verticalAlign="top" height={36}/>
          <Area 
            type="monotone" 
            dataKey="Real" 
            stroke="hsl(var(--chart-real))" 
            fill={`url(#colorReal-${column})`}
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="Synthetic" 
            stroke="hsl(var(--chart-synthetic))" 
            fill={`url(#colorSynthetic-${column})`}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </AreaChart>
      );
    }

    return (
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis 
          dataKey="bin" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--foreground))',
          }}
        />
        <Legend verticalAlign="top" height={36}/>
        <Bar dataKey="Real" fill="hsl(var(--chart-real))" radius={[2, 2, 0, 0]} />
        <Bar dataKey="Synthetic" fill="hsl(var(--chart-synthetic))" radius={[2, 2, 0, 0]} />
      </BarChart>
    );
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[hsl(var(--chart-real))]" />
          <span className="w-2 h-2 rounded-full bg-[hsl(var(--chart-synthetic))]" />
          {column}
          <span className="text-xs font-normal text-muted-foreground ml-1">
            ({type === 'numerical' ? (view === 'smooth' ? 'KDE' : 'Histogram') : 'Categorical'})
          </span>
        </h4>
        
        {type === 'numerical' && (
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={view === 'smooth' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7 rounded-md"
              onClick={() => setView('smooth')}
              title="Smooth View (KDE)"
            >
              <LineChart className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'discrete' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7 rounded-md"
              onClick={() => setView('discrete')}
              title="Discrete View (Histogram)"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'numerical' ? renderNumericalChart() : (
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
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar 
                dataKey="Real" 
                fill="hsl(var(--chart-real))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="Synthetic" 
                fill="hsl(var(--chart-synthetic))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Create histogram data for numerical columns
function createHistogramData(realData: any[], syntheticData: any[], column: string, bins: number = 10) {
  const realValues = realData.map(d => d[column]).filter(v => typeof v === 'number' && !isNaN(v));
  const synthValues = syntheticData.map(d => d[column]).filter(v => typeof v === 'number' && !isNaN(v));
  
  if (realValues.length === 0) return [];
  
  const allValues = [...realValues, ...synthValues];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min;
  const binWidth = range / bins;
  
  const data = [];
  for (let i = 0; i < bins; i++) {
    const binMin = min + i * binWidth;
    const binMax = binMin + binWidth;
    
    const realCount = realValues.filter(v => v >= binMin && v < (i === bins - 1 ? binMax + 1 : binMax)).length;
    const synthCount = syntheticData.filter(v => v[column] >= binMin && v[column] < (i === bins - 1 ? binMax + 1 : binMax)).length;
    
    data.push({
      bin: `${binMin.toFixed(1)}-${binMax.toFixed(1)}`,
      Real: realCount,
      Synthetic: synthCount
    });
  }
  
  return data;
}

// Create KDE-like smooth distribution data
function createKDEData(realData: any[], syntheticData: any[], column: string) {
  const realValues = realData.map(d => d[column]).filter(v => v !== undefined && v !== null && !isNaN(v));
  const synthValues = syntheticData.map(d => d[column]).filter(v => v !== undefined && v !== null && !isNaN(v));
  
  if (realValues.length === 0) return [];
  
  const allValues = [...realValues, ...synthValues];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = Math.max(0.0001, max - min);
  
  // Use Scott's rule for bandwidth estimation with a minimum floor
  const realStd = std(realValues);
  const bandwidth = Math.max(0.01, 1.06 * realStd * Math.pow(realValues.length, -0.2));
  
  const points = 60; // Increased points for smoother curves
  const step = range / points;
  const data = [];
  
  // Add padding to range for better visualization
  const padding = range * 0.1;
  const startX = min - padding;
  const endX = max + padding;
  const paddedStep = (endX - startX) / points;

  for (let i = 0; i <= points; i++) {
    const x = startX + i * paddedStep;
    data.push({
      value: x,
      Real: Math.max(0, gaussianKDE(realValues, x, bandwidth)),
      Synthetic: Math.max(0, gaussianKDE(synthValues, x, bandwidth))
    });
  }
  
  return data;
}

// Gaussian Kernel Density Estimation
function gaussianKDE(values: number[], x: number, bandwidth: number): number {
  if (values.length === 0) return 0;
  
  const sum = values.reduce((acc, xi) => {
    const u = (x - xi) / bandwidth;
    // Cap u to avoid extremely small values that might cause issues
    if (Math.abs(u) > 10) return acc;
    return acc + Math.exp(-0.5 * u * u);
  }, 0);
  
  return sum / (values.length * bandwidth * Math.sqrt(2 * Math.PI));
}

function std(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (values.length - 1);
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
