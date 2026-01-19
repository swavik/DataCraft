import Header from "@/components/Header";
import { Lock, Zap, BarChart3, Shield, Database, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-foreground">About DataCraft</h1>
            <p className="text-muted-foreground mb-8">
              A privacy-preserving synthetic data generation platform powered by CTGAN technology.
            </p>
            
            <div className="space-y-8">
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  What is CTGAN?
                </h2>
                <p className="text-muted-foreground">
                  CTGAN (Conditional Tabular GAN) is a state-of-the-art generative adversarial network 
                  designed specifically for tabular data. It learns the statistical patterns in your 
                  original dataset and generates new synthetic records that maintain the same 
                  distributions and correlations without exposing any real data.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
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
                  <div key={index} className="glass-card p-5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  How It Works
                </h2>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">1</span>
                    <span>Upload your CSV dataset with the columns you want to synthesize</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">2</span>
                    <span>Configure the number of synthetic samples and training epochs</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">3</span>
                    <span>The CTGAN model trains on your data to learn statistical patterns</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">4</span>
                    <span>Download your synthetic dataset with quality metrics report</span>
                  </li>
                </ol>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Enterprise Ready
                </h2>
                <p className="text-muted-foreground">
                  DataCraft is designed for enterprise use cases including data sharing, 
                  machine learning model training, software testing, and regulatory compliance. 
                  Generate unlimited synthetic data while maintaining full privacy compliance.
                </p>
              </div>

              <div className="text-center pt-4">
                <Link to="/">
                  <Button variant="glow" size="lg">
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