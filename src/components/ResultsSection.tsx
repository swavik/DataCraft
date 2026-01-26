import { Download, FileSpreadsheet, FileText, RefreshCw, Table as TableIcon, BarChart2, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import DistributionChart from "./DistributionChart";
import QualityMetrics from "./QualityMetrics";
import DataPreview from "./DataPreview";
import { QualityReport, DatasetStats } from "@/types/dataset";
import { analyzeDataset } from "@/utils/syntheticGenerator";

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
  
  // Calculate stats for synthetic data to pass to DataPreview
  const syntheticStats = analyzeDataset(syntheticData);
  const realStats = analyzeDataset(realData);

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
    <section className="py-12 bg-slate-50/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Generation Complete</h2>
            <p className="text-muted-foreground">
              Successfully generated {syntheticData.length.toLocaleString()} synthetic records
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              New Generation
            </Button>
            <Button 
              onClick={() => downloadCSV(syntheticData, 'synthetic_data.csv')}
            >
              <Download className="w-5 h-5 mr-2" />
              Download Synthetic Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="comparison" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="comparison">
              <TableIcon className="w-4 h-4 mr-2" />
              Data Preview
            </TabsTrigger>
            <TabsTrigger value="analysis">
              <BarChart2 className="w-4 h-4 mr-2" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <Activity className="w-4 h-4 mr-2" />
              Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-6">
            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Side-by-Side Data Comparison</CardTitle>
                <CardDescription>
                  Compare your original data (left) with the generated synthetic data (right). 
                  The synthetic data preserves statistical properties while ensuring privacy.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x">
                  {/* Real Data Column */}
                  <div className="bg-blue-50/50 dark:bg-blue-950/10">
                    <div className="p-4 border-b bg-blue-100/50 dark:bg-blue-900/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                          <TableIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Original Data</h3>
                          <p className="text-xs text-blue-700 dark:text-blue-300">Your uploaded dataset</p>
                        </div>
                      </div>
                    </div>
                    <DataPreview data={realData} stats={realStats} compact />
                  </div>

                  {/* Synthetic Data Column */}
                  <div className="bg-teal-50/50 dark:bg-teal-950/10">
                    <div className="p-4 border-b bg-teal-100/50 dark:bg-teal-900/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
                          <TableIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-teal-900 dark:text-teal-100">Synthetic Data</h3>
                          <p className="text-xs text-teal-700 dark:text-teal-300">Privacy-preserving generated data</p>
                        </div>
                      </div>
                    </div>
                    <DataPreview data={syntheticData} stats={syntheticStats} compact />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Distribution Analysis</CardTitle>
                <CardDescription className="text-base">
                  Interactive visual comparison of real vs synthetic data distributions. 
                  Switch between Smooth (KDE) and Discrete (Histogram) views for numerical columns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <Activity className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">How to Read These Charts</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• <span className="text-[hsl(var(--chart-real))] font-medium">Real Data</span> represents your original dataset</li>
                        <li>• <span className="text-[hsl(var(--chart-synthetic))] font-medium">Synthetic Data</span> represents the generated records</li>
                        <li>• Use the toggle buttons on numerical charts to change the visualization style</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <ScrollArea className="h-[600px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                    {/* Numerical Column Charts */}
                    {realStats.numericalColumns.map(column => (
                      <DistributionChart
                        key={column}
                        realData={realData}
                        syntheticData={syntheticData}
                        column={column}
                        type="numerical"
                      />
                    ))}
                    
                    {/* Categorical Column Charts */}
                    {realStats.categoricalColumns.map(column => (
                      <DistributionChart
                        key={column}
                        realData={realData}
                        syntheticData={syntheticData}
                        column={column}
                        type="categorical"
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Quality Assessment Report</CardTitle>
                <CardDescription className="text-base">
                  Comprehensive statistical validation of your synthetic data quality. 
                  ML Utility Test measures how well models trained on synthetic data perform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QualityMetrics report={qualityReport} />
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full h-12"
                    onClick={() => downloadCSV(realData, 'original_data.csv')}
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Download Original CSV
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12"
                    onClick={downloadReport}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Download Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ResultsSection;
