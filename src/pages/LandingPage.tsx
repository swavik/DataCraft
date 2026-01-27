import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Zap, 
  BarChart3, 
  Users, 
  Cpu, 
  Globe, 
  Mail,
  CheckCircle2,
  FileText,
  Settings,
  Download,
  Target,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const LandingPage = () => {
  return (
    <div id="home" className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-card">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-muted-foreground text-sm font-medium mb-10 shadow-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            Privacy-First Synthetic Data Generation
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 text-foreground tracking-tight max-w-5xl mx-auto leading-[1.1] animate-fade-up">
            Your Trusted Synthetic Data Partner
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Generate privacy-preserving synthetic datasets using CTGAN, VAE, and Gaussian Copula with real-time quality analysis and comprehensive statistical validation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Button asChild size="xl" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-all">
              <Link to="/upload">
                Start Generating
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="h-14 px-10 text-lg border-border text-primary bg-card hover:bg-background rounded-lg shadow-sm" asChild>
              <Link to="/documentation">View Documentation</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-5 p-6 bg-card rounded-2xl border border-secondary shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center border border-secondary">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-foreground text-lg">Privacy First</h3>
                <p className="text-muted-foreground text-sm">GDPR Compliant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-5 p-6 bg-card rounded-2xl border border-secondary shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center border border-secondary">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-foreground text-lg">Fast Generation</h3>
                <p className="text-muted-foreground text-sm">Real-time Processing</p>
              </div>
            </div>
            
            <div className="flex items-center gap-5 p-6 bg-card rounded-2xl border border-secondary shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center border border-secondary">
                <BarChart3 className="w-7 h-7 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-foreground text-lg">Quality Metrics</h3>
                <p className="text-muted-foreground text-sm">Statistical Validation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About DataCraft Section - From Screenshot 1 */}
      <section id="about" className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <span className="text-primary font-bold tracking-wider text-sm mb-4 block">ABOUT DATACRAFT</span>
              <h2 className="text-5xl font-bold text-foreground mb-8 leading-tight">
                Privacy-Preserving Data for Modern Analytics
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                DataCraft is a privacy-preserving synthetic data generation platform powered by state-of-the-art machine learning technology. We enable organizations to unlock the value of their data while maintaining strict privacy compliance and maintaining analytical utility.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-background border border-secondary flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg">What is CTGAN?</h4>
                    <p className="text-muted-foreground">CTGAN (Conditional Tabular GAN) is a generative adversarial network designed specifically for tabular data. It learns statistical patterns and generates new records that maintain distributions without exposing real data.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-background border border-secondary flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg">Enterprise Ready</h4>
                    <p className="text-muted-foreground">Designed for enterprise use cases including data sharing, ML model training, software testing, and regulatory compliance (GDPR & HIPAA).</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-background border border-secondary flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg">Fidelity Scoring</h4>
                    <p className="text-muted-foreground">We use industry-standard libraries to calculate comprehensive fidelity scores, ensuring your synthetic data is as useful as your real data.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="bg-primary rounded-[2.5rem] p-12 text-primary-foreground text-center aspect-[1.2/1] flex flex-col items-center justify-center shadow-2xl">
                <div className="text-[7rem] font-bold leading-none mb-4">99.2%</div>
                <div className="text-2xl font-bold mb-4 tracking-wide">Statistical Similarity</div>
                <p className="text-primary-foreground/70 max-w-sm mx-auto">Average correlation preservation across generated datasets</p>
              </div>
              
              <div className="absolute -bottom-10 -left-10 bg-card rounded-2xl p-6 shadow-xl border border-secondary">
                <div className="text-3xl font-bold text-foreground">10M+</div>
                <div className="text-sm text-muted-foreground">Records Generated</div>
              </div>
              
              <div className="absolute -top-10 -right-4 bg-card rounded-2xl p-6 shadow-xl border border-secondary">
                <div className="text-3xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Enterprise Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - From Screenshot 2 */}
      <section id="how-it-works" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary font-bold tracking-widest text-xs mb-4 block uppercase tracking-wide">How It Works</span>
            <h2 className="text-5xl font-bold text-foreground mb-6">Generate Synthetic Data in Minutes</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A simple four-step process to transform your sensitive data into privacy-preserving synthetic datasets.
            </p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2 hidden lg:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl relative group">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center text-xs font-bold text-foreground shadow-sm">01</div>
                  <Database className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Upload Your Data</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Import your original dataset in CSV, Excel, or JSON format. We automatically detect column types and data schema.
                </p>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl relative group">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center text-xs font-bold text-foreground shadow-sm">02</div>
                  <Settings className="w-8 h-8 text-primary-foreground group-hover:rotate-45 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Configure Settings</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Select your preferred generation model (CTGAN, VAE, or Gaussian Copula) and adjust parameters for optimal results.
                </p>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl relative group">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center text-xs font-bold text-foreground shadow-sm">03</div>
                  <Zap className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Generate Synthetic Data</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Our algorithms learn the statistical patterns and generate new, privacy-preserving synthetic records.
                </p>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl relative group">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center text-xs font-bold text-foreground shadow-sm">04</div>
                  <Download className="w-8 h-8 text-primary-foreground group-hover:translate-y-1 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Analyze & Export</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Review quality metrics, compare distributions side-by-side, and export your synthetic dataset.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Generation Models Section - From Screenshot 3 */}
      <section id="models" className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest text-xs mb-4 block uppercase tracking-wide">Generation Models</span>
            <h2 className="text-5xl font-bold text-foreground">Choose Your Generation Algorithm</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Three powerful models tailored for different data characteristics and use cases. Select the one that best fits your requirements.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* CTGAN Card */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Cpu className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="px-3 py-1 bg-secondary text-primary text-xs font-bold rounded-full">Most Popular</div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">CTGAN</h3>
              <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">Conditional Tabular GAN</p>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                A generative adversarial network specifically designed for tabular data with mixed column types. It uses a conditional generator to handle imbalanced categorical columns.
              </p>
              
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Best For</h4>
                <p className="text-sm font-medium text-foreground">Mixed datasets with complex dependencies and imbalanced categories.</p>
              </div>

              <div className="mt-auto space-y-3">
                <ModelBullet text="Excellent at capturing complex correlations" />
                <ModelBullet text="Handles mixed data types (numerical + categorical)" />
                <ModelBullet text="Stable training for tabular data" />
                <ModelBullet text="State-of-the-art fidelity" />
              </div>
            </div>

            {/* VAE Card */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Activity className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="px-3 py-1 bg-secondary text-primary text-xs font-bold rounded-full">Fast Training</div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">VAE</h3>
              <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">Variational Autoencoder</p>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Uses a variational autoencoder architecture to learn a compressed representation of the data. Often faster than GAN-based models while maintaining quality.
              </p>

              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Best For</h4>
                <p className="text-sm font-medium text-foreground">Fast generation and datasets where global distribution preservation is key.</p>
              </div>

              <div className="mt-auto space-y-3">
                <ModelBullet text="Fast training and generation" />
                <ModelBullet text="Good at capturing overall distributions" />
                <ModelBullet text="Stably converges every time" />
                <ModelBullet text="Lower resource requirements" />
              </div>
            </div>

            {/* Gaussian Copula Card */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="px-3 py-1 bg-secondary text-primary text-xs font-bold rounded-full">Interpretable</div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Gaussian Copula</h3>
              <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">Gaussian Copula Model</p>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                A statistical model that uses copula theory to model dependency structure. It's extremely fast, mathematically robust, and deterministic.
              </p>

              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Best For</h4>
                <p className="text-sm font-medium text-foreground">Small to medium datasets where statistical properties must be strictly preserved.</p>
              </div>

              <div className="mt-auto space-y-3">
                <ModelBullet text="Extremely fast (near instant)" />
                <ModelBullet text="Perfect preservation of marginals" />
                <ModelBullet text="No training required (deterministic)" />
                <ModelBullet text="Very low memory footprint" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - From Screenshot 4 */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-20">
            <span className="text-primary font-bold tracking-widest text-xs mb-4 block uppercase tracking-wide">Features</span>
            <h2 className="text-5xl font-bold text-foreground mb-6 tracking-tight">Everything You Need for Synthetic Data</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive tools for generating, validating, and analyzing privacy-preserving synthetic datasets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard 
              icon={<Database className="w-6 h-6 text-primary-foreground" />}
              title="Multi-Format Support"
              description="Upload CSV, Excel, or JSON files. Export synthetic data in your preferred format with full schema preservation."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-primary-foreground" />}
              title="Privacy Preservation"
              description="Generate data that maintains statistical properties while ensuring no original records can be reconstructed."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-primary-foreground" />}
              title="Quality Analysis"
              description="Comprehensive statistical validation including distribution comparison, correlation analysis, and similarity scores."
            />
            <FeatureCard 
              icon={<Database className="w-6 h-6 text-primary-foreground" />}
              title="Multiple Models"
              description="Choose from CTGAN, VAE, or Gaussian Copula based on your data characteristics and use cases."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-primary-foreground" />}
              title="Iterative Refinement"
              description="Adjust parameters and regenerate until you achieve the desired data quality and fidelity scores."
            />
            <FeatureCard 
              icon={<FileText className="w-6 h-6 text-primary-foreground" />}
              title="Data Validation"
              description="Automatic validation checks ensure generated data meets schema constraints and semantic rules."
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-foreground mb-6">Contact Us</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about synthetic data or need technical support? Our team is here to help you navigate your data privacy journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-start">
            <div className="space-y-12">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h3>
                <p className="text-muted-foreground text-lg">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
              </div>
              
              <div className="space-y-8">
                <ContactInfoItem 
                  icon={<Mail className="w-6 h-6" />}
                  title="Email"
                  content={["support@datacraft.ai", "hello@datacraft.ai"]}
                />
                <ContactInfoItem 
                  icon={<Zap className="w-6 h-6 rotate-12" />} // Placeholder for Phone as per screenshot style
                  title="Phone"
                  content={["+1 (555) 123-4567"]}
                />
                <ContactInfoItem 
                  icon={<Globe className="w-6 h-6" />} // Placeholder for Office
                  title="Office"
                  content={["100 Innovation Way", "San Francisco, CA 94105"]}
                />
              </div>
            </div>
            
            <div className="bg-background border border-secondary rounded-[2rem] p-10 shadow-sm">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground ml-1">First Name</label>
                    <Input placeholder="Jane" className="h-14 bg-card border-secondary rounded-xl text-base" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground ml-1">Last Name</label>
                    <Input placeholder="Doe" className="h-14 bg-card border-secondary rounded-xl text-base" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground ml-1">Email</label>
                  <Input placeholder="jane@example.com" type="email" className="h-14 bg-card border-secondary rounded-xl text-base" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground ml-1">Subject</label>
                  <Input placeholder="How can we help?" className="h-14 bg-card border-secondary rounded-xl text-base" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground ml-1">Message</label>
                  <Textarea placeholder="Tell us more about your needs..." className="min-h-[160px] bg-card border-secondary rounded-xl text-base resize-none" />
                </div>
                
                <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-xl shadow-md transition-all">
                  <Mail className="mr-2 w-5 h-5" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                <Database className="w-5 h-5 text-background" />
              </div>
              <span className="text-2xl font-bold text-foreground">DataCraft</span>
            </div>
            <div className="flex gap-10 text-base font-medium text-muted-foreground">
              <Link to="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link to="#" className="hover:text-foreground transition-colors">Cookies</Link>
            </div>
            <p className="text-base text-muted-foreground/60">
              © 2026 DataCraft Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ContactInfoItem = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string[] }) => (
  <div className="flex gap-6 items-start group">
    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
      {icon}
    </div>
    <div>
      <h4 className="text-xl font-bold text-foreground mb-2">{title}</h4>
      {content.map((item, idx) => (
        <p key={idx} className="text-muted-foreground text-lg leading-relaxed">{item}</p>
      ))}
    </div>
  </div>
);

const ModelItem = ({ text }: { text: string }) => (
  <li className="flex items-center gap-4 group">
    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
      <CheckCircle2 className="w-4 h-4" />
    </div>
    <span className="font-bold text-foreground text-lg">{text}</span>
  </li>
);

const ModelBullet = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-primary flex-shrink-0">
      <CheckCircle2 className="w-3 h-3" />
    </div>
    <span className="text-muted-foreground text-sm">{text}</span>
  </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 bg-card border border-border rounded-3xl text-left hover:shadow-lg transition-all duration-300 group">
    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;
