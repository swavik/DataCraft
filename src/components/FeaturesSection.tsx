import { Shield, Zap, BarChart3, Lock, Database, Brain } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Privacy Guarantee",
    description: "Generate synthetic data that statistically resembles your original data while ensuring zero leakage of sensitive PII."
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Create thousands of rows of high-quality synthetic data in seconds using optimized algorithms."
  },
  {
    icon: BarChart3,
    title: "Statistical Fidelity",
    description: "Maintain correlations and distributions. Your synthetic data behaves exactly like your real data for analytics."
  },
  {
    icon: Lock,
    title: "GDPR & CCPA Compliant",
    description: "Safe for sharing across teams and borders. Eliminate compliance bottlenecks with fully anonymized datasets."
  },
  {
    icon: Database,
    title: "Multi-Table Support",
    description: "Preserve referential integrity across complex database schemas with advanced relationship modeling."
  },
  {
    icon: Brain,
    title: "Advanced AI Models",
    description: "Leverage state-of-the-art generative models like CTGAN and VAEs tailored for tabular data."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Why Choose DataCraft?
          </h2>
          <p className="text-lg text-muted-foreground">
            Enterprise-grade synthetic data generation for modern data teams.
            Unblock development while keeping data safe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-background p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
