export enum TimerMode {
  FOCUS = 'FOCUS',
  SHORT_BREAK = 'SHORT_BREAK',
  LONG_BREAK = 'LONG_BREAK'
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  sessionsCompleted: number;
}

export interface CompanionState {
  message: string;
  emotion: 'happy' | 'thinking' | 'celebrating' | 'sleepy';
  isLoading: boolean;
}

export const FOCUS_TIME = 25 * 60; // 25 minutes
export const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
export const LONG_BREAK_TIME = 15 * 60; // 15 minutes