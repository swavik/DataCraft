import { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  Calendar, 
  Camera,
  Briefcase,
  ExternalLink,
  Phone,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || ''
  });
  
  if (!user) return null;

  const userInitials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      phoneNumber: user.phoneNumber || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container mx-auto px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - User Overview */}
            <div className="md:w-1/3 lg:w-1/4 space-y-6">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="pt-8 text-center p-6">
                  <div className="relative inline-block mb-6">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-3xl bg-primary/10 text-primary">{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-1 right-1">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="rounded-full h-8 w-8 border-2 border-background shadow-sm"
                      >
                        <Camera className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-primary font-medium mb-6">{user.role}</p>
                  
                  <div className="flex flex-col gap-4 text-left px-2">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{user.organization}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {user.joinedDate}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex flex-col gap-3">
                    <Button 
                      className="w-full h-11 text-base font-semibold"
                      onClick={() => setIsEditing(true)}
                      disabled={isEditing}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="flex-1 space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Personal Information</CardTitle>
                  <CardDescription>Update your personal details and how others see you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground/80">Full Name</label>
                      {isEditing ? (
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="pl-10 h-12 bg-muted/30 border-none focus-visible:ring-primary/20"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-xl border border-border/40 transition-colors hover:bg-muted/50">
                          <UserIcon className="h-5 w-5 text-primary/70" />
                          <span className="text-sm font-medium">{user.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground/80">Email Address</label>
                      <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-xl border border-border/40 opacity-70">
                        <Mail className="h-5 w-5 text-primary/70" />
                        <span className="text-sm font-medium">{user.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground/80">Phone Number</label>
                      {isEditing ? (
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="pl-10 h-12 bg-muted/30 border-none focus-visible:ring-primary/20"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-xl border border-border/40 hover:bg-muted/50 transition-colors">
                          <Phone className="h-5 w-5 text-primary/70" />
                          <span className="text-sm font-medium">{user.phoneNumber || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground/80">Member Since</label>
                      <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-xl border border-border/40 hover:bg-muted/50 transition-colors">
                        <Calendar className="h-5 w-5 text-primary/70" />
                        <span className="text-sm font-medium">{user.joinedDate}</span>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex items-center justify-end gap-3 pt-4 animate-in fade-in slide-in-from-bottom-2">
                      <Button variant="outline" onClick={handleCancel} className="h-11 px-8">
                        Cancel
                      </Button>
                      <Button onClick={handleSave} className="h-11 px-8 font-semibold shadow-sm">
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
