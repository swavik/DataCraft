import { Upload, Settings, Play, FileCheck } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Data",
    description: "Securely upload your CSV dataset. We analyze the schema and statistical properties automatically."
  },
  {
    icon: Settings,
    title: "Configure Model",
    description: "Choose your preferred generation model (CTGAN, VAE, etc.) and customize parameters."
  },
  {
    icon: Play,
    title: "Generate",
    description: "Our AI learns the patterns in your data and generates new, synthetic records from scratch."
  },
  {
    icon: FileCheck,
    title: "Validate & Export",
    description: "Review quality metrics, compare distributions, and download your privacy-safe dataset."
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From raw data to synthetic insights in four simple steps.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center bg-background p-6 rounded-xl border border-border shadow-sm">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-6 text-2xl font-bold shadow-lg">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
