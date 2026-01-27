import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Settings, Zap, Info, ArrowLeft, Eye, Shield, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DatasetHistory, GenerationProgress, GenerationSettings } from '@/types/dataset';
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
  const [epochs, setEpochs] = useState(300);
  const [noiseLevel, setNoiseLevel] = useState(5);
  const [privacyBudget, setPrivacyBudget] = useState(1.0);
  const [preserveCorrelations, setPreserveCorrelations] = useState(true);
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
    
    const settings: GenerationSettings = {
      numSamples,
      epochs,
      noiseLevel,
      privacyBudget,
      preserveCorrelations
    };
    
    try {
      const synthetic = await generateSyntheticData(
        dataset.realData!,
        dataset.stats,
        settings,
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
                        {columns.map((col) => {
                          const colInfo = dataset.stats.columnInfo.find(c => c.name === col);
                          const precision = colInfo?.precision ?? 2;
                          return (
                            <TableCell key={col} className="font-mono text-sm">
                              {typeof row[col] === 'number' 
                                ? Number(row[col]).toFixed(precision) 
                                : String(row[col] ?? '').slice(0, 20)
                              }
                            </TableCell>
                          );
                        })}
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
            {/* Model Recommendation */}
            <ModelRecommendation
              stats={dataset.stats}
              columnNames={columns}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />

            {/* Generation Settings */}
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
                {/* Number of Samples */}
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

                {/* Training Epochs */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Training Epochs</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>More epochs = better quality but slower generation</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-sm font-mono text-primary">{epochs}</span>
                  </div>
                  <Slider
                    value={[epochs]}
                    onValueChange={([value]) => setEpochs(value)}
                    min={100}
                    max={1000}
                    step={100}
                    className="w-full"
                  />
                </div>

                {/* Privacy Budget */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Privacy Budget (ε)</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Shield className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Lower epsilon = stronger privacy, more noise</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-sm font-mono text-primary">{privacyBudget.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[privacyBudget * 10]}
                    onValueChange={([value]) => setPrivacyBudget(value / 10)}
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Noise Level */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Noise Level</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <BarChart className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Controls the variance of generated values</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-sm font-mono text-primary">{noiseLevel}%</span>
                  </div>
                  <Slider
                    value={[noiseLevel]}
                    onValueChange={([value]) => setNoiseLevel(value)}
                    min={0}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Preserve Correlations */}
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <BarChart className="w-4 h-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Preserve Correlations</span>
                      <span className="text-[10px] text-muted-foreground">Maintain inter-column relationships</span>
                    </div>
                  </div>
                  <Switch 
                    checked={preserveCorrelations} 
                    onCheckedChange={setPreserveCorrelations}
                  />
                </div>

                {/* Generate Button */}
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
