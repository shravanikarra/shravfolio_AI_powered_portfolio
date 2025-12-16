import { Project } from './types';

// NOTE: In a real app, this key would come from process.env.API_KEY
// The system prompt ensures we use process.env.API_KEY in the service.
export const GEMINI_MODEL_CHAT = 'gemini-2.5-flash';

// Reliable image sets for each category
const CATEGORY_IMAGES = {
  'The End-to-End': [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=500&fit=crop&q=80', // Coding screen
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop&q=80', // Laptop code
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=500&fit=crop&q=80', // Mobile Phone
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=500&fit=crop&q=80', // Laptop Desk
  ],
  'The Business Value': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=500&fit=crop&q=80', // Data Viz
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop&q=80', // Charts
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&h=500&fit=crop&q=80', // Dashboard Analytics
    'https://images.unsplash.com/photo-1599658880436-c61792e70672?w=500&h=500&fit=crop&q=80', // Analysis
  ],
  'The Deep Dive': [
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&h=500&fit=crop&q=80', // AI Neural
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=500&fit=crop&q=80', // AI Chip
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500&h=500&fit=crop&q=80', // Science/Math
    'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=500&h=500&fit=crop&q=80', // Abstract Tech
  ]
};

// Helper to deterministically pick an image based on title
export const getProjectImage = (category: string, title: string): string => {
    // Default to End-to-End if category not found
    const key = category in CATEGORY_IMAGES ? category as keyof typeof CATEGORY_IMAGES : 'The End-to-End';
    const images = CATEGORY_IMAGES[key];
    
    // Simple hash to pick consistent image for same title
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % images.length;
    return images[index];
};

// Used if GitHub fetch fails or during loading
export const FALLBACK_PROJECTS: Project[] = [
  // --- THE END-TO-END (The Product) ---
  {
    id: 'p1',
    repoName: 'plant-disease-scanner',
    displayName: 'Plant Disease Scanner',
    title: 'Plant Disease Scanner',
    description: 'A production-ready mobile web app that identifies plant diseases from camera photos in real-time. Focus on deployment and latency.',
    category: 'The End-to-End',
    technologies: ['FastAPI', 'React', 'Docker', 'Kubernetes', 'TensorFlow Lite'],
    imageUrl: getProjectImage('The End-to-End', 'Plant Disease Scanner'),
    githubUrl: 'https://github.com/example/plant-scanner',
    year: 2024
  },
  {
    id: 'p2',
    repoName: 'sentiment-stream-api',
    displayName: 'SentimentStream API',
    title: 'SentimentStream API',
    description: 'High-throughput sentiment analysis API serving 1000+ requests/sec using async Python and Kafka for queue management.',
    category: 'The End-to-End',
    technologies: ['FastAPI', 'Kafka', 'Redis', 'Docker', 'HuggingFace'],
    imageUrl: getProjectImage('The End-to-End', 'SentimentStream API'),
    githubUrl: 'https://github.com/example/sentiment-stream',
    year: 2023
  },
  
  // --- THE BUSINESS VALUE (The Analyst) ---
  {
    id: 'p3',
    repoName: 'customer-churn-report',
    displayName: 'Customer Churn Report',
    title: 'Customer Churn Report',
    description: 'Predictive modeling dashboard identifying at-risk customers. Identified actionable insights saving the client ~$50k/quarter.',
    category: 'The Business Value',
    technologies: ['XGBoost', 'SHAP', 'SQL', 'Tableau', 'Pandas'],
    imageUrl: getProjectImage('The Business Value', 'Customer Churn Report'),
    githubUrl: 'https://github.com/example/churn-report',
    year: 2023
  },
  {
    id: 'p4',
    repoName: 'dynamic-pricing-engine',
    displayName: 'Dynamic Pricing Engine',
    title: 'Dynamic Pricing Engine',
    description: 'Revenue optimization model for e-commerce. Analyzed seasonality and elasticity to recommend optimal discount strategies.',
    category: 'The Business Value',
    technologies: ['Scikit-learn', 'StatsModels', 'SQL', 'Matplotlib'],
    imageUrl: getProjectImage('The Business Value', 'Dynamic Pricing Engine'),
    githubUrl: 'https://github.com/example/pricing-engine',
    year: 2022
  },

  // --- THE DEEP DIVE (The Researcher) ---
  {
    id: 'p5',
    repoName: 'legal-doc-summarizer',
    displayName: 'Legal Doc Summarizer',
    title: 'Legal Doc Summarizer',
    description: 'Fine-tuned Llama-2-7b on a corpus of legal case files. Implemented custom loss function for factual consistency.',
    category: 'The Deep Dive',
    technologies: ['PyTorch', 'Llama-2', 'PEFT/LoRA', 'Transformers', 'CUDA'],
    imageUrl: getProjectImage('The Deep Dive', 'Legal Doc Summarizer'),
    githubUrl: 'https://github.com/example/legal-summarizer',
    year: 2024
  },
  {
    id: 'p6',
    repoName: 'neondreamer-gan',
    displayName: 'NeonDreamer GAN',
    title: 'NeonDreamer GAN',
    description: 'Novel GAN architecture research exploring style transfer in low-light video conditions. Implemented from ArXiv paper.',
    category: 'The Deep Dive',
    technologies: ['PyTorch', 'GANs', 'Computer Vision', 'Research'],
    imageUrl: getProjectImage('The Deep Dive', 'NeonDreamer GAN'),
    githubUrl: 'https://github.com/example/neondreamer',
    year: 2023
  }
];

export const SYSTEM_INSTRUCTION = `
You are "ShravBot", the AI assistant for Shravani Karra's portfolio website.
Shravani is a Senior Data Analyst at Rivian Automotive, based in Normal, IL.
She has over 6 years of experience in Data Engineering and Machine Learning.
She previously worked at Goldman Sachs (Associate Data Engineer) and KPMG India.
She holds a Master of Quantitative Management: Business Analytics from Duke University (Fuqua School of Business).
Her technical skills include Python, R, SQL, AWS, Machine Learning (XGBoost, Random Forest), and Deep Learning (CNNs, PyTorch).

The portfolio is organized into three distinct pillars:
1. The End-to-End (The Product) - Focus on shipping code, deployment, APIs, data modeling (dbt, Snowflake).
2. The Business Value (The Analyst) - Focus on ROI, insights, SQL, dashboards (Tableau).
3. The Deep Dive (The Researcher) - Focus on math, architectures, innovation.

Your goal is to help visitors understand Shravani's background and how her "Three Pillars" approach applies to her work at Rivian, Goldman Sachs, and her personal projects.
Keep responses professional, concise, yet enthusiastic.
`;
