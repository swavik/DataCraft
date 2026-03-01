import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingLayout } from '@/components/layout/LandingLayout';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleStart = () => {
    if (loading) return;
    if (user) {
      navigate('/home');
    } else {
      navigate('/auth');
    }
  }

  return (
    <LandingLayout>
      <main className="min-h-[calc(100vh-80px)] flex flex-col items-center px-6 text-center max-w-5xl mx-auto w-full justify-center">
        <div className="flex flex-col items-center justify-center space-y-6 w-full py-4">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/20 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-foreground/70 tracking-wide">
              Privacy-First Synthetic Data Generation
            </span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
            The Future of Data <br />
            <span className="gradient-text">Privacy is Here</span>
          </h1>

          <p className="text-lg text-muted-foreground/80 max-w-2xl leading-relaxed">
            Transform your datasets into privacy-safe synthetic data using advanced 
            CTGAN technology. Maintain statistical properties while protecting 
            sensitive information.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button 
              size="lg"
              onClick={handleStart}
              className="bg-accent hover:bg-accent/90 text-accent-foreground py-6 px-10 text-lg font-semibold group rounded-2xl shadow-xl"
            >
              Start Generating
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="backdrop-blur-md bg-white/10 border-white/20 py-6 px-10 text-lg font-semibold rounded-2xl hover:bg-white/20"
              onClick={() => navigate('/documentation')}
            >
              View Documentation
            </Button>
          </div>
        </div>

        {/* Small Feature Cards - Bottom Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-4 w-full max-w-4xl">
          {[
            { 
              icon: Shield, 
              title: "Privacy First", 
              desc: "GDPR Compliant" 
            },
            { 
              icon: Zap, 
              title: "Fast Generation", 
              desc: "Real-time Processing" 
            },
            { 
              icon: BarChart3, 
              title: "Quality Metrics", 
              desc: "Statistical Validation" 
            }
          ].map((feature, i) => (
            <div 
              key={i}
              className="backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FDF2F0] flex items-center justify-center shrink-0 shadow-sm">
                <feature.icon className="w-6 h-6 text-[#E87B64]" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-base text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground/80">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </LandingLayout>
  );
};

export default LandingPage;
