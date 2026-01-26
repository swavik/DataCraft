import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Activity, 
  Gauge,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DistributionChart from '@/components/DistributionChart';
import { DatasetHistory } from '@/types/dataset';

interface ResultsPageProps {
  dataset: DatasetHistory | null;
}

const ResultsPage = ({ dataset }: ResultsPageProps) => {
  const navigate = useNavigate();

  if (!dataset || !dataset.qualityReport || !dataset.realData || !dataset.syntheticData) {
    return (
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No results available</h2>
          <p className="text-muted-foreground mb-4">Generate synthetic data first</p>
          <Button asChild>
            <a href="/preview">Go to Preview</a>
          </Button>
        </div>
      </div>
    );
  }

  const report = dataset.qualityReport;

  const getQualityColor = () => {
    switch (report.qualityLevel) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-warning';
      default: return 'text-destructive';
    }
  };

  const getQualityIcon = () => {
    switch (report.qualityLevel) {
      case 'excellent': return <CheckCircle className="w-8 h-8 text-success" />;
      case 'good': return <TrendingUp className="w-8 h-8 text-warning" />;
      default: return <AlertTriangle className="w-8 h-8 text-destructive" />;
    }
  };

  const getQualityLabel = () => {
    switch (report.qualityLevel) {
      case 'excellent': return 'Excellent Quality';
      case 'good': return 'Good Quality';
      default: return 'Needs Improvement';
    }
  };

  const downloadReport = () => {
    const reportText = `SYNTHETIC DATA GENERATION - QUALITY REPORT
${'='.repeat(70)}

DATASET: ${dataset.fileName}
Generated: ${new Date().toLocaleDateString()}

ML UTILITY TEST RESULTS:
Real Data Model Accuracy:      ${(report.realAccuracy * 100).toFixed(2)}%
Synthetic Data Model Accuracy: ${(report.syntheticAccuracy * 100).toFixed(2)}%
Accuracy Difference:           ${(report.accuracyDiff * 100).toFixed(2)}%

Quality Assessment: ${report.qualityLevel.toUpperCase()}

${'='.repeat(70)}
STATISTICAL COMPARISON:

${report.comparisonMetrics.map(m => 
  `${m.column}:
  Real Mean: ${m.realMean.toFixed(4)}, Synthetic Mean: ${m.syntheticMean.toFixed(4)}
  Real Std: ${m.realStd.toFixed(4)}, Synthetic Std: ${m.syntheticStd.toFixed(4)}
  Mean Difference: ${m.meanDiff.toFixed(4)}`
).join('\n\n')}
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quality_report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/synthetic')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Quality Analysis Results</h1>
              <p className="text-muted-foreground">
                Comparing real and synthetic data distributions
              </p>
            </div>
          </div>
          <Button onClick={downloadReport} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>

        {/* Quality Score Card */}
        <div className={`glass-card p-6 mb-8 animate-slide-up border-2 ${
          report.qualityLevel === 'excellent' ? 'border-success/30' :
          report.qualityLevel === 'good' ? 'border-warning/30' : 'border-destructive/30'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                report.qualityLevel === 'excellent' ? 'bg-success/20' :
                report.qualityLevel === 'good' ? 'bg-warning/20' : 'bg-destructive/20'
              }`}>
                {getQualityIcon()}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{getQualityLabel()}</h3>
                <p className="text-muted-foreground">
                  Synthetic data maintains {report.qualityLevel === 'excellent' ? 'excellent' : 'acceptable'} ML utility
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-muted/30 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-[hsl(210,100%,56%)]" />
                <span className="text-sm text-muted-foreground">Real Model Accuracy</span>
              </div>
              <p className="text-3xl font-bold font-mono">{(report.realAccuracy * 100).toFixed(1)}%</p>
            </div>

            <div className="p-5 bg-muted/30 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Synthetic Model Accuracy</span>
              </div>
              <p className="text-3xl font-bold font-mono">{(report.syntheticAccuracy * 100).toFixed(1)}%</p>
            </div>

            <div className="p-5 bg-muted/30 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gauge className="w-5 h-5 text-warning" />
                <span className="text-sm text-muted-foreground">Accuracy Difference</span>
              </div>
              <p className={`text-3xl font-bold font-mono ${getQualityColor()}`}>
                {(report.accuracyDiff * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Statistical Comparison Table */}
        <div className="glass-card overflow-hidden mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Statistical Comparison</h3>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Distribution Charts */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl font-semibold mb-4">Distribution Comparison</h3>
          <p className="text-muted-foreground mb-6">
            Visual comparison of real vs synthetic data distributions using KDE and bar charts
          </p>
          
          <Tabs defaultValue="numerical" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="numerical">
                📊 Numerical Features ({dataset.stats?.numericalColumns.length || 0})
              </TabsTrigger>
              <TabsTrigger value="categorical">
                📋 Categorical Features ({dataset.stats?.categoricalColumns.length || 0})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="numerical">
              {dataset.stats?.numericalColumns.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <p className="text-muted-foreground">No numerical columns in this dataset</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dataset.stats?.numericalColumns.slice(0, 8).map(column => (
                    <DistributionChart
                      key={column}
                      realData={dataset.realData!}
                      syntheticData={dataset.syntheticData!}
                      column={column}
                      type="numerical"
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="categorical">
              {dataset.stats?.categoricalColumns.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <p className="text-muted-foreground">No categorical columns in this dataset</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dataset.stats?.categoricalColumns.slice(0, 8).map(column => (
                    <DistributionChart
                      key={column}
                      realData={dataset.realData!}
                      syntheticData={dataset.syntheticData!}
                      column={column}
                      type="categorical"
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
