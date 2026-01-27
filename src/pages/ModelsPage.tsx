import React from 'react';
import { 
  Cpu, 
  Activity, 
  Layers, 
  CheckCircle2, 
  Info,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ModelsPage = () => {
  const models = [
    {
      id: "ctgan",
      name: "CTGAN",
      fullName: "Conditional Tabular GAN",
      icon: <Cpu className="w-8 h-8" />,
      description: "A generative adversarial network specifically designed for tabular data with mixed column types. It uses a conditional generator to handle imbalanced categorical columns and mode-specific normalization for continuous columns.",
      bestFor: "Mixed datasets with complex dependencies and imbalanced categories.",
      pros: [
        "Excellent at capturing complex correlations",
        "Handles mixed data types natively",
        "Stable training for tabular data",
        "State-of-the-art fidelity"
      ],
      cons: [
        "Higher computational cost",
        "Slower training on very large datasets"
      ]
    },
    {
      id: "vae",
      name: "TVAE",
      fullName: "Tabular Variational Autoencoder",
      icon: <Layers className="w-8 h-8" />,
      description: "TVAE uses a variational autoencoder architecture to learn a compressed representation of the data. It's often faster than GAN-based models while maintaining comparable quality for many use cases.",
      bestFor: "Fast generation and datasets where global distribution preservation is key.",
      pros: [
        "Fast training and generation",
        "Good at capturing overall distributions",
        "Stably converges every time",
        "Lower resource requirements"
      ],
      cons: [
        "May struggle with extremely sparse categories",
        "Slightly lower correlation fidelity than GANs"
      ]
    },
    {
      id: "gaussian",
      name: "Gaussian Copula",
      fullName: "Gaussian Copula Synthesizer",
      icon: <Activity className="w-8 h-8" />,
      description: "A statistical model that uses copula functions to model the dependency structure between variables separately from their marginal distributions. It's extremely fast and mathematically robust.",
      bestFor: "Small to medium datasets where statistical properties must be strictly preserved.",
      pros: [
        "Extremely fast (near instant)",
        "Perfect preservation of marginals",
        "No training required (deterministic)",
        "Very low memory footprint"
      ],
      cons: [
        "Assumes simpler dependency structures",
        "Limited to capturing linear-like correlations"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Generation Models</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the right engine for your synthetic data needs. We provide industry-standard models optimized for different data characteristics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {models.map((model) => (
              <div key={model.id} className="glass-card p-8 flex flex-col h-full hover:border-primary/50 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  {model.icon}
                </div>
                <h2 className="text-2xl font-bold mb-1">{model.name}</h2>
                <p className="text-sm font-medium text-muted-foreground mb-4">{model.fullName}</p>
                <p className="text-foreground/80 mb-6 leading-relaxed flex-grow">
                  {model.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Best For</h4>
                  <p className="text-sm font-medium">{model.bestFor}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-success mb-3">Advantages</h4>
                    <ul className="space-y-2">
                      {model.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 bg-muted/30">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Privacy Protection
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                All our models can be configured with Differential Privacy (DP) to ensure that the generated data does not leak information about specific individuals in the training set.
              </p>
            </div>
            <div className="glass-card p-8 bg-muted/30">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Fidelity Scoring
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We use the SDMetrics library to calculate comprehensive fidelity scores, ensuring your synthetic data is as useful as your real data for analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelsPage;
