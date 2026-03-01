import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, ArrowLeft, Info, Eye, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DatasetHistory, GenerationProgress as ProgressType, DatasetStats } from '@/types/dataset';
import { generateGenAiData, guessSchemaFromPrompt, GenAiConfig } from '@/utils/genAiGenerator';
import { analyzeDataset, calculateQualityReport } from '@/utils/syntheticGenerator';
import GenerationProgress from '@/components/GenerationProgress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface GenAiDatasetPageProps {
  dataset: DatasetHistory | null;
  onDatasetUpdate: (updates: Partial<DatasetHistory>) => void;
  onGenerationComplete: () => void;
  onDatasetReady: (dataset: DatasetHistory) => void;
}

const GenAiDatasetPage = ({ dataset, onDatasetUpdate, onGenerationComplete, onDatasetReady }: GenAiDatasetPageProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [numRows, setNumRows] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rawPreviewData, setRawPreviewData] = useState<any[] | null>(null);
  const [rawStats, setRawStats] = useState<DatasetStats | null>(null);
  const [progress, setProgress] = useState<ProgressType>({
    stage: 'idle',
    progress: 0,
    message: ''
  });

  const handleGenerateRawData = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please describe the dataset you need.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress({
      stage: 'analyzing',
      progress: 30,
      message: 'Searching for relevant datasets in Supabase...'
    });

    try {
      let tableName = '';
      const lowerPrompt = prompt.toLowerCase();
      
      // Map prompt keywords to your specific Supabase tables
      if (lowerPrompt.includes('financial') || lowerPrompt.includes('transaction')) {
        tableName = 'financial_transactions';
      } else if (lowerPrompt.includes('health') || lowerPrompt.includes('medical') || lowerPrompt.includes('patient')) {
        tableName = 'health_records';
      }

      let realData: any[] = [];
      let stats: DatasetStats;

      if (tableName) {
        setProgress({
          stage: 'analyzing',
          progress: 50,
          message: `Fetching data from ${tableName}...`
        });

        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(50); // Fetching a good sample for stats

        if (error) throw error;

        if (data && data.length > 0) {
          realData = data;
          stats = analyzeDataset(realData);
        } else {
          throw new Error(`Table "${tableName}" is empty.`);
        }
      } else {
        // Fallback to heuristic generation if no table matches the prompt
        const schema = guessSchemaFromPrompt(prompt);
        realData = Array.from({ length: 20 }).map((_, i) => {
          const row: any = {};
          schema.forEach(col => {
            if (col.type === 'numerical') {
              row[col.name] = (col.mean ?? 50) + (Math.random() - 0.5) * (col.std ?? 10);
              row[col.name] = Math.round(row[col.name] * 100) / 100;
            } else {
              row[col.name] = `${col.name}_${Math.floor(Math.random() * 5)}`;
            }
          });
          return row;
        });
        stats = analyzeDataset(realData);
        
        toast({
          title: "Generation successful",
        });
      }
      
      setRawPreviewData(realData);
      setRawStats(stats);
    } catch (error: any) {
      console.error("Raw data generation failed", error);
      toast({
        title: "Database Error",
        description: error.message || "Could not retrieve data from Supabase.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setProgress({ stage: 'idle', progress: 0, message: '' });
    }
  };

  const handleGenerateSyntheticData = async () => {
    if (!rawPreviewData || !rawStats) return;

    setIsGenerating(true);
    try {
      const config: GenAiConfig = {
        numRows,
        noiseLevel: 0.2,
        privacyBudget: 0.3,
        correlationPreservation: 0.7,
        prompt
      };

      const syntheticData = await generateGenAiData(
        rawPreviewData,
        rawStats,
        config,
        (p) => setProgress(p)
      );

      const qualityReport = calculateQualityReport(rawPreviewData, syntheticData, rawStats);

      // Create a new dataset entry
      const newDataset: DatasetHistory = {
        id: crypto.randomUUID(),
        name: prompt.split(' ').slice(0, 3).join(' ') || "GenAI Dataset",
        fileName: (prompt.split(' ').slice(0, 3).join('_') || "genai_dataset") + ".csv",
        uploadedAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        rowCount: rawStats.rows,
        columnCount: rawStats.columns,
        realData: rawPreviewData,
        syntheticData,
        hasSynthetic: true,
        stats: rawStats,
        qualityReport
      };
      
      onDatasetReady(newDataset);

      toast({
        title: "Generation successful",
        description: `Generated ${numRows} synthetic records using GenAI model.`,
      });

      onGenerationComplete();
      navigate('/synthetic');
    } catch (error) {
      console.error("Generation failed", error);
      toast({
        title: "Generation failed",
        description: "An error occurred while generating synthetic data.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <GenerationProgress progress={progress} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => {
            if (rawPreviewData) {
              setRawPreviewData(null);
              setRawStats(null);
            } else {
              navigate('/home');
            }
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">GenAI Dataset Creator</h1>
        </div>

        {!rawPreviewData ? (
          <div className="glass-card p-8 border-none shadow-sm bg-white rounded-2xl">
            {/* Dataset Prompt */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="prompt" className="text-lg font-semibold">Dataset Prompt</Label>
              </div>
              <Textarea
                id="prompt"
                placeholder="e.g., Financial Transactions"
                className="min-h-[100px] bg-[#FDF8F6] border-none text-base p-4 resize-none focus-visible:ring-1 focus-visible:ring-primary/20"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                size="lg" 
                onClick={handleGenerateRawData}
                className="h-14 px-8 rounded-xl bg-[#E87352] hover:bg-[#D66241] text-white gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Send className="w-5 h-5" />
                Preview Raw Data
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="glass-card overflow-hidden bg-white rounded-2xl border-none shadow-sm">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-semibold text-lg">Raw Data Preview</h3>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(rawPreviewData[0]).map((col) => (
                        <TableHead key={col} className="bg-muted/30">{col}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rawPreviewData.slice(0, 10).map((row, idx) => (
                      <TableRow key={idx}>
                        {Object.keys(row).map((col) => (
                          <TableCell key={col} className="font-mono text-sm">
                            {String(row[col])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="glass-card p-8 bg-white rounded-2xl border-none shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="rows" className="font-semibold text-lg">Number of Synthetic Rows</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How many records to generate in the final synthetic dataset</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="rows"
                    type="number"
                    min={10}
                    max={1000}
                    value={numRows}
                    onChange={(e) => setNumRows(parseInt(e.target.value) || 10)}
                    className="bg-[#FDF8F6] border-none h-14 text-lg focus-visible:ring-primary/20"
                  />
                  <p className="text-xs text-muted-foreground italic">Maximum 1,000 rows for AI generation</p>
                </div>

                <div className="md:pt-9">
                  <Button 
                    size="lg" 
                    onClick={handleGenerateSyntheticData}
                    className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-white gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <Zap className="w-5 h-5 fill-current" />
                    Generate Synthetic Dataset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenAiDatasetPage;
