import { LandingLayout } from "@/components/layout/LandingLayout";
import { Cpu, Activity, BarChart3, CheckCircle2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ModelCard = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  description, 
  bestFor, 
  features, 
  badge,
  badgeClassName 
}: { 
  icon: LucideIcon, 
  title: string, 
  subtitle: string, 
  description: string, 
  bestFor: string, 
  features: string[],
  badge?: string,
  badgeClassName?: string
}) => (
  <div className="bg-white rounded-3xl p-5 flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden border border-gray-100">
    {badge && (
      <div className={cn(
        "absolute top-4 right-4 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase",
        badgeClassName
      )}>
        {badge}
      </div>
    )}
    
    <div className="w-12 h-12 rounded-2xl bg-white shadow-lg shadow-orange-500/10 flex items-center justify-center mb-4 border border-orange-50/50">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E87B64] to-[#f4a291] flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    
    <h3 className="text-xl font-bold text-foreground mb-0.5">{title}</h3>
    <p className="text-[9px] font-bold text-muted-foreground/60 tracking-[0.2em] uppercase mb-3">{subtitle}</p>
    
    <p className="text-[13px] text-muted-foreground/80 leading-snug mb-4">
      {description}
    </p>
    
    <div className="mt-auto">
      <p className="text-[9px] font-bold text-[#E87B64] tracking-[0.2em] uppercase mb-2">Best For</p>
      <p className="text-[14px] font-semibold text-foreground mb-4 leading-tight">
        {bestFor}
      </p>
      
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-3 h-3 text-[#E87B64]" />
            </div>
            <span className="text-[12px] text-muted-foreground/70 font-medium">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Models = () => {
  const models = [
    {
      icon: Cpu,
      title: "CTGAN",
      subtitle: "Conditional Tabular GAN",
      description: "A generative adversarial network specifically designed for tabular data with mixed column types. It uses a conditional generator to handle imbalanced categorical columns.",
      bestFor: "Mixed datasets with complex dependencies and imbalanced categories.",
      badge: "Most Popular",
      badgeClassName: "bg-orange-50 text-orange-600",
      features: [
        "Excellent at capturing complex correlations",
        "Handles mixed data types (numerical + categorical)",
        "Stable training for tabular data",
        "State-of-the-art fidelity"
      ]
    },
    {
      icon: Activity,
      title: "VAE",
      subtitle: "Variational Autoencoder",
      description: "Uses a variational autoencoder architecture to learn a compressed representation of the data. Often faster than GAN-based models while maintaining quality.",
      bestFor: "Fast generation and datasets where global distribution preservation is key.",
      badge: "Fast Training",
      badgeClassName: "bg-orange-50 text-orange-600",
      features: [
        "Fast training and generation",
        "Good at capturing overall distributions",
        "Stably converges every time",
        "Lower resource requirements"
      ]
    },
    {
      icon: BarChart3,
      title: "Gaussian Copula",
      subtitle: "Gaussian Copula Model",
      description: "A statistical model that uses copula theory to model dependency structure. It's extremely fast, mathematically robust, and deterministic.",
      bestFor: "Small to medium datasets where statistical properties must be strictly preserved.",
      badge: "Interpretable",
      badgeClassName: "bg-orange-50 text-orange-600",
      features: [
        "Extremely fast (near instant)",
        "Perfect preservation of marginals",
        "No training required (deterministic)",
        "Very low memory footprint"
      ]
    }
  ];

  return (
    <LandingLayout>
      <div className="h-[calc(100vh-80px)] px-6 max-w-7xl mx-auto flex flex-col justify-center py-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2 tracking-tight">Choose Your <span className="gradient-text">Generation Algorithm</span></h1>
          <p className="text-[15px] text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Three powerful models tailored for different data characteristics and use cases.<br />
            Select the one that best fits your requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[70vh]">
          {models.map((model, index) => (
            <ModelCard key={index} {...model} />
          ))}
        </div>
      </div>
    </LandingLayout>
  );
};

export default Models;
