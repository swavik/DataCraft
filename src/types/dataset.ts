export interface DatasetColumn {
  name: string;
  type: 'numerical' | 'categorical' | 'datetime' | 'text';
  unique: number;
  missing: number;
  mean?: number;
  std?: number;
  min?: number;
  max?: number;
}

export interface DatasetStats {
  rows: number;
  columns: number;
  columnInfo: DatasetColumn[];
  missingTotal: number;
  numericalColumns: string[];
  categoricalColumns: string[];
}

export interface ComparisonMetric {
  column: string;
  realMean: number;
  syntheticMean: number;
  realStd: number;
  syntheticStd: number;
  meanDiff: number;
  stdDiff: number;
}

export interface QualityReport {
  realAccuracy: number;
  syntheticAccuracy: number;
  accuracyDiff: number;
  qualityLevel: 'excellent' | 'good' | 'needs_improvement';
  comparisonMetrics: ComparisonMetric[];
}

export interface GenerationProgress {
  stage: 'idle' | 'analyzing' | 'training' | 'generating' | 'evaluating' | 'complete';
  progress: number;
  message: string;
  epoch?: number;
  totalEpochs?: number;
}

export interface DatasetHistory {
  id: string;
  fileName: string;
  uploadedAt: string;
  rowCount: number;
  columnCount: number;
  hasSynthetic: boolean;
  realData?: any[];
  syntheticData?: any[];
  stats?: DatasetStats;
  qualityReport?: QualityReport;
}
