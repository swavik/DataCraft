import { useState, useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FileUpload from "@/components/FileUpload";
import DataPreview from "@/components/DataPreview";
import GenerationConfig, { GenerationConfigType } from "@/components/GenerationConfig";
import GenerationProgress from "@/components/GenerationProgress";
import ResultsSection from "@/components/ResultsSection";
import { 
  analyzeDataset, 
  generateSyntheticData, 
  calculateQualityReport 
} from "@/utils/syntheticGenerator";
import { DatasetStats, QualityReport, GenerationProgress as ProgressType } from "@/types/dataset";

const Index = () => {
  const [stage, setStage] = useState<'hero' | 'upload' | 'preview' | 'generating' | 'results'>('hero');
  const [realData, setRealData] = useState<Record<string, unknown>[]>([]);
  const [syntheticData, setSyntheticData] = useState<Record<string, unknown>[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [qualityReport, setQualityReport] = useState<QualityReport | null>(null);
  const [progress, setProgress] = useState<ProgressType>({
    stage: 'idle',
    progress: 0,
    message: ''
  });

  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    setStage('upload');
    setTimeout(() => {
      uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFileUpload = (file: File, data: Record<string, unknown>[]) => {
    setFileName(file.name);
    setRealData(data);
    const dataStats = analyzeDataset(data);
    setStats(dataStats);
    setStage('preview');
  };

  const handleClearFile = () => {
    setRealData([]);
    setFileName('');
    setStats(null);
    setStage('upload');
  };

  const handleGenerate = async (config: GenerationConfigType) => {
    if (!stats) return;
    
    setStage('generating');
    
    try {
      const synthetic = await generateSyntheticData(
        realData,
        stats,
        config.numSamples,
        config.epochs,
        setProgress
      );
      
      setSyntheticData(synthetic);
      
      const report = calculateQualityReport(realData, synthetic, stats);
      setQualityReport(report);
      
      setStage('results');
    } catch (error) {
      console.error('Generation failed:', error);
      setStage('preview');
    }
  };

  const handleReset = () => {
    setStage('upload');
    setRealData([]);
    setSyntheticData([]);
    setFileName('');
    setStats(null);
    setQualityReport(null);
    setProgress({ stage: 'idle', progress: 0, message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      {(stage === 'hero' || stage === 'upload') && (
        <HeroSection onGetStarted={handleGetStarted} />
      )}

      {/* Upload Section */}
      {(stage === 'upload' || stage === 'preview') && (
        <section ref={uploadSectionRef} className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-2 text-center">Upload Your Dataset</h2>
              <p className="text-muted-foreground text-center mb-8">
                Upload a CSV file to generate privacy-preserving synthetic data
              </p>
              
              <FileUpload
                onFileUpload={handleFileUpload}
                isUploaded={stage === 'preview'}
                fileName={fileName}
                onClear={handleClearFile}
              />
            </div>
          </div>
        </section>
      )}

      {/* Data Preview & Configuration */}
      {stage === 'preview' && stats && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DataPreview data={realData} stats={stats} />
              </div>
              <div>
                <GenerationConfig
                  rowCount={stats.rows}
                  onGenerate={handleGenerate}
                  isGenerating={false}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Generation Progress */}
      {stage === 'generating' && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-xl mx-auto">
              <GenerationProgress progress={progress} />
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {stage === 'results' && qualityReport && stats && (
        <ResultsSection
          realData={realData}
          syntheticData={syntheticData}
          qualityReport={qualityReport}
          numericalColumns={stats.numericalColumns}
          onReset={handleReset}
        />
      )}

    </div>
  );
};

export default Index;
