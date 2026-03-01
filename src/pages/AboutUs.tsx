import { LandingLayout } from "@/components/layout/LandingLayout";
import { Shield, Target, Users, Code2 } from "lucide-react";

const AboutUs = () => {
  return (
    <LandingLayout>
      <div className="h-[calc(100vh-80px)] px-6 max-w-7xl mx-auto flex flex-col justify-center py-4">
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold text-[#E87B64] tracking-[0.3em] uppercase mb-2">About DataCraft</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3 tracking-tight">Privacy-Preserving Data for Modern Analytics</h1>
          <p className="text-[15px] text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Empowering organizations to unlock the value of their data while ensuring absolute privacy protection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto w-full">
          <div className="bg-[#FAF8F6] rounded-[2.5rem] p-10 border border-gray-100/50 shadow-sm flex flex-col justify-center">
            <p className="text-[10px] font-bold text-[#E87B64] tracking-[0.3em] uppercase mb-3">Our Mission</p>
            <h2 className="text-3xl font-bold text-foreground mb-6">Empowering Data Privacy</h2>
            <div className="space-y-4">
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                DataCraft was born from a simple idea: making high-quality synthetic data accessible to everyone while ensuring absolute privacy protection.
              </p>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                We enable organizations to unlock the value of their data while maintaining strict privacy compliance and preserving analytical utility through state-of-the-art machine learning.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {[
              {
                icon: Shield,
                title: "Privacy First",
                description: "We believe privacy is a fundamental human right, not a luxury."
              },
              {
                icon: Target,
                title: "Quality Driven",
                description: "Synthetic data is only useful if it maintains statistical integrity."
              },
              {
                icon: Users,
                title: "Community Focused",
                description: "Building tools that empower teams to collaborate without friction."
              },
              {
                icon: Code2,
                title: "Open Innovation",
                description: "Using the best open-source technologies to push boundaries."
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-5 p-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#FDF2F0] flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-[#E87B64]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-foreground mb-0.5">{item.title}</h3>
                  <p className="text-[13px] text-muted-foreground/70 leading-snug">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default AboutUs;
