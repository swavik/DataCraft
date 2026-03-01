import { User, Mail, Phone, LogOut, BarChart3, TrendingUp, Shield, Copy, Edit3, Settings, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDatasetHistory } from "@/hooks/useDatasetHistory";
import { useState } from "react";

const Profile = () => {
  const { signOut, profile, user, loading } = useAuth();
  const { history } = useDatasetHistory();
  const navigate = useNavigate();
  const [showAccountDetailsModal, setShowAccountDetailsModal] = useState(false);

  // Use actual profile data from Supabase
  const userDetails = profile ? {
    name: profile.full_name || 'N/A',
    email: profile.email || user?.email || 'N/A',
    phone: profile.phone_number || 'N/A'
  } : null;

  // Calculate dashboard metrics from history
  const totalSamples = history.reduce((sum, item) => sum + (item.hasSynthetic ? item.rowCount * 2 : item.rowCount), 0);
  const averageFidelity = history.length > 0 
    ? (history.reduce((sum, item) => {
        if (item.qualityReport?.qualityLevel === 'excellent') return sum + 95;
        if (item.qualityReport?.qualityLevel === 'good') return sum + 80;
        return sum + 65;
      }, 0) / history.length).toFixed(1)
    : '0.0';
  const privacyScore = (98.7).toFixed(1); // Default high privacy score

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
      <div className="max-w-7xl mx-auto">
        {/* Main Grid: Account Details + Dashboard Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Account Details Card */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 bg-card/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl h-full">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-6 pt-6 border-b border-border/50 text-center">
                <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center gap-6">
                  {/* Avatar Circle with Initials */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center border-2 border-primary/20 shadow-lg">
                    <span className="text-3xl font-bold text-primary">
                      {getInitials(userDetails?.name || 'U')}
                    </span>
                  </div>

                  {/* User Info */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {userDetails?.name || 'N/A'}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {userDetails?.email || 'N/A'}
                    </p>
                  </div>

                  {/* Menu Options */}
                  <div className="pt-6 w-full border-t border-border/30 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-primary/5 transition-colors group">
                      <Edit3 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium">Edit Profile</span>
                    </button>
                    <button onClick={() => setShowAccountDetailsModal(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-primary/5 transition-colors group">
                      <User className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium">Account Details</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-4 w-full">
                    <Button 
                      variant="destructive" 
                      className="w-full flex items-center justify-center gap-2 py-5 shadow-lg hover:shadow-destructive/20 transition-all"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top 3 Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-border/50 bg-card/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                        Total Samples
                      </p>
                      <p className="text-3xl font-bold text-foreground">{totalSamples}</p>
                      <p className="text-xs text-muted-foreground mt-1">Total generated records</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                        Average Fidelity
                      </p>
                      <p className="text-3xl font-bold text-foreground">{averageFidelity}%</p>
                      <p className="text-xs text-muted-foreground mt-1">Based on quality reports</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                        Privacy Score
                      </p>
                      <p className="text-3xl font-bold text-foreground">{privacyScore}</p>
                      <p className="text-xs text-muted-foreground mt-1">Aggregate protection level</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-border/50 bg-card/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-6 pt-6 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground tracking-tight">
                      Recent Activity
                    </CardTitle>
                    <p className="text-muted-foreground text-xs mt-1">
                      Your latest actions and generations
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
                    View All
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {history.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">No activity yet. Start by uploading a dataset!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.slice(0, 5).map((item, index) => (
                      <div key={item.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-primary/5 transition-colors group cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.hasSynthetic ? 'Generated' : 'Uploaded'} dataset: {item.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(item.uploadedAt).toLocaleDateString()} • {item.rowCount} rows
                          </p>
                        </div>
                        {item.hasSynthetic && (
                          <div className="flex-shrink-0 px-2 py-1 bg-success/10 rounded text-xs font-medium text-success">
                            Generated
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Account Details Modal */}
        {showAccountDetailsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <Card className="border-border/50 bg-card backdrop-blur-md rounded-2xl overflow-hidden shadow-xl w-full max-w-md">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-6 pt-6 border-b border-border/50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-foreground tracking-tight">
                    Account Details
                  </CardTitle>
                </div>
                <button 
                  onClick={() => setShowAccountDetailsModal(false)}
                  className="p-1 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                <div className="flex flex-col gap-6">
                  <ProfileItem 
                    icon={User} 
                    label="Username" 
                    value={userDetails?.name || 'N/A'} 
                  />
                  <ProfileItem 
                    icon={Mail} 
                    label="Email Address" 
                    value={userDetails?.email || 'N/A'} 
                  />
                  <ProfileItem 
                    icon={Phone} 
                    label="Phone Number" 
                    value={userDetails?.phone || 'N/A'} 
                  />
                </div>

                <div className="pt-6 border-t border-border/50 flex gap-3">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAccountDetailsModal(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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