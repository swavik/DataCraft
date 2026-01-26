import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
            <h1 className="text-4xl font-bold mb-6 text-foreground tracking-tight">About DataCraft</h1>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              We are pioneers in privacy-preserving synthetic data generation, helping organizations unlock the power of their data without compromising individual privacy.
            </p>
            
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  What We Do
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass-card p-6 border-l-4 border-l-primary">
                    <h3 className="font-bold mb-2 text-lg">Synthetic Data Generation</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      We create entirely new datasets that mimic the statistical properties of your original data. These datasets contain no real information from individuals, making them 100% privacy-compliant.
                    </p>
                  </div>
                  <div className="glass-card p-6 border-l-4 border-l-primary">
                    <h3 className="font-bold mb-2 text-lg">Privacy Protection</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Our platform ensures that sensitive PII (Personally Identifiable Information) never leaves your environment. We only learn the patterns, never the people.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  How We Do It
                </h2>
                <div className="space-y-6">
                  <div className="relative pl-8 border-l border-border space-y-8">
                    <div className="relative">
                      <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary border-4 border-background" />
                      <h4 className="font-bold mb-1">1. Statistical Analysis</h4>
                      <p className="text-muted-foreground text-sm">We automatically detect data types, correlations, and distributions within your uploaded datasets.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary border-4 border-background" />
                      <h4 className="font-bold mb-1">2. Generative AI Training</h4>
                      <p className="text-muted-foreground text-sm">Our platform leverages state-of-the-art models like CTGAN, VAE, and Gaussian Copulas to learn the underlying mathematical structure of your data.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary border-4 border-background" />
                      <h4 className="font-bold mb-1">3. Privacy-Safe Synthesis</h4>
                      <p className="text-muted-foreground text-sm">New records are generated from scratch based on learned patterns, ensuring zero referential link to any real-world individual.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary border-4 border-background" />
                      <h4 className="font-bold mb-1">4. Quality Validation</h4>
                      <p className="text-muted-foreground text-sm">We provide comprehensive statistical reports comparing the utility and fidelity of the synthetic data against the original source.</p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="glass-card p-8 bg-primary/5 border-primary/20">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  DataCraft was founded with a clear mission: to democratize data access while upholding the highest standards of privacy. We believe that innovation shouldn't be stalled by privacy concerns, and individual privacy shouldn't be sacrificed for progress. Our tools bridge this gap by providing high-fidelity, privacy-safe alternatives to real data.
                </p>
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
      <Footer />
    </div>
  );
};

export default About;