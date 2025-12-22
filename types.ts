
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
}

export interface FocusSession {
  id: string;
  duration: number; // minutes
  timestamp: number;
  label: string;
}

export type View = 'dashboard' | 'focus' | 'coach' | 'challenges' | 'stats';

export interface Message {
  role: 'user' | 'model';
  text: string;
}
