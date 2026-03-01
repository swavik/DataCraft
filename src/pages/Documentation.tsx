import { useNavigate } from 'react-router-dom';
import { LandingLayout } from '@/components/layout/LandingLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, Settings, Zap, BarChart3, ClipboardList, Download } from 'lucide-react';

const steps = [
  {
    title: 'Data Upload',
    bullets: [
      'Import your sensitive datasets in CSV, Excel, or JSON format. Our system automatically analyzes the schema and detects column types (numerical, categorical, datetime).',
      'Support for CSV, XLSX, and JSON',
      'Data quality assessment and missing value analysis'
    ],
    icon: Database
  },
  {
    title: 'Model Configuration',
    bullets: [
      'Choose from CTGAN, VAE, or Gaussian Copula',
      'Privacy budget (Epsilon) control and model-specific tuning',
      'Customizable training epochs and hyperparameters'
    ],
    icon: Settings
  },
  {
    title: 'Synthetic Generation',
    bullets: [
      'High-fidelity record generation with preservation of complex correlations',
      'Anonymization by design and scalable processing'
    ],
    icon: Zap
  },
  {
    title: 'Quality Validation',
    bullets: [
      'Statistical similarity scores and correlation matrix analysis',
      'Distribution comparison charts and privacy leak detection'
    ],
    icon: BarChart3
  },
  {
    title: 'Export & Integration',
    bullets: [
      'Multi-format export (CSV, JSON, TXT) and API access for automation',
      'Shareable quality reports and GDPR/HIPAA compliant data handoff'
    ],
    icon: Download
  }
];

const Documentation = () => {
  const navigate = useNavigate();

  return (
    <LandingLayout>
      <main className="min-h-[calc(100vh-80px)] px-6 w-full pt-6 pb-12">
        <div className="w-full max-w-3xl mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Documentation</h1>
            <p className="text-sm text-muted-foreground/80 mt-2">
              Learn how to use DataCraft to generate high-quality synthetic data while maintaining maximum privacy.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="relative">
              <div className="absolute left-12 top-8 bottom-8 w-[2px] bg-[#FDECE6]" />

              <div className="space-y-10">
                {steps.map((s, i) => {
                  const Icon = s.icon as any;
                  return (
                    <div key={s.title} className="flex items-start">
                      <div className="w-28 flex justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#E87B64] flex items-center justify-center text-white shadow">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-foreground">{i + 1}. {s.title}</h3>
                        <ul className="list-disc ml-6 mt-2 text-sm text-muted-foreground/80">
                          {s.bullets.map((b, idx) => (
                            <li key={idx} className="mb-1">{b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-rose-50 to-white/10 border border-white/10 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Ready to start?</h4>
                <p className="text-sm text-muted-foreground/80">Transform your sensitive data into privacy-safe synthetic assets today.</p>
              </div>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground py-3 px-6 rounded-2xl"
                onClick={() => navigate('/auth')}
              >
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </LandingLayout>
  );
};

export default Documentation;
