export interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
} 