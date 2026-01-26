import { useNavigate } from 'react-router-dom';
import { Database, ArrowRight, Shield, Layers, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import authBg from '@/assets/auth-background.jpg';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans">
      {/* Background - Matches AuthPage exactly */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${authBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50 backdrop-blur-[2px]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-6 lg:px-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">DataCraft</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/auth')}
              className="text-foreground font-medium hover:text-primary transition-colors px-4"
            >
              Login
            </button>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-6"
            >
              Get Started
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-2 text-primary font-semibold animate-fade-in">
            <Sparkles className="w-5 h-5" />
            <span>AI-Powered Synthetic Data Generation</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight">
            The Future of Data <br />
            <span className="gradient-text">Privacy is Here</span>
          </h1>

          <p className="text-xl text-muted-foreground/80 max-w-2xl leading-relaxed">
            Transform your datasets into privacy-safe synthetic data using advanced 
            CTGAN technology. Maintain statistical properties while protecting 
            sensitive information.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground py-7 px-10 text-lg font-semibold group rounded-2xl shadow-xl"
            >
              Start Generating
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="backdrop-blur-md bg-white/10 border-white/20 py-7 px-10 text-lg font-semibold rounded-2xl hover:bg-white/20"
            >
              Learn More
            </Button>
          </div>

          {/* Feature Cards - Using your specific Lucide icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
            {[
              { 
                icon: Shield, 
                title: "Privacy First", 
                desc: "Your data stays protected with advanced privacy techniques" 
              },
              { 
                icon: Layers, 
                title: "High Quality", 
                desc: "Realistic synthetic data that maintains statistical properties" 
              },
              { 
                icon: Sparkles, 
                title: "CTGAN Powered", 
                desc: "Leveraging state-of-the-art AI for superior results" 
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-6 text-left space-y-3 shadow-lg"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-sm text-muted-foreground/60">
          © 2026 DataCraft AI. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;