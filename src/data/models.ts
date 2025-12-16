export interface ModelEvidence {
  label: string;
  url: string;
}

export interface ModelItem {
  title: string;
  description: string;
  tags: string[];
  evidence: ModelEvidence[];
}

export interface ModelSections {
  [section: string]: ModelItem[];
}

export const models: ModelSections = {
  "Supervised Learning": [
    {
      title: "Regression & Classification Pipelines",
      description:
        "End-to-end scikit-learn flows covering feature preprocessing, cross-validation, and model selection for structured data. Emphasis on clean train/test hygiene and reproducible configs.",
      tags: ["Regression", "Classification", "Pipelines", "scikit-learn"],
      evidence: [
        { label: "bike-sharing-system", url: "https://github.com/shravanikarra/bike-sharing-system" },
        { label: "lending_club", url: "https://github.com/shravanikarra/lending_club" },
        { label: "lead_scoring", url: "https://github.com/shravanikarra/lead_scoring" },
        { label: "Machine-Learning-Exercises", url: "https://github.com/shravanikarra/Machine-Learning-Exercises" }
      ]
    },
    {
      title: "Tree-Based Ensembles",
      description:
        "Random Forest and XGBoost variants tuned for tabular data, with attention to class imbalance, feature importance inspection, and calibration.",
      tags: ["Random Forest", "XGBoost", "Ensembles"],
      evidence: [
        { label: "credit_card_fraud_detection_system", url: "https://github.com/shravanikarra/credit_card_fraud_detection_system" },
        { label: "lending_club", url: "https://github.com/shravanikarra/lending_club" }
      ]
    },
    {
      title: "Gradient Boosting Experiments",
      description:
        "Boosted tree workflows comparing learning rates, depth constraints, and regularization to balance bias/variance on noisy financial-style data.",
      tags: ["Gradient Boosting", "Model Tuning", "Tabular"],
      evidence: [
        { label: "asset_return_simulation", url: "https://github.com/shravanikarra/asset_return_simulation" },
        { label: "Bitcoin_Price_Prediction", url: "https://github.com/shravanikarra/Bitcoin_Price_Prediction" }
      ]
    }
  ],
  "Time Series": [
    {
      title: "Demand & Sales Forecasting",
      description:
        "Classical forecasting baselines with feature engineering around seasonality and promotions, paired with error analysis on rolling horizons.",
      tags: ["Forecasting", "Seasonality", "Feature Engineering"],
      evidence: [{ label: "retail_giant_sales_forecasting", url: "https://github.com/shravanikarra/retail_giant_sales_forecasting" }]
    },
    {
      title: "Backtesting & Scenario Simulation",
      description:
        "Rolling-origin backtests and simulation notebooks to stress-test model stability under shifting distributions and synthetic shocks.",
      tags: ["Backtesting", "Simulation", "TSCV"],
      evidence: [{ label: "asset_return_simulation", url: "https://github.com/shravanikarra/asset_return_simulation" }]
    }
  ],
  "Unsupervised": [
    {
      title: "Clustering & Representation Checks",
      description:
        "k-Means and density-based clustering with PCA-driven dimensionality reduction to explore structure, segment behaviors, and validate separability.",
      tags: ["Clustering", "PCA", "EDA"],
      evidence: [{ label: "Machine-Learning-Exercises", url: "https://github.com/shravanikarra/Machine-Learning-Exercises" }]
    }
  ],
  "Anomaly Detection": [
    {
      title: "Fraud and Outlier Detection",
      description:
        "Isolation-style methods and thresholded probability scores tuned for rare-event detection with careful precision/recall tradeoffs.",
      tags: ["Anomaly Detection", "Imbalanced Data", "Thresholding"],
      evidence: [{ label: "credit_card_fraud_detection_system", url: "https://github.com/shravanikarra/credit_card_fraud_detection_system" }]
    }
  ],
  "Deep Learning": [
    {
      title: "Computer Vision Prototyping",
      description:
        "Convolutional baselines for image classification with data augmentation and evaluation loops focused on error analysis and reproducibility.",
      tags: ["CNNs", "Computer Vision", "PyTorch"],
      evidence: [{ label: "deep_learning_img_recognition", url: "https://github.com/shravanikarra/deep_learning_img_recognition" }]
    }
  ],
  "NLP & LLM Systems": [
    {
      title: "Prompting & LLM Evaluation",
      description:
        "Prompt design, guardrails, and lightweight evaluation to keep LLM outputs grounded; integrates app surfaces that expose responses transparently.",
      tags: ["LLMs", "Prompting", "Evaluation"],
      evidence: [
        { label: "shravfolio_AI_powered_portfolio", url: "https://github.com/shravanikarra/shravfolio_AI_powered_portfolio" },
        { label: "Immigame", url: "https://github.com/shravanikarra/Immigame" }
      ]
    }
  ],
  "Evaluation & Interpretability": [
    {
      title: "Metrics, Thresholds, and Leakage Checks",
      description:
        "Systematic metric selection, calibration, and leakage detection to keep models reliable; includes SHAP-style attribution for stakeholder review.",
      tags: ["Evaluation", "Calibration", "Interpretability"],
      evidence: [
        { label: "credit_card_fraud_detection_system", url: "https://github.com/shravanikarra/credit_card_fraud_detection_system" },
        { label: "lending_club", url: "https://github.com/shravanikarra/lending_club" }
      ]
    }
  ],
  "Applied ML Experiments": [
    {
      title: "Notebook-First Experimentation",
      description:
        "Exploratory notebooks validating ideas quickly with clean markdown, comparisons, and saved artifacts for follow-up iterations.",
      tags: ["Notebooks", "Prototyping", "Reproducibility"],
      evidence: [
        { label: "Machine-Learning-Exercises", url: "https://github.com/shravanikarra/Machine-Learning-Exercises" },
        { label: "DSA_learningRepo", url: "https://github.com/shravanikarra/DSA_learningRepo" }
      ]
    }
  ]
};
