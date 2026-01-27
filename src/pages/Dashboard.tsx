import React from 'react';
import { 
  User, 
  Settings, 
  Activity, 
  Database, 
  Clock, 
  FileText, 
  Download,
  PlusCircle,
  Shield,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Header from '@/components/Header';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useDatasetHistory } from '@/hooks/useDatasetHistory';

const Dashboard = () => {
  const { user } = useAuth();
  const { history } = useDatasetHistory();
  const navigate = useNavigate();

  if (!user) return null;

  const userInitials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  // Calculate dynamic stats from history
  const totalDatasets = history.length;
  const datasetsWithSynthetic = history.filter(d => d.hasSynthetic).length;
  const totalRowsGenerated = history.reduce((acc, d) => acc + (d.hasSynthetic ? d.rowCount : 0), 0);
  
  // Calculate average fidelity
  const datasetsWithQuality = history.filter(d => d.qualityReport);
  const avgFidelity = datasetsWithQuality.length > 0
    ? datasetsWithQuality.reduce((acc, d) => acc + (1 - d.qualityReport!.accuracyDiff), 0) / datasetsWithQuality.length * 100
    : 0;
  
  const avgPrivacy = datasetsWithQuality.length > 0
    ? datasetsWithQuality.reduce((acc, d) => acc + (d.qualityReport!.privacyScore || 0), 0) / datasetsWithQuality.length * 100
    : 0;

  // Create real activities from history
  // Each history entry can have up to 2 actions: Upload and Generation
  const activities = history.flatMap(dataset => {
    const actions = [];
    
    // Upload action
    actions.push({
      id: `${dataset.id}-upload`,
      datasetId: dataset.id,
      action: "Uploaded new dataset",
      target: dataset.fileName,
      time: new Date(dataset.uploadedAt),
      icon: <PlusCircle className="w-4 h-4" />,
      link: '/preview'
    });
    
    // Generation action (if synthetic data exists)
    if (dataset.hasSynthetic) {
      actions.push({
        id: `${dataset.id}-gen`,
        datasetId: dataset.id,
        action: "Generated synthetic data",
        target: dataset.fileName,
        time: new Date(dataset.uploadedAt), // In real app, this would be a separate timestamp
        icon: <Database className="w-4 h-4" />,
        link: '/synthetic'
      });
    }
    
    return actions;
  })
  .sort((a, b) => b.time.getTime() - a.time.getTime())
  .slice(0, 5)
  .map(activity => ({
    ...activity,
    time: activity.time.toLocaleDateString()
  }));

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Info */}
          <div className="md:w-1/3 lg:w-1/4 flex flex-col gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-primary/20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">{userInitials}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
                <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-6 border border-primary/20">
                  {user.role || 'Data Scientist'}
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="w-full justify-start h-10 border-muted" asChild>
                    <Link to="/profile">
                      <User className="mr-3 h-4 w-4 text-muted-foreground" />
                      Edit Profile
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start h-10 border-muted" asChild>
                    <Link to="/profile">
                      <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                      Account Settings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Usage Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Rows Generated</span>
                      <span className="font-medium">{(totalRowsGenerated / 1000000 * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: `${Math.min(100, (totalRowsGenerated / 1000000 * 100))}%` }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {totalRowsGenerated.toLocaleString()} / 1,000,000 rows
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground">Datasets</div>
                      <div className="text-lg font-bold">{totalDatasets}</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground">Synthetic</div>
                      <div className="text-lg font-bold">{datasetsWithSynthetic}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's what's happening with your data.</p>
              </div>
              <Button asChild>
                <Link to="/upload">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Project
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatsCard 
                title="Total Samples" 
                value={totalRowsGenerated > 1000 ? `${(totalRowsGenerated / 1000).toFixed(1)}k` : totalRowsGenerated.toString()} 
                description="Total generated records" 
                icon={<BarChart3 className="w-4 h-4 text-primary" />} 
              />
              <StatsCard 
                title="Average Fidelity" 
                value={avgFidelity > 0 ? `${avgFidelity.toFixed(1)}%` : "N/A"} 
                description={avgFidelity > 0 ? "Based on quality reports" : "No data generated yet"} 
                icon={<Activity className="w-4 h-4 text-[#10b981]" />} 
              />
              <StatsCard 
                title="Privacy Score" 
                value={avgPrivacy > 0 ? avgPrivacy.toFixed(1) : "N/A"} 
                description={avgPrivacy > 0 ? "Aggregate protection level" : "No synthetic data analyzed"} 
                icon={<Shield className="w-4 h-4 text-[#3b82f6]" />} 
              />
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest actions and generations</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/history">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4">
                        <div className="mt-1 p-2 rounded-full bg-muted">
                          {activity.icon}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {activity.action} <span className="text-primary font-semibold">{activity.target}</span>
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {activity.time}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link to={activity.link}>
                            <FileText className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-sm text-muted-foreground">No recent activity found.</p>
                      <Button variant="link" size="sm" asChild className="mt-2">
                        <Link to="/upload">Upload your first dataset</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatsCard = ({ title, value, description, icon }: { title: string, value: string, description: string, icon: React.ReactNode }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

export default Dashboard;
