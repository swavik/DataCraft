import { DatasetStats, DatasetColumn, GenerationProgress } from "@/types/dataset";

export interface GenAiConfig {
  noiseLevel: number;
  privacyBudget: number;
  correlationPreservation: number;
  numRows: number;
  prompt?: string;
}

// Box-Muller transform for Gaussian distribution
const gaussianRandom = (mean: number, std: number) => {
  const u1 = Math.random() || 0.0001; // Avoid 0
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z * std;
};

// Weighted sampling for categorical data
const weightedSample = (counts: Record<string, number>, total: number) => {
  const r = Math.random() * total;
  let cumulative = 0;
  for (const [val, count] of Object.entries(counts)) {
    cumulative += count;
    if (r <= cumulative) return val;
  }
  return Object.keys(counts)[0];
};

export const generateGenAiData = async (
  realData: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  stats: DatasetStats,
  config: GenAiConfig,
  onProgress: (progress: GenerationProgress) => void
): Promise<any[]> => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const { numRows, noiseLevel, privacyBudget, correlationPreservation } = config;
  const syntheticData: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  const columns = stats.columnInfo;

  // Stage 1: Analyzing
  onProgress({
    stage: 'analyzing',
    progress: 10,
    message: 'Analyzing statistical distributions and correlations...'
  });
  await delay(1000);

  // Prepare categorical frequencies
  const catFrequencies: Record<string, Record<string, number>> = {};
  stats.categoricalColumns.forEach(col => {
    const freq: Record<string, number> = {};
    realData.forEach(row => {
      const val = String(row[col]);
      freq[val] = (freq[val] || 0) + 1;
    });
    catFrequencies[col] = freq;
  });

  // Stage 2: Simulating GAN Training
  const epochs = 20;
  for (let epoch = 1; epoch <= epochs; epoch++) {
    onProgress({
      stage: 'training',
      progress: 10 + (epoch / epochs) * 60,
      message: `Simulating CTGAN training: optimizing latent distributions...`,
      epoch,
      totalEpochs: epochs
    });
    await delay(150);
  }

  // Stage 3: Generating
  onProgress({
    stage: 'generating',
    progress: 70,
    message: `Generating ${numRows} privacy-safe records...`
  });

  for (let i = 0; i < numRows; i++) {
    const syntheticRow: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    
    // Correlation preservation: sometimes "anchor" to a real row's structure
    const useCorrelation = Math.random() < correlationPreservation;
    const sourceRow = useCorrelation ? realData[Math.floor(Math.random() * realData.length)] : null;

    columns.forEach(col => {
      if (col.type === 'numerical') {
        const mean = col.mean ?? 0;
        const std = col.std ?? 1;
        
        // Apply privacy budget: higher budget = more noise, less accuracy
        // In DP terms, noise is often proportional to 1/epsilon. 
        // Here we simulate it by scaling std.
        const effectiveNoise = (noiseLevel * 0.5) + (privacyBudget * 0.8);
        const noiseStd = std * (1 + effectiveNoise);
        
        let value: number;
        if (sourceRow && sourceRow[col.name] !== undefined) {
          // If preserving correlation, stay near the source row's value
          value = gaussianRandom(Number(sourceRow[col.name]), std * (1 - correlationPreservation + 0.1));
        } else {
          value = gaussianRandom(mean, noiseStd);
        }

        // Clamp to min/max with a bit of buffer
        if (col.min !== undefined && col.max !== undefined) {
          const range = col.max - col.min;
          const minBound = col.min - (range * privacyBudget * 0.1);
          const maxBound = col.max + (range * privacyBudget * 0.1);
          value = Math.max(minBound, Math.min(maxBound, value));
        }

        syntheticRow[col.name] = Math.round(value * 100) / 100;
      } else {
        // Categorical
        if (sourceRow && sourceRow[col.name] !== undefined && Math.random() < correlationPreservation) {
          syntheticRow[col.name] = sourceRow[col.name];
        } else {
          const freq = catFrequencies[col.name];
          if (freq) {
            syntheticRow[col.name] = weightedSample(freq, stats.rows);
          } else {
            syntheticRow[col.name] = "Unknown";
          }
        }
        
        // Privacy: occasionally swap categorical values
        if (Math.random() < privacyBudget * 0.2) {
          const values = Object.keys(catFrequencies[col.name] || {});
          if (values.length > 0) {
            syntheticRow[col.name] = values[Math.floor(Math.random() * values.length)];
          }
        }
      }
    });

    syntheticData.push(syntheticRow);

    if (i % Math.floor(numRows / 10 + 1) === 0) {
      onProgress({
        stage: 'generating',
        progress: 70 + (i / numRows) * 25,
        message: `Generated ${i} / ${numRows} records...`
      });
      await delay(20);
    }
  }

  onProgress({
    stage: 'complete',
    progress: 100,
    message: 'GenAI Dataset Generation Complete!'
  });

  return syntheticData;
};

// Simplified parser to guess schema from prompt if no real data is provided
export const guessSchemaFromPrompt = (prompt: string): DatasetColumn[] => {
  const columns: DatasetColumn[] = [];
  const lowerPrompt = prompt.toLowerCase();

  // Keyword-based column guessing
  const rules = [
    { keywords: ['id', 'patient_id', 'user_id'], name: 'id', type: 'numerical', min: 1000, max: 9999, mean: 5000, std: 1500 },
    { keywords: ['name', 'patient name', 'user name'], name: 'name', type: 'categorical' },
    { keywords: ['age'], name: 'age', type: 'numerical', min: 18, max: 90, mean: 45, std: 15 },
    { keywords: ['gender', 'sex'], name: 'gender', type: 'categorical' },
    { keywords: ['diagnosis', 'condition'], name: 'diagnosis', type: 'categorical' },
    { keywords: ['cost', 'amount', 'price', 'treatment costs'], name: 'cost', type: 'numerical', min: 50, max: 5000, mean: 1200, std: 800 },
    { keywords: ['date'], name: 'date', type: 'datetime' },
    { keywords: ['category'], name: 'category', type: 'categorical' },
    { keywords: ['status'], name: 'status', type: 'categorical' },
    { keywords: ['rating'], name: 'rating', type: 'numerical', min: 1, max: 5, mean: 3.5, std: 1 },
  ];

  rules.forEach(rule => {
    if (rule.keywords.some(k => lowerPrompt.includes(k))) {
      columns.push({
        name: rule.name,
        type: rule.type as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        unique: rule.type === 'categorical' ? 5 : 0,
        missing: 0,
        min: rule.min,
        max: rule.max,
        mean: rule.mean,
        std: rule.std
      });
    }
  });

        // If no columns found, provide defaults
  if (columns.length === 0) {
    columns.push(
      { name: 'id', type: 'numerical', unique: 0, missing: 0, min: 1, max: 1000, mean: 500, std: 200 },
      { name: 'category', type: 'categorical', unique: 3, missing: 0 },
      { name: 'value', type: 'numerical', unique: 0, missing: 0, min: 10, max: 100, mean: 55, std: 20 }
    );
  }

  return columns;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
