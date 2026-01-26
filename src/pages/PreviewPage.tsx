import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Settings, Zap, ArrowLeft, Eye, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DatasetHistory, GenerationProgress } from '@/types/dataset';
import { generateSyntheticData, calculateQualityReport } from '@/utils/syntheticGenerator';
import { ModelType } from '@/utils/modelRecommendation';
import GenerationProgressComponent from '@/components/GenerationProgress';
import ModelRecommendation from '@/components/ModelRecommendation';

interface PreviewPageProps {
  dataset: DatasetHistory | null;
  onDatasetUpdate: (updates: Partial<DatasetHistory>) => void;
  onGenerationComplete: () => void;
}

const PreviewPage = ({ dataset, onDatasetUpdate, onGenerationComplete }: PreviewPageProps) => {
  const navigate = useNavigate();
  const [numSamples, setNumSamples] = useState(dataset?.rowCount || 100);
  
  // FIXED VALUE: Removed setEpochs since we no longer want users to change this in the UI
  const [epochs] = useState(300); 
  
  const [selectedModel, setSelectedModel] = useState<ModelType>('GaussianCopula');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress>({
    stage: 'idle',
    progress: 0,
    message: ''
  });

  if (!dataset || !dataset.realData || !dataset.stats) {
    return (
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="text-center">
          <FileSpreadsheet className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No dataset selected</h2>
          <p className="text-muted-foreground mb-4">Please upload a dataset first</p>
          <Button asChild>
            <a href="/upload">Upload Dataset</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!dataset.stats) return;
    
    setIsGenerating(true);
    
    try {
      const synthetic = await generateSyntheticData(
        dataset.realData!,
        dataset.stats,
        numSamples,
        epochs, // Passes the fixed 300 value
        setProgress
      );
      
      const report = calculateQualityReport(dataset.realData!, synthetic, dataset.stats);
      
      onDatasetUpdate({
        hasSynthetic: true,
        syntheticData: synthetic,
        qualityReport: report
      });
      
      onGenerationComplete();
      navigate('/synthetic');
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="max-w-xl w-full">
          <GenerationProgressComponent progress={progress} />
        </div>
      </div>
    );
  }

  const previewData = dataset.realData.slice(0, 5);
  const columns = Object.keys(previewData[0] || {});

  return (
    <div className="min-h-full p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/upload')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{dataset.fileName}</h1>
              <p className="text-muted-foreground">
                {dataset.rowCount.toLocaleString()} rows • {dataset.columnCount} columns
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Preview */}
          <div className="lg:col-span-2 animate-slide-up">
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Eye className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Data Preview</h3>
                  <p className="text-sm text-muted-foreground">First 5 rows of your dataset</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((col) => (
                        <TableHead key={col} className="whitespace-nowrap">{col}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, idx) => (
                      <TableRow key={idx}>
                        {columns.map((col) => (
                          <TableCell key={col} className="font-mono text-sm">
                            {String(row[col]).slice(0, 20)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Column Stats */}
            <div className="glass-card mt-6 p-4">
              <h3 className="font-semibold mb-4">Column Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {dataset.stats.columnInfo.slice(0, 6).map((col) => (
                  <div key={col.name} className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-medium text-sm truncate">{col.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{col.type}</p>
                    {col.mean !== undefined && (
                      <p className="text-xs text-primary mt-1">Mean: {col.mean.toFixed(2)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generation Config */}
          <div className="animate-slide-up space-y-6" style={{ animationDelay: '0.1s' }}>
            <ModelRecommendation
              stats={dataset.stats}
              columnNames={columns}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />

            <div className="glass-card p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Generation Settings</h3>
                  <p className="text-sm text-muted-foreground">Using {selectedModel}</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Number of Samples Slider (Kept) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Synthetic Samples</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of synthetic records to generate</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-sm font-mono text-primary">{numSamples.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[numSamples]}
                    onValueChange={([value]) => setNumSamples(value)}
                    min={100}
                    max={Math.max(dataset.rowCount * 2, 10000)}
                    step={100}
                    className="w-full"
                  />
                </div>

                {/* Training Epochs Slider (Removed as requested) */}

                <Button 
                  variant="glow" 
                  size="lg" 
                  className="w-full mt-4"
                  onClick={handleGenerate}
                >
                  <Zap className="w-5 h-5" />
                  Generate Synthetic Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;