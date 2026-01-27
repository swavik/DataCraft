import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Message sent! We will get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Have questions about DataCraft? Our team is here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                  Whether you're looking for enterprise solutions, have technical questions, or just want to say hello, we'd love to hear from you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Email</h4>
                    <p className="text-muted-foreground">support@datacraft.ai</p>
                    <p className="text-muted-foreground">sales@datacraft.ai</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Phone</h4>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-muted-foreground">Mon-Fri from 9am to 6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Office</h4>
                    <p className="text-muted-foreground">123 Innovation Drive</p>
                    <p className="text-muted-foreground">Tech City, TC 54321</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border">
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Globe className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">First Name</label>
                    <Input placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">Last Name</label>
                    <Input placeholder="Doe" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Email Address</label>
                  <Input placeholder="john@example.com" type="email" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Subject</label>
                  <Input placeholder="How can we help?" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Message</label>
                  <Textarea 
                    placeholder="Tell us about your project or questions..." 
                    className="min-h-[150px] resize-none" 
                    required 
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-lg font-bold gap-2">
                  <Send className="w-5 h-5" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
