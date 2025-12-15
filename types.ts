export type ProjectCategory = 'The End-to-End' | 'The Business Value' | 'The Deep Dive';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  technologies: string[];
  imageUrl: string;
  githubUrl: string;
  demoUrl?: string;
  year: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

// D3 Node types
export interface GraphNode {
  id: string;
  group: 'project' | 'tech';
  radius: number;
  label: string;
  originalColor: string;
  projectId?: string; // For linking back to project details
  // d3.SimulationNodeDatum properties
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
  // d3.SimulationLinkDatum properties
  index?: number;
}