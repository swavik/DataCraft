import { CheckCircle, AlertTriangle, TrendingUp, Activity, Target, Gauge, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { QualityReport } from "@/types/dataset";
import ScoreGauge from "./ScoreGauge";

interface QualityMetricsProps {
  report: QualityReport;
}

const QualityMetrics = ({ report }: QualityMetricsProps) => {
  const getQualityColor = () => {
    switch (report.qualityLevel) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-warning';
      default: return 'text-destructive';
    }
  };

  const getQualityLabel = () => {
    switch (report.qualityLevel) {
      case 'excellent': return 'Excellent Quality';
      case 'good': return 'Good Quality';
      default: return 'Needs Improvement';
    }
  };

  // Calculate an overall score from 0 to 100 based on accuracy difference
  const overallScore = Math.max(0, Math.min(100, 100 - (report.accuracyDiff * 200)));

  return (
    <div className="space-y-6">
      {/* Overall Quality Score Modular Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass-card p-6 flex flex-col items-center justify-center">
          <ScoreGauge 
            score={overallScore} 
            label="Utility Score"
            subLabel={getQualityLabel()}
          />
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground font-medium">Real Data Utility</span>
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{(report.realAccuracy * 100).toFixed(1)}%</span>
              <span className="text-xs text-muted-foreground">Accuracy</span>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Performance of model trained on real data
            </p>
          </div>

          <div className="glass-card p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground font-medium">Synthetic Utility</span>
              <Activity className="w-4 h-4 text-chart-2" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{(report.syntheticAccuracy * 100).toFixed(1)}%</span>
              <span className="text-xs text-muted-foreground">Accuracy</span>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Performance of model trained on synthetic data
            </p>
          </div>

          <div className="glass-card p-5 flex flex-col justify-between md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground font-medium">Fidelity Gap</span>
              <Gauge className="w-4 h-4 text-warning" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${getQualityColor()}`}>
                  {(report.accuracyDiff * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    report.accuracyDiff < 0.05 ? 'bg-success' : 
                    report.accuracyDiff < 0.1 ? 'bg-warning' : 'bg-destructive'
                  }`}
                  style={{ width: `${Math.min(100, report.accuracyDiff * 500)}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic">
              Lower gap indicates better preservation of statistical relationships and patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Statistical Comparison Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h4 className="font-semibold">Statistical Comparison</h4>
          <p className="text-sm text-muted-foreground">Column-level metrics comparison</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Column</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Real Mean</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Synth Mean</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Mean Diff</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Real Std</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Synth Std</th>
              </tr>
            </thead>
            <tbody>
              {report.comparisonMetrics.map((metric, idx) => (
                <tr key={idx} className="border-t border-border/50 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{metric.column}</td>
                  <td className="px-4 py-3 text-right font-mono text-[hsl(210,100%,56%)]">
                    {metric.realMean.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-primary">
                    {metric.syntheticMean.toFixed(2)}
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${
                    metric.meanDiff < 5 ? 'text-success' : 
                    metric.meanDiff < 15 ? 'text-warning' : 'text-destructive'
                  }`}>
                    {metric.meanDiff.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                    {metric.realStd.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                    {metric.syntheticStd.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QualityMetrics;
