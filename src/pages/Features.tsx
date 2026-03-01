import { LandingLayout } from "@/components/layout/LandingLayout";
import { FeaturesSection } from "@/components/landing/FeaturesSection";

const Features = () => {
  return (
    <LandingLayout>
      <div className="h-[calc(100vh-80px)] flex flex-col justify-center py-4">
        <FeaturesSection />
      </div>
    </LandingLayout>
  );
};

export default Features;
