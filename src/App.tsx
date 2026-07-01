/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Sparkles, 
  Settings as SettingsIcon, 
  LogOut, 
  BookOpen,
  CloudCheck,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';

import { 
  Task, 
  CalendarEvent, 
  Note, 
  IELTSGoals, 
  IELTSExam, 
  StudyStreak, 
  AppSettings, 
  UserProfile 
} from './types';

import { storageService } from './services/storageService';
import { syncService } from './services/syncService.ts';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import CalendarView from './components/CalendarView';
import TaskView from './components/TaskView';
import NotesView from './components/NotesView';
import GoalsView from './components/GoalsView';
import StatisticsView from './components/StatisticsView';
import SettingsView from './components/SettingsView';
import ImportModal from './components/ImportModal';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // App database states
  const [user, setUser] = useState<UserProfile>(storageService.getStreak() ? {
    name: 'Trần Dương Tuấn Duy',
    email: 'tranduongtuanduy.6a4@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  } : {
    name: 'Trần Dương Tuấn Duy',
    email: 'tranduongtuanduy.6a4@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [goals, setGoals] = useState<IELTSGoals>({ listening: 8.0, reading: 8.0, writing: 6.5, speaking: 7.0, overall: 7.5 });
  const [exam, setExam] = useState<IELTSExam>({ date: '', targetScore: 7.5 });
  const [streak, setStreak] = useState<StudyStreak>({ currentStreak: 5, longestStreak: 12, lastActiveDate: '' });
  const [settings, setSettings] = useState<AppSettings>({ theme: 'light', notificationsEnabled: true, language: 'vi' });
  
  // Cloud Sync status
  const [syncState, setSyncState] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Load state once on mount and subscribe to cloud sync status changes
  useEffect(() => {
    setTasks(storageService.getTasks());
    setEvents(storageService.getEvents());
    setNotes(storageService.getNotes());
    setGoals(storageService.getGoals());
    setExam(storageService.getExam());
    setStreak(storageService.getStreak());
    setSettings(storageService.getSettings());

    const unsubscribeSync = syncService.subscribe((status) => {
      if (status.isLoggedIn && status.user) {
        setUser({
          name: status.user.displayName || 'Thành viên Cloud',
          email: status.user.email || 'unknown@studycal.com',
          avatar: status.user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        });
      } else {
        // Reset to offline/default profile on logout
        setUser({
          name: 'Trần Dương Tuấn Duy',
          email: 'tranduongtuanduy.6a4@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        });
      }

      if (status.syncing) {
        setSyncState('syncing');
      } else if (status.isLoggedIn) {
        setSyncState('synced');
      } else {
        setSyncState('offline');
      }
    });

    const handleStorageChange = () => {
      setTasks(storageService.getTasks());
      setEvents(storageService.getEvents());
      setNotes(storageService.getNotes());
      setGoals(storageService.getGoals());
      setExam(storageService.getExam());
      setStreak(storageService.getStreak());
      setSettings(storageService.getSettings());
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribeSync();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Sync state triggers: actually pushes local state to cloud if logged in
  const triggerCloudSync = () => {
    const status = syncService.getStatus();
    if (status.isLoggedIn) {
      setSyncState('syncing');
      syncService.pushLocalToCloud().then((success) => {
        setSyncState(success ? 'synced' : 'offline');
      });
    } else {
      setSyncState('syncing');
      const timer = setTimeout(() => {
        setSyncState('offline');
      }, 800);
      return () => clearTimeout(timer);
    }
  };

  // Dark Mode side effects
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Tasks actions
  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`
    };
    const updated = [...tasks, task];
    setTasks(updated);
    storageService.saveTasks(updated);
    triggerCloudSync();
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const updated = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    setTasks(updated);
    storageService.saveTasks(updated);
    triggerCloudSync();
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    storageService.saveTasks(updated);
    triggerCloudSync();
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    storageService.saveTasks(updated);
    triggerCloudSync();
  };

  // Events actions
  const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: `event-${Date.now()}`
    };
    const updated = [...events, event];
    setEvents(updated);
    storageService.saveEvents(updated);
    triggerCloudSync();
  };

  const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
    const updated = events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
    setEvents(updated);
    storageService.saveEvents(updated);
    triggerCloudSync();
  };

  const handleToggleEvent = (id: string) => {
    const updated = events.map(e => e.id === id ? { ...e, completed: !e.completed } : e);
    setEvents(updated);
    storageService.saveEvents(updated);
    triggerCloudSync();
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    storageService.saveEvents(updated);
    triggerCloudSync();
  };

  // Notes actions
  const handleAddNote = (newNote: Omit<Note, 'id' | 'updatedAt'>) => {
    const note: Note = {
      ...newNote,
      id: `note-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    const updated = [...notes, note];
    setNotes(updated);
    storageService.saveNotes(updated);
    triggerCloudSync();
  };

  const handleUpdateNote = (updatedNote: Note) => {
    const updated = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
    setNotes(updated);
    storageService.saveNotes(updated);
    triggerCloudSync();
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    storageService.saveNotes(updated);
    triggerCloudSync();
  };

  // Goals & Exam actions
  const handleSaveGoals = (updatedGoals: IELTSGoals) => {
    setGoals(updatedGoals);
    storageService.saveGoals(updatedGoals);
    triggerCloudSync();
  };

  const handleUpdateExamDate = (newDate: string) => {
    const updatedExam = { ...exam, date: newDate };
    setExam(updatedExam);
    storageService.saveExam(updatedExam);
    triggerCloudSync();
  };

  // User Profile actions
  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    // Profile is persisted alongside settings/streak in standard flow
    triggerCloudSync();
  };

  // Settings actions
  const handleUpdateSettings = (updatedSettings: AppSettings) => {
    setSettings(updatedSettings);
    storageService.saveSettings(updatedSettings);
    triggerCloudSync();
  };

  // Reset System action
  const handleResetAllData = () => {
    localStorage.clear();
    setTasks(storageService.getTasks());
    setEvents(storageService.getEvents());
    setNotes(storageService.getNotes());
    setGoals(storageService.getGoals());
    setExam(storageService.getExam());
    setStreak(storageService.getStreak());
    setSettings(storageService.getSettings());
    setTab('dashboard');
    triggerCloudSync();
  };

  // Bulk Import handler
  const handleBulkImport = (importedEvents: CalendarEvent[], importedTasks: Task[]) => {
    const combinedEvents = [...events, ...importedEvents];
    const combinedTasks = [...tasks, ...importedTasks];
    
    setEvents(combinedEvents);
    setTasks(combinedTasks);
    
    storageService.saveEvents(combinedEvents);
    storageService.saveTasks(combinedTasks);
    
    triggerCloudSync();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark text-gray-800 dark:text-pink-100 transition-colors duration-300">
      
      {/* Sidebar navigation */}
      <Sidebar 
        currentTab={tab} 
        setTab={setTab} 
        user={user} 
        syncState={syncState}
        isMobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isDark={settings.theme === 'dark'}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Workspace Top Toolbar */}
        <header className="hidden md:flex h-20 items-center justify-between px-10 bg-white/50 dark:bg-brand-dark-card/30 backdrop-blur-sm border-b border-pink-50 dark:border-brand-dark-border/40 select-none">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400 dark:text-pink-300/40 font-bold uppercase tracking-wider">
              {tab === 'dashboard' ? 'Trang chủ' : 
               tab === 'calendar' ? 'Lịch học' : 
               tab === 'tasks' ? 'Nhiệm vụ học' : 
               tab === 'notes' ? 'Sổ ghi chép' : 
               tab === 'goals' ? 'Đích đến' : 
               tab === 'statistics' ? 'Số liệu' : 'Cấu hình'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Direct Docx Word Importer Button */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-2 bg-[#EC4899] hover:bg-[#db3a86] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md shadow-pink-200/60 dark:shadow-none transition-all cursor-pointer hover:scale-102"
            >
              <FileText className="w-4 h-4" />
              <span>📄 Import Study Schedule</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 bg-white dark:bg-brand-dark-card border border-pink-100 dark:border-brand-dark-border p-1.5 rounded-xl hover:bg-pink-50/50 transition-colors"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-pink-100 dark:ring-pink-900"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs font-semibold text-gray-700 dark:text-pink-200 pr-1">{user.name.split(' ').pop()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-brand-dark-card border border-pink-100 dark:border-brand-dark-border rounded-xl shadow-lg py-1.5 z-20 overflow-hidden"
                    >
                      <button
                        onClick={() => { setTab('settings'); setIsProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-pink-200 hover:bg-pink-50 dark:hover:bg-pink-950/30 text-left"
                      >
                        <SettingsIcon className="w-4 h-4 text-gray-400" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={handleResetAllData}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-pink-950/30 text-left border-t border-pink-50 dark:border-brand-dark-border mt-1 pt-1.5"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Reset Workspace</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content View Canvas wrapper with Framer Motion page switchers */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Mobile direct Import trigger banner */}
          <div className="md:hidden mb-4 p-3 bg-pink-500 rounded-xl text-white flex items-center justify-between text-xs font-bold shadow-sm">
            <span>Đã có file giáo trình .docx?</span>
            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="bg-white text-pink-600 px-3 py-1 rounded-lg text-[10px]"
            >
              📄 Import ngay
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
            >
              {tab === 'dashboard' && (
                <DashboardView 
                  tasks={tasks}
                  events={events}
                  goals={goals}
                  exam={exam}
                  streak={streak}
                  toggleTask={handleToggleTask}
                  toggleEvent={handleToggleEvent}
                  setTab={setTab}
                  updateExamDate={handleUpdateExamDate}
                />
              )}

              {tab === 'calendar' && (
                <CalendarView 
                  events={events}
                  addEvent={handleAddEvent}
                  updateEvent={handleUpdateEvent}
                  deleteEvent={handleDeleteEvent}
                  toggleEvent={handleToggleEvent}
                />
              )}

              {tab === 'tasks' && (
                <TaskView 
                  tasks={tasks}
                  addTask={handleAddTask}
                  updateTask={handleUpdateTask}
                  deleteTask={handleDeleteTask}
                  toggleTask={handleToggleTask}
                />
              )}

              {tab === 'notes' && (
                <NotesView 
                  notes={notes}
                  addNote={handleAddNote}
                  updateNote={handleUpdateNote}
                  deleteNote={handleDeleteNote}
                />
              )}

              {tab === 'goals' && (
                <GoalsView 
                  goals={goals}
                  saveGoals={handleSaveGoals}
                />
              )}

              {tab === 'statistics' && (
                <StatisticsView 
                  tasks={tasks}
                  events={events}
                  streak={streak}
                />
              )}

              {tab === 'settings' && (
                <SettingsView 
                  user={user}
                  updateUser={handleUpdateUser}
                  settings={settings}
                  updateSettings={handleUpdateSettings}
                  resetAllData={handleResetAllData}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Docx Importer Modal Component */}
      <ImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleBulkImport}
      />
    </div>
  );
}
