import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { DatasetHistory } from "@/types/dataset";

interface EvaluationChartProps {
  history: DatasetHistory[];
}

export default function EvaluationChart({ history }: EvaluationChartProps) {
  // Prepare chart data from datasets with quality reports
  const chartData = history
    .filter(d => d.qualityReport)
    .slice(0, 10) // Show last 10 datasets
    .reverse()
    .map((dataset, index) => ({
      name: dataset.fileName.length > 15 
        ? `${dataset.fileName.slice(0, 12)}...` 
        : dataset.fileName,
      real: (dataset.qualityReport?.realAccuracy || 0) * 100,
      synthetic: (dataset.qualityReport?.syntheticAccuracy || 0) * 100,
    }));

  // If no data, show sample data
  const displayData = chartData.length > 0 ? chartData : [
    { name: "Dataset 1", real: 92.5, synthetic: 89.3 },
    { name: "Dataset 2", real: 88.7, synthetic: 85.2 },
    { name: "Dataset 3", real: 94.2, synthetic: 91.8 },
    { name: "Dataset 4", real: 90.1, synthetic: 87.5 },
    { name: "Dataset 5", real: 93.8, synthetic: 90.2 },
  ];

  const chartConfig = {
    real: {
      label: "Real Data",
      color: "hsl(var(--chart-real))",
    },
    synthetic: {
      label: "Synthetic Data",
      color: "hsl(var(--chart-synthetic))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluation Metrics</CardTitle>
        <CardDescription>
          Comparison of accuracy between real and synthetic data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart data={displayData} barGap={4}>
            <defs>
              <linearGradient id="realGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-real))" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--chart-real))" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="syntheticGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-synthetic))" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--chart-synthetic))" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              strokeOpacity={0.3}
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              label={{ 
                value: 'Accuracy (%)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 }
              }}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
              formatter={(value) => <span className="text-sm font-medium">{value}</span>}
            />
            <Bar 
              dataKey="real" 
              fill="url(#realGradient)"
              radius={[8, 8, 0, 0]}
              name="Real Data"
              maxBarSize={60}
            />
            <Bar 
              dataKey="synthetic" 
              fill="url(#syntheticGradient)"
              radius={[8, 8, 0, 0]}
              name="Synthetic Data"
              maxBarSize={60}
            />
          </BarChart>
        </ChartContainer>
        
        {chartData.length === 0 && (
          <p className="text-xs text-center text-muted-foreground mt-4">
            Sample data shown. Generate synthetic data to see actual metrics.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
