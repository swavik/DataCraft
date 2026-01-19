import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

interface ComparisonChartProps {
  realData: any[];
  syntheticData: any[];
  column: string;
}

const ComparisonChart = ({ realData, syntheticData, column }: ComparisonChartProps) => {
  // Create histogram data
  const createHistogramData = (data: any[], col: string, bins: number = 20) => {
    const values = data.map(d => d[col]).filter(v => v !== undefined && v !== null && !isNaN(v));
    
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
        <span className="w-3 h-3 rounded-full bg-[hsl(210,100%,56%)]" />
        <span className="w-3 h-3 rounded-full bg-[hsl(168,76%,52%)]" />
        {column} Distribution
      </h4>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={mergedData}>
          <defs>
            <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSynthetic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(168, 76%, 52%)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(168, 76%, 52%)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
          <XAxis 
            dataKey="bin" 
            stroke="hsl(215, 20%, 55%)"
            fontSize={10}
            tickLine={false}
          />
          <YAxis 
            stroke="hsl(215, 20%, 55%)"
            fontSize={10}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(222, 47%, 10%)',
              border: '1px solid hsl(217, 33%, 17%)',
              borderRadius: '8px',
              color: 'hsl(210, 40%, 98%)',
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="Real" 
            stroke="hsl(210, 100%, 56%)" 
            fill="url(#colorReal)"
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="Synthetic" 
            stroke="hsl(168, 76%, 52%)" 
            fill="url(#colorSynthetic)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
