import { useState } from "react";
import { LandingLayout } from "@/components/layout/LandingLayout";
import { Mail, Zap, Globe, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            message: formData.message
          }
        ]);

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <LandingLayout>
      <div className="h-[calc(100vh-80px)] px-6 max-w-7xl mx-auto flex flex-col justify-center py-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">Contact Us</h1>
          <p className="text-[15px] text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Have questions about synthetic data or need technical support? Our team is here to help you navigate your data privacy journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-4xl mx-auto w-full">
          <div className="space-y-10 pt-4">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Get in Touch</h2>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-11 h-11 rounded-2xl bg-[#FDF2F0] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#E87B64]" />
                </div>
                <div className="pt-0.5">
                  <p className="text-[15px] font-bold text-foreground mb-0.5">Email</p>
                  <p className="text-[13px] text-muted-foreground leading-snug">support@datacraft.ai</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-11 h-11 rounded-2xl bg-[#FDF2F0] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-[#E87B64]" />
                </div>
                <div className="pt-0.5">
                  <p className="text-[15px] font-bold text-foreground mb-0.5">Phone</p>
                  <p className="text-[13px] text-muted-foreground leading-snug">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-11 h-11 rounded-2xl bg-[#FDF2F0] flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-[#E87B64]" />
                </div>
                <div className="pt-0.5">
                  <p className="text-[15px] font-bold text-foreground mb-0.5">Office</p>
                  <p className="text-[13px] text-muted-foreground leading-snug">San Francisco, CA 94105</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF8F6] rounded-[2rem] p-8 border border-gray-100/50 shadow-sm">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Message Received!</h3>
                <p className="text-muted-foreground max-w-[250px]">
                  Thank you for reaching out. Our team will contact you shortly.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-foreground">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jane"
                      className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#E87B64]/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-foreground">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#E87B64]/10 transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-foreground">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#E87B64]/10 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-foreground">Message</label>
                  <textarea 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tell us more about your needs..."
                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#E87B64]/10 transition-all resize-none"
                  ></textarea>
                </div>

                <Button 
                  disabled={isSubmitting}
                  className="w-full bg-[#E87B64] hover:bg-[#D66A54] text-white py-6 rounded-xl text-[15px] font-bold transition-all flex items-center justify-center gap-2 mt-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default Contact;

