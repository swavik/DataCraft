import React from 'react';
import { 
  Database, 
  Settings, 
  Zap, 
  Download, 
  ArrowRight,
  ChevronRight,
  BookOpen,
  Shield,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DocumentationPage = () => {
  const steps = [
    {
      title: "1. Data Upload",
      icon: <Database className="w-6 h-6" />,
      description: "Import your sensitive datasets in CSV, Excel, or JSON format. Our system automatically analyzes the schema and detects column types (numerical, categorical, datetime).",
      details: [
        "Support for CSV, XLSX, and JSON",
        "Automatic schema detection",
        "Data quality assessment",
        "Missing value analysis"
      ]
    },
    {
      title: "2. Model Configuration",
      icon: <Settings className="w-6 h-6" />,
      description: "Select the most suitable generative model for your data characteristics. Adjust hyperparameters or let our recommendation engine choose the best fit.",
      details: [
        "Choose from CTGAN, VAE, or Gaussian Copula",
        "Customizable training epochs",
        "Privacy budget (Epsilon) control",
        "Model-specific parameter tuning"
      ]
    },
    {
      title: "3. Synthetic Generation",
      icon: <Zap className="w-6 h-6" />,
      description: "Our machine learning models learn the underlying statistical distributions and correlations of your data to generate new, privacy-preserving records.",
      details: [
        "High-fidelity record generation",
        "Preservation of complex correlations",
        "Anonymization by design",
        "Scalable processing"
      ]
    },
    {
      title: "4. Quality Validation",
      icon: <BarChart3 className="w-6 h-6" />,
      description: "Automatically evaluate the quality of the generated data compared to the original dataset using multiple statistical metrics.",
      details: [
        "Statistical similarity score",
        "Distribution comparison charts",
        "Correlation matrix analysis",
        "Privacy leak detection"
      ]
    },
    {
      title: "5. Export & Integration",
      icon: <Download className="w-6 h-6" />,
      description: "Download your synthetic dataset in your preferred format and use it for development, testing, or analytics without privacy concerns.",
      details: [
        "Multi-format export (CSV, JSON, TXT)",
        "API access for automated workflows",
        "Shareable quality reports",
        "GDPR/HIPAA compliant data handoff"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-12">
            Learn how to use DataCraft to generate high-quality synthetic data while maintaining maximum privacy.
          </p>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              The Workflow <span className="text-sm font-normal text-muted-foreground">(Total Process)</span>
            </h2>
            
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="relative group">
                  {index !== steps.length - 1 && (
                    <div className="absolute left-6 top-14 bottom-[-3rem] w-px bg-border group-hover:bg-primary/30 transition-colors hidden md:block" />
                  )}
                  
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-lg relative z-10">
                      {step.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {step.description}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {step.details.map((detail, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-2 text-sm text-foreground/80">
                            <CheckCircle2 className="w-4 h-4 text-success" />
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card p-8 bg-primary/5 border-primary/10 rounded-3xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to start?</h2>
                <p className="text-muted-foreground">
                  Transform your sensitive data into privacy-safe synthetic assets today.
                </p>
              </div>
              <Button asChild size="lg" className="h-14 px-8 rounded-xl shadow-lg shadow-primary/20">
                <Link to="/upload">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
