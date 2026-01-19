import { Download, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import ComparisonChart from "./ComparisonChart";
import QualityMetrics from "./QualityMetrics";
import { QualityReport } from "@/types/dataset";

interface ResultsSectionProps {
  realData: any[];
  syntheticData: any[];
  qualityReport: QualityReport;
  numericalColumns: string[];
  onReset: () => void;
}

const ResultsSection = ({ 
  realData, 
  syntheticData, 
  qualityReport, 
  numericalColumns,
  onReset 
}: ResultsSectionProps) => {
  
  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => row[h]).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadReport = () => {
    const report = `SYNTHETIC DATA GENERATION - QUALITY REPORT
${'='.repeat(70)}

ML UTILITY TEST RESULTS:
Real Data Model Accuracy:      ${(qualityReport.realAccuracy * 100).toFixed(2)}%
Synthetic Data Model Accuracy: ${(qualityReport.syntheticAccuracy * 100).toFixed(2)}%
Accuracy Difference:           ${(qualityReport.accuracyDiff * 100).toFixed(2)}%

Quality Assessment: ${qualityReport.qualityLevel.toUpperCase()}

${'='.repeat(70)}
STATISTICAL COMPARISON:

${qualityReport.comparisonMetrics.map(m => 
  `${m.column}:
  Real Mean: ${m.realMean.toFixed(4)}, Synthetic Mean: ${m.syntheticMean.toFixed(4)}
  Real Std: ${m.realStd.toFixed(4)}, Synthetic Std: ${m.syntheticStd.toFixed(4)}
  Mean Difference: ${m.meanDiff.toFixed(4)}`
).join('\n\n')}
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quality_report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Generation Complete</h2>
            <p className="text-muted-foreground">
              Successfully generated {syntheticData.length.toLocaleString()} synthetic records
            </p>
          </div>
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate New Dataset
          </Button>
        </div>

        {/* Download Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button 
            variant="glow" 
            size="lg" 
            className="w-full"
            onClick={() => downloadCSV(syntheticData, 'synthetic_data.csv')}
          >
            <Download className="w-5 h-5 mr-2" />
            Download Synthetic Data
          </Button>
          
          <Button 
            variant="glass" 
            size="lg" 
            className="w-full"
            onClick={() => downloadCSV(realData, 'original_data.csv')}
          >
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            Download Original Data
          </Button>
          
          <Button 
            variant="glass" 
            size="lg" 
            className="w-full"
            onClick={downloadReport}
          >
            <FileText className="w-5 h-5 mr-2" />
            Download Quality Report
          </Button>
        </div>

        {/* Quality Metrics */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Quality Assessment</h3>
          <QualityMetrics report={qualityReport} />
        </div>

        {/* Distribution Comparison Charts */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Distribution Comparison</h3>
          <p className="text-muted-foreground mb-6">
            Visual comparison of real (blue) vs synthetic (teal) data distributions
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {numericalColumns.slice(0, 6).map(column => (
              <ComparisonChart
                key={column}
                realData={realData}
                syntheticData={syntheticData}
                column={column}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
