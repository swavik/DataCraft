import { LandingLayout } from "@/components/layout/LandingLayout";
import { Database, Settings, Zap, Download, LucideIcon } from "lucide-react";

const StepCard = ({ 
  icon: Icon, 
  stepNumber, 
  title, 
  description 
}: { 
  icon: LucideIcon, 
  stepNumber: string, 
  title: string, 
  description: string 
}) => (
  <div className="flex flex-col items-center text-center px-4 group">
    <div className="relative mb-8">
      <div className="w-20 h-20 rounded-3xl bg-white shadow-[0_10px_40px_rgb(0,0,0,0.06)] group-hover:shadow-[0_10px_40px_rgb(0,0,0,0.1)] transition-all duration-300 flex items-center justify-center border border-gray-50">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E87B64] to-[#f4a291] flex items-center justify-center">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-[12px] font-bold text-[#E87B64] border border-orange-50">
        {stepNumber}
      </div>
    </div>
    
    <h3 className="text-[19px] font-bold text-foreground mb-3">{title}</h3>
    <p className="text-[14px] text-muted-foreground/70 leading-relaxed max-w-[240px]">
      {description}
    </p>
  </div>
);

const HowItWorks = () => {
  // ... (steps data stays the same)
  const steps = [
    {
      icon: Database,
      stepNumber: "01",
      title: "Upload Your Data",
      description: "Import your original dataset in CSV, Excel, or JSON format. We automatically detect column types and data schema."
    },
    {
      icon: Settings,
      stepNumber: "02",
      title: "Configure Settings",
      description: "Select your preferred generation model (CTGAN, VAE, or Gaussian Copula) and adjust parameters for optimal results."
    },
    {
      icon: Zap,
      stepNumber: "03",
      title: "Generate Synthetic Data",
      description: "Our algorithms learn the statistical patterns and generate new, privacy-preserving synthetic records."
    },
    {
      icon: Download,
      stepNumber: "04",
      title: "Analyze & Export",
      description: "Review quality metrics, compare distributions side-by-side, and export your synthetic dataset."
    }
  ];

  return (
    <LandingLayout>
      <div className="pt-8 pb-4 px-6 max-w-6xl mx-auto flex flex-col h-[calc(100vh-80px)] justify-center">
        <div className="text-center mb-12">
          <p className="text-[9px] font-bold text-[#E87B64] tracking-[0.2em] uppercase mb-1">How It Works</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">Generate Synthetic Data in Minutes</h1>
          <p className="text-[13px] text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            A simple four-step process to transform your sensitive data into privacy-preserving synthetic datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent -z-10" />
          
          {steps.map((step, index) => (
            <StepCard key={index} {...step} />
          ))}
        </div>
      </div>
    </LandingLayout>
  );
};

export default HowItWorks;
