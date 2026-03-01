import { Database, Shield, BarChart3, Layers, Zap, FileCheck } from 'lucide-react';

const features = [
  {
    icon: Database,
    title: "Multi-Format Support",
    description: "Upload CSV, Excel, or JSON files. Export synthetic data in your preferred format with full schema preservation."
  },
  {
    icon: Shield,
    title: "Privacy Preservation",
    description: "Generate data that maintains statistical properties while ensuring no original records can be reconstructed."
  },
  {
    icon: BarChart3,
    title: "Quality Analysis",
    description: "Comprehensive statistical validation including distribution comparison, correlation analysis, and similarity scores."
  },
  {
    icon: Layers,
    title: "Multiple Models",
    description: "Choose from CTGAN, VAE, or Gaussian Copula based on your data characteristics and use cases."
  },
  {
    icon: Zap,
    title: "Iterative Refinement",
    description: "Adjust parameters and regenerate until you achieve the desired data quality and fidelity scores."
  },
  {
    icon: FileCheck,
    title: "Data Validation",
    description: "Automatic validation checks ensure generated data meets schema constraints and semantic rules."
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-4 px-6 lg:px-20 relative z-10 scroll-mt-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <p className="text-[#E87B64] font-bold tracking-wider uppercase text-[10px]">Features</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
            Everything You Need for Synthetic Data
          </h2>
          <p className="text-muted-foreground text-[14px] max-w-xl mx-auto leading-relaxed">
            Comprehensive tools for generating, validating, and analyzing privacy-preserving synthetic datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col items-start text-left space-y-4 h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-lg shadow-orange-500/10 flex items-center justify-center border border-orange-50/50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E87B64] to-[#f4a291] flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-[17px] font-bold text-foreground leading-tight">{feature.title}</h3>
                <p className="text-[13px] text-muted-foreground/80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
