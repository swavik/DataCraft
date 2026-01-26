import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatasetHistory } from "@/types/dataset";
import { Database, Sparkles, FileCheck, TrendingUp } from "lucide-react";

interface DatasetUsageStatsProps {
  history: DatasetHistory[];
}

export default function DatasetUsageStats({ history }: DatasetUsageStatsProps) {
  const totalDatasets = history.length;
  const syntheticGenerated = history.filter(d => d.hasSynthetic).length;
  const totalRows = history.reduce((acc, d) => acc + d.rowCount, 0);
  const datasetsWithReport = history.filter(d => d.qualityReport);
  const avgQuality = datasetsWithReport.reduce((acc, d) => {
    return acc + (d.qualityReport?.syntheticAccuracy || 0);
  }, 0) / (datasetsWithReport.length || 1);

  const stats = [
    {
      title: "Total Datasets",
      value: totalDatasets,
      icon: Database,
      color: "text-blue-500 bg-blue-500/10",
      description: "Uploaded datasets",
    },
    {
      title: "Synthetic Generated",
      value: syntheticGenerated,
      icon: Sparkles,
      color: "text-primary bg-primary/10",
      description: "With synthetic data",
    },
    {
      title: "Total Rows",
      value: totalRows.toLocaleString(),
      icon: FileCheck,
      color: "text-green-500 bg-green-500/10",
      description: "Across all datasets",
    },
    {
      title: "Avg Quality",
      value: `${(avgQuality * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-purple-500 bg-purple-500/10",
      description: "Accuracy score",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
