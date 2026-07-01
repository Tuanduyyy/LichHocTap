/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, CalendarEvent, Note, IELTSGoals, IELTSExam, StudyStreak, AppSettings } from '../types';
import { initialTasks, initialEvents, initialNotes, initialGoals, initialExam, initialStreak } from '../initialData';

const KEYS = {
  TASKS: 'ielts_planner_tasks',
  EVENTS: 'ielts_planner_events',
  NOTES: 'ielts_planner_notes',
  GOALS: 'ielts_planner_goals',
  EXAM: 'ielts_planner_exam',
  STREAK: 'ielts_planner_streak',
  SETTINGS: 'ielts_planner_settings',
};

export const storageService = {
  getTasks(): Task[] {
    const data = localStorage.getItem(KEYS.TASKS);
    if (!data) {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(initialTasks));
      return initialTasks;
    }
    return JSON.parse(data);
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  getEvents(): CalendarEvent[] {
    const data = localStorage.getItem(KEYS.EVENTS);
    if (!data) {
      localStorage.setItem(KEYS.EVENTS, JSON.stringify(initialEvents));
      return initialEvents;
    }
    return JSON.parse(data);
  },

  saveEvents(events: CalendarEvent[]): void {
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
  },

  getNotes(): Note[] {
    const data = localStorage.getItem(KEYS.NOTES);
    if (!data) {
      localStorage.setItem(KEYS.NOTES, JSON.stringify(initialNotes));
      return initialNotes;
    }
    return JSON.parse(data);
  },

  saveNotes(notes: Note[]): void {
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
  },

  getGoals(): IELTSGoals {
    const data = localStorage.getItem(KEYS.GOALS);
    if (!data) {
      localStorage.setItem(KEYS.GOALS, JSON.stringify(initialGoals));
      return initialGoals;
    }
    return JSON.parse(data);
  },

  saveGoals(goals: IELTSGoals): void {
    localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
  },

  getExam(): IELTSExam {
    const data = localStorage.getItem(KEYS.EXAM);
    if (!data) {
      localStorage.setItem(KEYS.EXAM, JSON.stringify(initialExam));
      return initialExam;
    }
    return JSON.parse(data);
  },

  saveExam(exam: IELTSExam): void {
    localStorage.setItem(KEYS.EXAM, JSON.stringify(exam));
  },

  getStreak(): StudyStreak {
    const data = localStorage.getItem(KEYS.STREAK);
    if (!data) {
      localStorage.setItem(KEYS.STREAK, JSON.stringify(initialStreak));
      return initialStreak;
    }
    
    // Check if streak needs updating
    const streak: StudyStreak = JSON.parse(data);
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (streak.lastActiveDate !== todayStr) {
      const lastActive = new Date(streak.lastActiveDate);
      const today = new Date(todayStr);
      const diffTime = Math.abs(today.getTime() - lastActive.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Incremented streak if it was active yesterday
        streak.currentStreak += 1;
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }
        streak.lastActiveDate = todayStr;
        localStorage.setItem(KEYS.STREAK, JSON.stringify(streak));
      } else if (diffDays > 1) {
        // Streak broken
        streak.currentStreak = 1;
        streak.lastActiveDate = todayStr;
        localStorage.setItem(KEYS.STREAK, JSON.stringify(streak));
      }
    }
    
    return streak;
  },

  saveStreak(streak: StudyStreak): void {
    localStorage.setItem(KEYS.STREAK, JSON.stringify(streak));
  },

  getSettings(): AppSettings {
    const data = localStorage.getItem(KEYS.SETTINGS);
    if (!data) {
      const defaultSettings: AppSettings = {
        theme: 'light',
        notificationsEnabled: true,
        language: 'vi',
      };
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return JSON.parse(data);
  },

  saveSettings(settings: AppSettings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Export full backup JSON
  exportBackup(): string {
    const backup = {
      tasks: this.getTasks(),
      events: this.getEvents(),
      notes: this.getNotes(),
      goals: this.getGoals(),
      exam: this.getExam(),
      streak: this.getStreak(),
      settings: this.getSettings(),
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },

  // Import full backup JSON
  importBackup(backupStr: string): boolean {
    try {
      const backup = JSON.parse(backupStr);
      if (backup.tasks) localStorage.setItem(KEYS.TASKS, JSON.stringify(backup.tasks));
      if (backup.events) localStorage.setItem(KEYS.EVENTS, JSON.stringify(backup.events));
      if (backup.notes) localStorage.setItem(KEYS.NOTES, JSON.stringify(backup.notes));
      if (backup.goals) localStorage.setItem(KEYS.GOALS, JSON.stringify(backup.goals));
      if (backup.exam) localStorage.setItem(KEYS.EXAM, JSON.stringify(backup.exam));
      if (backup.streak) localStorage.setItem(KEYS.STREAK, JSON.stringify(backup.streak));
      if (backup.settings) localStorage.setItem(KEYS.SETTINGS, JSON.stringify(backup.settings));
      return true;
    } catch (e) {
      console.error('Failed to parse import backup JSON', e);
      return false;
    }
  }
};
