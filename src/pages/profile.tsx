import { User, Mail, Phone, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { signOut, profile, user, loading } = useAuth();
  const navigate = useNavigate();

  // Use actual profile data from Supabase
  const userDetails = profile ? {
    name: profile.full_name || 'N/A',
    email: profile.email || user?.email || 'N/A',
    phone: profile.phone_number || 'N/A'
  } : null;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="container mx-auto py-10 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">Unable to load profile data.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground tracking-tight">User Profile</h1>
        
        <Card className="border-border/50 bg-card/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-8 pt-8 border-b border-border/50">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-inner">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
                  Account Details
                </CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage your personal contact information
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-10">
            {/* Displaying information one by one in a vertical stack */}
            <div className="flex flex-col gap-8">
              <ProfileItem 
                icon={User} 
                label="Username" 
                value={userDetails.name} 
              />
              <ProfileItem 
                icon={Mail} 
                label="Email Address" 
                value={userDetails.email} 
              />
              <ProfileItem 
                icon={Phone} 
                label="Phone Number" 
                value={userDetails.phone} 
              />
            </div>

            {/* Centered Logout Button Section */}
            <div className="pt-8 border-t border-border/50 flex justify-center">
              <Button 
                variant="destructive" 
                className="flex items-center gap-2 px-10 py-6 text-base shadow-lg hover:shadow-destructive/20 transition-all"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                Logout from Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-start gap-5 group">
    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div className="flex flex-col gap-1">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
        {label}
      </p>
      <p className="text-lg font-medium text-foreground tracking-tight">
        {value}
      </p>
    </div>
  </div>
);

export default Profile;