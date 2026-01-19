import { CheckCircle, AlertTriangle, TrendingUp, Activity, Target, Gauge } from "lucide-react";
import { QualityReport } from "@/types/dataset";

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

  const getQualityIcon = () => {
    switch (report.qualityLevel) {
      case 'excellent': return <CheckCircle className="w-6 h-6 text-success" />;
      case 'good': return <TrendingUp className="w-6 h-6 text-warning" />;
      default: return <AlertTriangle className="w-6 h-6 text-destructive" />;
    }
  };

  const getQualityLabel = () => {
    switch (report.qualityLevel) {
      case 'excellent': return 'Excellent Quality';
      case 'good': return 'Good Quality';
      default: return 'Needs Improvement';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Quality Score */}
      <div className={`glass-card p-6 border ${
        report.qualityLevel === 'excellent' ? 'border-success/30' :
        report.qualityLevel === 'good' ? 'border-warning/30' : 'border-destructive/30'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              report.qualityLevel === 'excellent' ? 'bg-success/20' :
              report.qualityLevel === 'good' ? 'bg-warning/20' : 'bg-destructive/20'
            }`}>
              {getQualityIcon()}
            </div>
            <div>
              <h3 className="text-xl font-bold">{getQualityLabel()}</h3>
              <p className="text-sm text-muted-foreground">
                Synthetic data maintains {report.qualityLevel === 'excellent' ? 'excellent' : 'acceptable'} ML utility
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-4 h-4 text-[hsl(210,100%,56%)]" />
              <span className="text-xs text-muted-foreground">Real Model</span>
            </div>
            <p className="text-2xl font-bold font-mono">{(report.realAccuracy * 100).toFixed(1)}%</p>
          </div>
          
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Synthetic Model</span>
            </div>
            <p className="text-2xl font-bold font-mono">{(report.syntheticAccuracy * 100).toFixed(1)}%</p>
          </div>
          
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">Difference</span>
            </div>
            <p className={`text-2xl font-bold font-mono ${getQualityColor()}`}>
              {(report.accuracyDiff * 100).toFixed(2)}%
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
