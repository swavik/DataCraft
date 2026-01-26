import { CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { QualityReport } from "@/types/dataset";

interface QualityMetricsProps {
  report: QualityReport;
}

const QualityMetrics = ({ report }: QualityMetricsProps) => {
  const getQualityColor = () => {
    switch (report.qualityLevel) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  const getQualityIcon = () => {
    switch (report.qualityLevel) {
      case 'excellent': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'good': return <TrendingUp className="w-5 h-5 text-yellow-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-red-600" />;
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
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
          {getQualityIcon()}
          <div>
            <h3 className="text-xl font-semibold">{getQualityLabel()}</h3>
            <p className="text-sm text-muted-foreground">
              Synthetic data maintains {report.qualityLevel === 'excellent' ? 'excellent' : 'acceptable'} ML utility
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{(report.realAccuracy * 100).toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Real Model Accuracy</div>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{(report.syntheticAccuracy * 100).toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Synthetic Model Accuracy</div>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className={`text-2xl font-bold ${getQualityColor()}`}>{(report.accuracyDiff * 100).toFixed(2)}%</div>
            <div className="text-sm text-muted-foreground">Accuracy Difference</div>
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
                <tr key={idx} className="border-t border-border/50">
                  <td className="px-4 py-3 font-medium">{metric.column}</td>
                  <td className="px-4 py-3 text-right font-mono">{metric.realMean.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono">{metric.syntheticMean.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono">{metric.meanDiff.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono">{metric.realStd.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono">{metric.syntheticStd.toFixed(2)}</td>
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
