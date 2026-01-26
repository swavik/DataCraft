import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useDatasetHistory } from "@/hooks/useDatasetHistory";
import DatasetUsageStats from "@/components/dashboard/DatasetUsageStats";
import UserActivityTimeline from "@/components/dashboard/UserActivityTimeline";
import EvaluationChart from "@/components/dashboard/EvaluationChart";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const { profile, actions } = useUserProfile();
  const { history } = useDatasetHistory();

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {profile.name.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your synthetic data generation activities
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/upload')} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Dataset
            </Button>
            <Button variant="outline" onClick={() => navigate('/history')} className="gap-2">
              <Sparkles className="w-4 h-4" />
              View History
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <DatasetUsageStats history={history} />

        {/* Charts and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <EvaluationChart history={history} />
          <UserActivityTimeline actions={actions} />
        </div>
      </div>
    </div>
  );
}
