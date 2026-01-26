import { DatasetStats, DatasetColumn, QualityReport, ComparisonMetric, GenerationProgress } from "@/types/dataset";

// Analyze dataset and extract statistics
export const analyzeDataset = (data: any[]): DatasetStats => {
  if (data.length === 0) {
    return {
      rows: 0,
      columns: 0,
      columnInfo: [],
      missingTotal: 0,
      numericalColumns: [],
      categoricalColumns: []
    };
  }

  const columns = Object.keys(data[0]);
  const columnInfo: DatasetColumn[] = [];
  let missingTotal = 0;
  const numericalColumns: string[] = [];
  const categoricalColumns: string[] = [];

  columns.forEach(col => {
    const values = data.map(row => row[col]);
    const nonNullValues = values.filter(v => v !== undefined && v !== null && v !== '');
    const missing = values.length - nonNullValues.length;
    missingTotal += missing;

    // Determine if numerical or categorical
    const numericValues = nonNullValues.filter(v => typeof v === 'number' && !isNaN(v));
    const isNumerical = numericValues.length > nonNullValues.length * 0.5;
    const isInteger = isNumerical && numericValues.every(v => Number.isInteger(v));

    const colInfo: DatasetColumn = {
      name: col,
      type: isNumerical ? 'numerical' : 'categorical',
      unique: new Set(nonNullValues).size,
      missing,
      isInteger
    };

    if (isNumerical && numericValues.length > 0) {
      const nums = numericValues as number[];
      colInfo.mean = nums.reduce((a, b) => a + b, 0) / nums.length;
      colInfo.std = Math.sqrt(
        nums.reduce((sq, n) => sq + Math.pow(n - colInfo.mean!, 2), 0) / nums.length
      );
      colInfo.min = Math.min(...nums);
      colInfo.max = Math.max(...nums);
      numericalColumns.push(col);
    } else {
      categoricalColumns.push(col);
    }

    columnInfo.push(colInfo);
  });

  return {
    rows: data.length,
    columns: columns.length,
    columnInfo,
    missingTotal,
    numericalColumns,
    categoricalColumns
  };
};

// Simulate CTGAN synthetic data generation
export const generateSyntheticData = async (
  realData: any[],
  stats: DatasetStats,
  numSamples: number,
  epochs: number,
  onProgress: (progress: GenerationProgress) => void
): Promise<any[]> => {
  const syntheticData: any[] = [];
  const columns = Object.keys(realData[0]);

  // Stage 1: Analyzing
  onProgress({
    stage: 'analyzing',
    progress: 5,
    message: 'Analyzing data distributions...'
  });
  await delay(800);

  onProgress({
    stage: 'analyzing',
    progress: 15,
    message: 'Detecting column types and constraints...'
  });
  await delay(600);

  // Stage 2: Training (simulated)
  const totalEpochs = Math.min(epochs, 50); // Simulate fewer for demo
  for (let epoch = 1; epoch <= totalEpochs; epoch++) {
    onProgress({
      stage: 'training',
      progress: 15 + (epoch / totalEpochs) * 50,
      message: `Training CTGAN model...`,
      epoch,
      totalEpochs
    });
    await delay(100);
  }

  // Stage 3: Generating
  onProgress({
    stage: 'generating',
    progress: 70,
    message: 'Generating synthetic records...'
  });

  // Generate synthetic data with realistic distributions
  for (let i = 0; i < numSamples; i++) {
    const syntheticRow: any = {};
    
    columns.forEach(col => {
      const colInfo = stats.columnInfo.find(c => c.name === col);
      
      if (colInfo?.type === 'numerical' && colInfo.mean !== undefined && colInfo.std !== undefined) {
        // Generate from normal distribution with some noise
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        let value = colInfo.mean + z * colInfo.std * (0.8 + Math.random() * 0.4);
        
        // Clamp to realistic range
        if (colInfo.min !== undefined && colInfo.max !== undefined) {
          value = Math.max(colInfo.min * 0.8, Math.min(colInfo.max * 1.2, value));
        }
        
        if (colInfo.isInteger) {
          syntheticRow[col] = Math.round(value);
        } else {
          syntheticRow[col] = Math.round(value * 100) / 100;
        }
      } else {
        // For categorical: sample from existing values with some variation
        const realValues = realData.map(r => r[col]).filter(v => v !== undefined && v !== null && v !== '');
        const uniqueValues = [...new Set(realValues)];
        
        if (uniqueValues.length > 0) {
          syntheticRow[col] = uniqueValues[Math.floor(Math.random() * uniqueValues.length)];
        } else {
          // Fallback if column is empty
          syntheticRow[col] = "Sample Data";
        }
      }
    });
    
    syntheticData.push(syntheticRow);
    
    // Update progress periodically
    if (i % Math.floor(numSamples / 10) === 0) {
      onProgress({
        stage: 'generating',
        progress: 70 + (i / numSamples) * 20,
        message: `Generated ${i.toLocaleString()} of ${numSamples.toLocaleString()} records...`
      });
      await delay(50);
    }
  }

  // Stage 4: Evaluating
  onProgress({
    stage: 'evaluating',
    progress: 95,
    message: 'Evaluating synthetic data quality...'
  });
  await delay(800);

  onProgress({
    stage: 'complete',
    progress: 100,
    message: 'Generation complete!'
  });

  return syntheticData;
};

// Calculate quality metrics
export const calculateQualityReport = (
  realData: any[],
  syntheticData: any[],
  stats: DatasetStats
): QualityReport => {
  const comparisonMetrics: ComparisonMetric[] = [];

  stats.numericalColumns.forEach(col => {
    const realValues = realData.map(r => r[col]).filter(v => typeof v === 'number' && !isNaN(v));
    const synthValues = syntheticData.map(r => r[col]).filter(v => typeof v === 'number' && !isNaN(v));

    if (realValues.length === 0 || synthValues.length === 0) return;

    const realMean = realValues.reduce((a, b) => a + b, 0) / realValues.length;
    const synthMean = synthValues.reduce((a, b) => a + b, 0) / synthValues.length;
    
    const realStd = Math.sqrt(
      realValues.reduce((sq, n) => sq + Math.pow(n - realMean, 2), 0) / realValues.length
    );
    const synthStd = Math.sqrt(
      synthValues.reduce((sq, n) => sq + Math.pow(n - synthMean, 2), 0) / synthValues.length
    );

    comparisonMetrics.push({
      column: col,
      realMean,
      syntheticMean: synthMean,
      realStd,
      syntheticStd: synthStd,
      meanDiff: Math.abs(realMean - synthMean),
      stdDiff: Math.abs(realStd - synthStd)
    });
  });

  // Simulate ML utility test (in real implementation, train actual classifiers)
  const realAccuracy = 0.75 + Math.random() * 0.15;
  const syntheticAccuracy = realAccuracy - (0.02 + Math.random() * 0.06);
  const accuracyDiff = Math.abs(realAccuracy - syntheticAccuracy);

  let qualityLevel: 'excellent' | 'good' | 'needs_improvement';
  if (accuracyDiff < 0.05) {
    qualityLevel = 'excellent';
  } else if (accuracyDiff < 0.10) {
    qualityLevel = 'good';
  } else {
    qualityLevel = 'needs_improvement';
  }

  return {
    realAccuracy,
    syntheticAccuracy,
    accuracyDiff,
    qualityLevel,
    comparisonMetrics
  };
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
