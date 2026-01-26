import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  BookOpen, 
  Database, 
  Layers, 
  Shield, 
  Zap, 
  CheckCircle,
  HelpCircle,
  Code
} from "lucide-react";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-4 tracking-tight">Documentation</h1>
              <p className="text-xl text-muted-foreground">
                Learn how DataCraft helps you generate high-fidelity, privacy-preserving synthetic data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sidebar Navigation - Simplified for now */}
              <div className="md:col-span-1">
                <nav className="sticky top-24 space-y-2">
                  <a href="#introduction" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
                    <BookOpen className="w-4 h-4" />
                    Introduction
                  </a>
                  <a href="#how-it-works" className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                    <Zap className="w-4 h-4" />
                    How It Works
                  </a>
                  <a href="#data-privacy" className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                    <Shield className="w-4 h-4" />
                    Data Privacy
                  </a>
                  <a href="#algorithms" className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                    <Layers className="w-4 h-4" />
                    Algorithms
                  </a>
                  <a href="#faq" className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                    <HelpCircle className="w-4 h-4" />
                    FAQ
                  </a>
                </nav>
              </div>

              {/* Main Content */}
              <div className="md:col-span-2 space-y-16">
                {/* Introduction */}
                <section id="introduction">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    What is DataCraft?
                  </h2>
                  <div className="prose prose-slate max-w-none text-muted-foreground space-y-4">
                    <p>
                      DataCraft is a state-of-the-art synthetic data generation platform designed to help organizations share, analyze, and develop with data while maintaining absolute individual privacy.
                    </p>
                    <p>
                      Synthetic data is artificially generated data that mimics the statistical properties, correlations, and distributions of real-world datasets without containing any information from real individuals.
                    </p>
                    <div className="bg-muted p-4 rounded-xl border border-border mt-6">
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Key Benefits
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <li>• 100% Privacy Compliant</li>
                        <li>• Retains Data Utility</li>
                        <li>• Overcomes Data Scarcity</li>
                        <li>• Bias Mitigation</li>
                        <li>• Safe Data Sharing</li>
                        <li>• Unlimited Scaling</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    How It Works
                  </h2>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">1</div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">Upload & Analyze</h3>
                        <p className="text-muted-foreground text-sm">Upload your CSV dataset. DataCraft automatically detects data types, distributions, and relationships between columns.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">2</div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">Model Training</h3>
                        <p className="text-muted-foreground text-sm">Our AI models (CTGAN, VAE, etc.) learn the underlying mathematical patterns of your data without memorizing individual records.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">3</div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">Generation</h3>
                        <p className="text-muted-foreground text-sm">The trained model generates entirely new data records that follow the learned patterns.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">4</div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">Validation</h3>
                        <p className="text-muted-foreground text-sm">A comprehensive quality report compares the real and synthetic data to ensure high fidelity and utility.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Algorithms */}
                <section id="algorithms">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Layers className="w-6 h-6 text-primary" />
                    Core Algorithms
                  </h2>
                  <div className="space-y-4">
                    <div className="glass-card p-6 border-l-4 border-l-primary">
                      <h3 className="font-bold mb-2">CTGAN (Conditional Tabular GAN)</h3>
                      <p className="text-sm text-muted-foreground">
                        A generative adversarial network designed specifically for tabular data. It handles imbalanced categorical columns and multi-modal continuous columns effectively.
                      </p>
                    </div>
                    <div className="glass-card p-6 border-l-4 border-l-primary">
                      <h3 className="font-bold mb-2">TVAE (Tabular Variational Autoencoder)</h3>
                      <p className="text-sm text-muted-foreground">
                        Uses an encoder-decoder architecture to learn a compressed representation of the data, providing stable training and high-quality synthesis for complex datasets.
                      </p>
                    </div>
                    <div className="glass-card p-6 border-l-4 border-l-primary">
                      <h3 className="font-bold mb-2">Gaussian Copula</h3>
                      <p className="text-sm text-muted-foreground">
                        A statistical model that captures the dependence structure between variables using marginal distributions and a correlation matrix. Fast and efficient for many use cases.
                      </p>
                    </div>
                  </div>
                </section>

                {/* FAQ */}
                <section id="faq">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-primary" />
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-foreground mb-2">Is the synthetic data really private?</h4>
                      <p className="text-sm text-muted-foreground">Yes. Because the records are generated from scratch based on statistical patterns rather than being modified versions of real records, there is no one-to-one mapping to real individuals.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-2">How accurate is the synthetic data?</h4>
                      <p className="text-sm text-muted-foreground">DataCraft typically achieves over 90% statistical similarity. Our validation reports provide detailed metrics on mean, variance, and correlation maintenance.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-2">Can I use this for Machine Learning?</h4>
                      <p className="text-sm text-muted-foreground">Absolutely. Synthetic data generated by DataCraft is ideal for training ML models when real data is restricted or unavailable.</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Documentation;
