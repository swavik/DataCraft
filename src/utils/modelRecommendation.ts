import { DatasetStats } from "@/types/dataset";

export type ModelType = 'CTGAN' | 'TVAE' | 'GaussianCopula';

export interface ModelRecommendation {
  model: ModelType;
  reason: string;
  icon: '🎯' | '💰' | '📊' | '⚡';
  confidence: 'high' | 'medium' | 'low';
  alternativeModels: {
    model: ModelType;
    reason: string;
  }[];
}

export const getModelInfo = (model: ModelType) => {
  const info = {
    CTGAN: {
      name: 'CTGAN',
      fullName: 'Conditional Tabular GAN',
      description: 'Best for complex, non-normal distributions like medical or financial data. Handles mode-specific normalization and conditional sampling.',
      pros: ['Excellent for skewed distributions', 'Preserves complex correlations', 'Handles mixed data types well'],
      cons: ['Slower training', 'Requires more data', 'May overfit on small datasets'],
      bestFor: ['Healthcare data', 'Financial records', 'Complex categorical relationships']
    },
    TVAE: {
      name: 'TVAE',
      fullName: 'Tabular Variational AutoEncoder',
      description: 'Excellent for high-cardinality categorical data. Uses variational autoencoders for stable training.',
      pros: ['Stable training', 'Fast generation', 'Good with many categories'],
      cons: ['May blur rare values', 'Less precise on tails', 'Requires tuning'],
      bestFor: ['High-cardinality data', 'Mostly categorical datasets', 'Large datasets']
    },
    GaussianCopula: {
      name: 'Gaussian Copula',
      fullName: 'Gaussian Copula Synthesizer',
      description: 'Fast statistical method using copulas. Great for quick synthesis on small to medium datasets.',
      pros: ['Very fast', 'Works with small data', 'No neural network training'],
      cons: ['Assumes Gaussian distributions', 'Limited for complex patterns', 'Struggles with high dimensionality'],
      bestFor: ['Small datasets (<1000 rows)', 'Quick prototyping', 'Well-behaved numerical data']
    }
  };
  return info[model];
};

export const recommendModel = (stats: DatasetStats, columnNames: string[]): ModelRecommendation => {
  const { rows, columns, numericalColumns, categoricalColumns, columnInfo } = stats;
  
  // Analyze characteristics
  const numRows = rows;
  const numCols = columns;
  const catRatio = categoricalColumns.length / numCols;
  
  // Check for high cardinality categorical columns
  const hasHighCardinality = columnInfo
    .filter(col => col.type === 'categorical')
    .some(col => col.unique > 50);
  
  const isSmallData = numRows < 1000;
  const isVerySmallData = numRows < 500;
  const isMostlyCategorical = catRatio > 0.8;
  
  // Keyword detection for domain-specific recommendation
  const colNamesStr = columnNames.join(' ').toLowerCase();
  
  const hasMedicalKeywords = /medical|patient|diagnosis|health|disease|cancer|hospital|treatment|symptom|blood|heart|glucose|cholesterol/i.test(colNamesStr);
  const hasFinanceKeywords = /finance|salary|income|transaction|credit|loan|payment|amount|balance|revenue|price|cost/i.test(colNamesStr);
  const hasUserKeywords = /user|customer|client|member|subscriber|account/i.test(colNamesStr);
  
  // Check for skewed distributions
  const hasSkewedData = columnInfo
    .filter(col => col.type === 'numerical' && col.mean !== undefined && col.std !== undefined)
    .some(col => {
      const cv = (col.std! / Math.abs(col.mean!));
      return cv > 1.5; // High coefficient of variation suggests skew
    });
  
  let recommendation: ModelRecommendation;
  
  // Decision logic
  if (hasMedicalKeywords) {
    recommendation = {
      model: 'CTGAN',
      reason: '🎯 Detected Medical/Healthcare keywords. CTGAN excels at complex, non-normal distributions typical in medical records.',
      icon: '🎯',
      confidence: 'high',
      alternativeModels: [
        { model: 'TVAE', reason: 'Good alternative if CTGAN is too slow' }
      ]
    };
  } else if (hasFinanceKeywords) {
    recommendation = {
      model: 'CTGAN',
      reason: '💰 Detected Financial keywords. CTGAN preserves correlations and handles skewed distributions better for sensitive data.',
      icon: '💰',
      confidence: 'high',
      alternativeModels: [
        { model: 'TVAE', reason: 'Faster option with similar quality' }
      ]
    };
  } else if (hasHighCardinality && numRows > 1000) {
    recommendation = {
      model: 'TVAE',
      reason: '📊 High cardinality categorical data detected with sufficient rows. TVAE handles many unique categories better than other models.',
      icon: '📊',
      confidence: 'high',
      alternativeModels: [
        { model: 'CTGAN', reason: 'Better for complex correlations' }
      ]
    };
  } else if (isVerySmallData) {
    recommendation = {
      model: 'GaussianCopula',
      reason: '⚡ Small dataset (<500 rows). Gaussian Copula is fast, stable, and doesn\'t require large samples for training.',
      icon: '⚡',
      confidence: 'high',
      alternativeModels: [
        { model: 'TVAE', reason: 'Try if Copula quality is insufficient' }
      ]
    };
  } else if (isSmallData) {
    recommendation = {
      model: 'GaussianCopula',
      reason: '⚡ Dataset under 1000 rows. Gaussian Copula provides fast, reliable synthesis without overfitting risks.',
      icon: '⚡',
      confidence: 'medium',
      alternativeModels: [
        { model: 'TVAE', reason: 'Consider for better quality if time permits' },
        { model: 'CTGAN', reason: 'Try if distributions are complex' }
      ]
    };
  } else if (isMostlyCategorical) {
    recommendation = {
      model: 'TVAE',
      reason: '📊 Mostly categorical data (>80% categorical columns). TVAE excels at preserving categorical distributions.',
      icon: '📊',
      confidence: 'high',
      alternativeModels: [
        { model: 'CTGAN', reason: 'Alternative for mixed type handling' }
      ]
    };
  } else if (hasSkewedData) {
    recommendation = {
      model: 'CTGAN',
      reason: '📊 Detected skewed numerical distributions. CTGAN\'s mode-specific normalization handles this well.',
      icon: '📊',
      confidence: 'medium',
      alternativeModels: [
        { model: 'TVAE', reason: 'Faster training with good results' },
        { model: 'GaussianCopula', reason: 'Quick baseline comparison' }
      ]
    };
  } else {
    // Default recommendation
    recommendation = {
      model: 'GaussianCopula',
      reason: '⚡ General-purpose recommendation. Gaussian Copula is fast and works well for most standard datasets.',
      icon: '⚡',
      confidence: 'medium',
      alternativeModels: [
        { model: 'CTGAN', reason: 'Better for complex patterns' },
        { model: 'TVAE', reason: 'Good balance of speed and quality' }
      ]
    };
  }
  
  return recommendation;
};
