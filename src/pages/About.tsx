import { Lock, Zap, BarChart3, Shield, Database, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* REMOVED <Header /> FROM HERE TO PREVENT DOUBLE NAVBAR */}
      
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 text-foreground tracking-tight">About DataCraft</h1>
            <p className="text-xl text-muted-foreground mb-12">
              A privacy-preserving synthetic data generation platform powered by CTGAN technology.
            </p>
            
            <div className="space-y-8">
              <div className="glass-card p-8 border border-border/50 rounded-2xl bg-card/30">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  What is CTGAN?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  CTGAN (Conditional Tabular GAN) is a state-of-the-art generative adversarial network 
                  designed specifically for tabular data. It learns the statistical patterns in your 
                  original dataset and generates new synthetic records that maintain the same 
                  distributions and correlations without exposing any real data.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Lock,
                    title: "Privacy Protected",
                    description: "Your original data never leaves your control. Only statistical patterns are learned."
                  },
                  {
                    icon: Zap,
                    title: "Fast Generation",
                    description: "Generate thousands of synthetic records in minutes using optimized algorithms."
                  },
                  {
                    icon: BarChart3,
                    title: "Quality Assured",
                    description: "ML utility testing ensures generated data maintains analytical value."
                  }
                ].map((feature, index) => (
                  <div key={index} className="glass-card p-6 border border-border/50 rounded-2xl bg-card/30">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="glass-card p-8 border border-border/50 rounded-2xl bg-card/30">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Database className="w-6 h-6 text-primary" />
                  How It Works
                </h2>
                <ol className="space-y-4 text-muted-foreground">
                  <li className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</span>
                    <span className="pt-1">Upload your CSV dataset with the columns you want to synthesize</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</span>
                    <span className="pt-1">Configure the number of synthetic samples and training epochs</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</span>
                    <span className="pt-1">The CTGAN model trains on your data to learn statistical patterns</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">4</span>
                    <span className="pt-1">Download your synthetic dataset with quality metrics report</span>
                  </li>
                </ol>
              </div>

              <div className="glass-card p-8 border border-border/50 rounded-2xl bg-card/30">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Enterprise Ready
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  DataCraft is designed for enterprise use cases including data sharing, 
                  machine learning model training, software testing, and regulatory compliance. 
                  Generate unlimited synthetic data while maintaining full privacy compliance.
                </p>
              </div>

              <div className="text-center pt-8">
                <Link to="/upload">
                  <Button variant="glow" size="lg" className="px-8 h-12 text-base">
                    Start Generating
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;