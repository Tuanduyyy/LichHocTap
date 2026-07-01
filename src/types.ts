/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StudyCategory =
  | 'Vocabulary'
  | 'Listening'
  | 'Reading'
  | 'Writing'
  | 'Speaking'
  | 'Grammar'
  | 'Mock Test';

export type PriorityLevel = 'Low' | 'Medium' | 'High';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  category: StudyCategory;
  priority: PriorityLevel;
  description: string;
  checklist: ChecklistItem[];
  notes: string;
  completed: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // in minutes
  category: StudyCategory;
  description: string;
  notes: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  updatedAt: string; // ISO String
}

export interface IELTSGoals {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
  overall: number;
}

export interface IELTSExam {
  date: string; // YYYY-MM-DD
  targetScore: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  language: 'vi' | 'en';
}

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
}
