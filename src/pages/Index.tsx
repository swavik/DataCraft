import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ModelsSection from "@/components/ModelsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import FileUpload from "@/components/FileUpload";
import DataPreview from "@/components/DataPreview";
import GenerationConfig, { GenerationConfigType } from "@/components/GenerationConfig";
import GenerationProgress from "@/components/GenerationProgress";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";
import { 
  analyzeDataset, 
  generateSyntheticData, 
  calculateQualityReport 
} from "@/utils/syntheticGenerator";
import { DatasetStats, QualityReport, GenerationProgress as ProgressType } from "@/types/dataset";
import { FolderOpen, Upload as UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'landing' | 'upload' | 'preview' | 'generating' | 'results'>('landing');
  const [activeTab, setActiveTab] = useState<'upload' | 'samples'>('upload');
  const [realData, setRealData] = useState<any[]>([]);
  const [syntheticData, setSyntheticData] = useState<any[]>([]);
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
    const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setStage('upload');
    setTimeout(() => {
      uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFileUpload = (file: File, data: any[]) => {
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
    <div className="min-h-screen bg-background font-sans">
      <Header />
      
      {/* Landing Page Sections - Only show on landing stage */}
      {stage === 'landing' && (
        <>
          <HeroSection onGetStarted={handleGetStarted} />
          <FeaturesSection />
          <ModelsSection />
          <HowItWorksSection />
          <CTASection onGetStarted={handleGetStarted} />
        </>
      )}

      {/* Upload Section */}
      {(stage === 'upload' || stage === 'preview') && (
        <section ref={uploadSectionRef} className="py-24 min-h-[80vh] flex flex-col justify-center">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-lg text-muted-foreground mb-8">
                  Choose a CSV file or select from our sample datasets
                </p>
                
                {/* Tabs */}
                <div className="inline-flex p-1 bg-muted/50 border border-border/50 rounded-xl mb-12 w-full max-w-2xl">
                  <Button
                    variant="ghost"
                    className={`flex-1 gap-2 h-12 rounded-lg transition-all ${activeTab === 'upload' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab('upload')}
                  >
                    <UploadIcon className="w-4 h-4" />
                    Upload CSV
                  </Button>
                  <Button
                    variant="ghost"
                    className={`flex-1 gap-2 h-12 rounded-lg transition-all ${activeTab === 'samples' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab('samples')}
                  >
                    <FolderOpen className="w-4 h-4" />
                    Sample Datasets
                  </Button>
                </div>
              </div>
              
              {activeTab === 'upload' ? (
                <FileUpload
                  onFileUpload={handleFileUpload}
                  isUploaded={stage === 'preview'}
                  fileName={fileName}
                  onClear={handleClearFile}
                />
              ) : (
                <div className="glass-card p-12 text-center border-dashed border-2">
                  <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                  <p className="text-muted-foreground">Sample datasets coming soon...</p>
                </div>
              )}
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

      <Footer />
    </div>
  );
};

export default Index;
