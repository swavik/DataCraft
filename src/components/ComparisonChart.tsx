import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

interface ComparisonChartProps {
  realData: Record<string, unknown>[];
  syntheticData: Record<string, unknown>[];
  column: string;
}

const ComparisonChart = ({ realData, syntheticData, column }: ComparisonChartProps) => {
  // Create histogram data
  const createHistogramData = (data: Record<string, unknown>[], col: string, bins: number = 20) => {
    const values = data.map(d => d[col] as number).filter(v => v !== undefined && v !== null && !isNaN(v));
    
    if (values.length === 0) return [];
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    
    const histogram: { [key: number]: number } = {};
    
    for (let i = 0; i < bins; i++) {
      histogram[i] = 0;
    }
    
    values.forEach(v => {
      const binIndex = Math.min(Math.floor((v - min) / binWidth), bins - 1);
      histogram[binIndex]++;
    });
    
    return Object.entries(histogram).map(([bin, count]) => ({
      bin: (parseInt(bin) * binWidth + min).toFixed(1),
      count,
    }));
  };

  const realHistogram = createHistogramData(realData, column);
  const syntheticHistogram = createHistogramData(syntheticData, column);

  // Merge histograms for comparison
  const mergedData = realHistogram.map((item, index) => ({
    bin: item.bin,
    Real: item.count,
    Synthetic: syntheticHistogram[index]?.count || 0,
  }));

  return (
    <div className="glass-card p-6">
      <h4 className="font-semibold mb-4 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-[#3b82f6]" />
        <span className="w-3 h-3 rounded-full bg-[#10b981]" />
        {column} Distribution
      </h4>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={mergedData}>
          <defs>
            <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSynthetic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
          <Legend />
          <Area 
            type="monotone" 
            dataKey="Real" 
            stroke="#3b82f6" 
            fill="url(#colorReal)"
            strokeWidth={3}
          />
          <Area 
            type="monotone" 
            dataKey="Synthetic" 
            stroke="#10b981" 
            fill="url(#colorSynthetic)"
            strokeWidth={3}
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
