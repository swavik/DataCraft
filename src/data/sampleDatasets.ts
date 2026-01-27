import { SampleDataset } from '@/types/dataset';

// Generate sample data helper
const generateFinanceData = (): Record<string, unknown>[] => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      transaction_id: `TXN${String(i + 1).padStart(5, '0')}`,
      amount: Math.round((Math.random() * 5000 + 100) * 100) / 100,
      category: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment'][Math.floor(Math.random() * 5)],
      account_type: ['Checking', 'Savings', 'Credit'][Math.floor(Math.random() * 3)],
      balance: Math.round((Math.random() * 50000 + 1000) * 100) / 100,
      age: Math.floor(Math.random() * 50 + 18),
      credit_score: Math.floor(Math.random() * 350 + 500),
    });
  }
  return data;
};

const generateHealthcareData = (): Record<string, unknown>[] => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      patient_id: `PAT${String(i + 1).padStart(5, '0')}`,
      age: Math.floor(Math.random() * 70 + 18),
      bmi: Math.round((Math.random() * 20 + 18) * 10) / 10,
      blood_pressure: Math.floor(Math.random() * 40 + 100),
      cholesterol: Math.floor(Math.random() * 100 + 150),
      heart_rate: Math.floor(Math.random() * 40 + 60),
      diagnosis: ['Healthy', 'Hypertension', 'Diabetes', 'Obesity', 'Heart Disease'][Math.floor(Math.random() * 5)],
    });
  }
  return data;
};

const generateRetailData = (): Record<string, unknown>[] => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      order_id: `ORD${String(i + 1).padStart(5, '0')}`,
      customer_age: Math.floor(Math.random() * 50 + 18),
      order_value: Math.round((Math.random() * 500 + 20) * 100) / 100,
      items_count: Math.floor(Math.random() * 10 + 1),
      discount_pct: Math.round(Math.random() * 30 * 10) / 10,
      return_customer: Math.random() > 0.5 ? 'Yes' : 'No',
      category: ['Electronics', 'Clothing', 'Home', 'Sports', 'Books'][Math.floor(Math.random() * 5)],
    });
  }
  return data;
};

const generateHRData = (): Record<string, unknown>[] => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      employee_id: `EMP${String(i + 1).padStart(5, '0')}`,
      age: Math.floor(Math.random() * 40 + 22),
      salary: Math.round((Math.random() * 100000 + 30000) / 1000) * 1000,
      experience_years: Math.floor(Math.random() * 25 + 1),
      department: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'][Math.floor(Math.random() * 5)],
      performance_score: Math.round((Math.random() * 3 + 2) * 10) / 10,
      attrition_risk: Math.round(Math.random() * 100) / 100,
    });
  }
  return data;
};

const generateInsuranceData = (): Record<string, unknown>[] => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      policy_id: `POL${String(i + 1).padStart(5, '0')}`,
      age: Math.floor(Math.random() * 50 + 20),
      premium: Math.round((Math.random() * 2000 + 200) * 100) / 100,
      coverage_amount: Math.round((Math.random() * 500000 + 50000) / 10000) * 10000,
      claims_count: Math.floor(Math.random() * 5),
      risk_score: Math.round(Math.random() * 100) / 100,
      policy_type: ['Auto', 'Home', 'Life', 'Health', 'Travel'][Math.floor(Math.random() * 5)],
    });
  }
  return data;
};

const generateMarketingData = (): Record<string, unknown>[] => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      campaign_id: `CMP${String(i + 1).padStart(5, '0')}`,
      impressions: Math.floor(Math.random() * 100000 + 1000),
      clicks: Math.floor(Math.random() * 5000 + 100),
      conversions: Math.floor(Math.random() * 500 + 10),
      spend: Math.round((Math.random() * 5000 + 100) * 100) / 100,
      roi: Math.round((Math.random() * 5 + 0.5) * 100) / 100,
      channel: ['Social', 'Search', 'Email', 'Display', 'Video'][Math.floor(Math.random() * 5)],
    });
  }
  return data;
};

export const sampleDatasets: SampleDataset[] = [
  {
    id: 'finance-transactions',
    name: 'Financial Transactions',
    category: 'Finance',
    description: 'Customer transaction data with amounts, categories, and credit scores',
    rowCount: 100,
    columns: ['transaction_id', 'amount', 'category', 'account_type', 'balance', 'age', 'credit_score'],
    data: generateFinanceData(),
  },
  {
    id: 'healthcare-patients',
    name: 'Patient Health Records',
    category: 'Healthcare',
    description: 'Patient health metrics including BMI, blood pressure, and diagnoses',
    rowCount: 100,
    columns: ['patient_id', 'age', 'bmi', 'blood_pressure', 'cholesterol', 'heart_rate', 'diagnosis'],
    data: generateHealthcareData(),
  },
  {
    id: 'retail-orders',
    name: 'E-commerce Orders',
    category: 'Retail',
    description: 'Online store orders with customer demographics and purchase details',
    rowCount: 100,
    columns: ['order_id', 'customer_age', 'order_value', 'items_count', 'discount_pct', 'return_customer', 'category'],
    data: generateRetailData(),
  },
  {
    id: 'hr-employees',
    name: 'Employee Analytics',
    category: 'HR',
    description: 'Employee data with salary, performance, and attrition risk metrics',
    rowCount: 100,
    columns: ['employee_id', 'age', 'salary', 'experience_years', 'department', 'performance_score', 'attrition_risk'],
    data: generateHRData(),
  },
  {
    id: 'insurance-policies',
    name: 'Insurance Policies',
    category: 'Insurance',
    description: 'Insurance policy data with premiums, claims, and risk assessments',
    rowCount: 100,
    columns: ['policy_id', 'age', 'premium', 'coverage_amount', 'claims_count', 'risk_score', 'policy_type'],
    data: generateInsuranceData(),
  },
  {
    id: 'marketing-campaigns',
    name: 'Marketing Campaigns',
    category: 'Marketing',
    description: 'Digital marketing campaign performance metrics and ROI data',
    rowCount: 100,
    columns: ['campaign_id', 'impressions', 'clicks', 'conversions', 'spend', 'roi', 'channel'],
    data: generateMarketingData(),
  },
];

export const getDatasetsByCategory = () => {
  const categories: Record<string, SampleDataset[]> = {};
  sampleDatasets.forEach(dataset => {
    if (!categories[dataset.category]) {
      categories[dataset.category] = [];
    }
    categories[dataset.category].push(dataset);
  });
  return categories;
};
