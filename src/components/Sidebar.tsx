/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  FileText, 
  Target, 
  BarChart3, 
  Settings, 
  Cloud, 
  Sparkles,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  user: UserProfile;
  syncState: 'synced' | 'syncing' | 'offline';
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isDark: boolean;
}

export default function Sidebar({ 
  currentTab, 
  setTab, 
  user, 
  syncState, 
  isMobileOpen, 
  setMobileOpen,
  isDark
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Lịch học (Calendar)', icon: Calendar },
    { id: 'tasks', label: 'Nhiệm vụ (Tasks)', icon: CheckSquare },
    { id: 'notes', label: 'Ghi chú (Notes)', icon: FileText },
    { id: 'goals', label: 'Mục tiêu (Goals)', icon: Target },
    { id: 'statistics', label: 'Thống kê (Statistics)', icon: BarChart3 },
    { id: 'settings', label: 'Cài đặt (Settings)', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-5 select-none">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-[#EC4899] rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-pink-200 dark:shadow-none">
            🌸
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight tracking-tight text-gray-800 dark:text-pink-100">
              STUDYCAL
            </h1>
            <span className="text-[10px] font-bold tracking-wider text-[#EC4899] dark:text-pink-400 uppercase">
              Lịch & Học Tập ✨
            </span>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="px-2 mb-6">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/50 dark:bg-pink-950/25 border border-pink-100 dark:border-pink-900/40 text-xs">
            <div className="flex items-center gap-2">
              <Cloud className={`w-4 h-4 ${
                syncState === 'syncing' ? 'text-amber-500 animate-spin' :
                syncState === 'synced' ? 'text-emerald-500' : 'text-gray-400'
              }`} />
              <span className="font-medium text-gray-600 dark:text-pink-200">
                {syncState === 'syncing' ? 'Đang đồng bộ...' : 
                 syncState === 'synced' ? 'Đã đồng bộ Cloud' : 'Chế độ ngoại tuyến'}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-pink-50 text-[#EC4899] border-l-4 border-[#EC4899] dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-500'
                    : 'text-gray-500 dark:text-pink-200/60 hover:bg-pink-50 hover:text-[#EC4899] dark:hover:bg-pink-950/20 dark:hover:text-pink-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="w-1.5 h-1.5 rounded-full bg-[#EC4899] dark:bg-pink-400"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Trạm Học Tập Focus Hub Banner */}
        <div className="mt-6 px-1">
          <a 
            href="https://tramhoctap.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-3.5 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 dark:from-pink-950/20 dark:to-rose-950/20 border border-pink-100 dark:border-pink-900/30 hover:border-pink-300 dark:hover:border-pink-800 transition-all duration-300 text-left group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base animate-pulse">🎧</span>
              <h5 className="font-bold text-xs text-gray-800 dark:text-pink-100 uppercase tracking-wide group-hover:text-pink-500 transition-colors">
                Trạm Học Tập
              </h5>
            </div>
            <p className="text-[10px] leading-relaxed text-gray-500 dark:text-pink-300/60 mb-2 font-medium">
              Không gian nhạc Lo-Fi & Pomodoro giúp bạn tập trung cao độ khi tự học.
            </p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-pink-500 dark:text-pink-400 group-hover:translate-x-1 transition-transform">
              <span>Vào học ngay</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </a>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="pt-4 border-t border-pink-100 dark:border-pink-950/60">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-pink-50/50 dark:hover:bg-pink-950/20 transition-colors duration-200 cursor-pointer">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-pink-200 dark:ring-pink-900/60"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-pink-100 truncate">
              {user.name}
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-pink-300/60 truncate">
              {user.email}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-brand-dark-card border-b border-pink-100 dark:border-brand-dark-border sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EC4899] flex items-center justify-center text-white text-base shadow-sm">
            🌸
          </div>
          <span className="font-display font-bold text-sm tracking-tight text-gray-800 dark:text-pink-100">
            StudyCal
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!isMobileOpen)}
          className="p-1.5 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-950/40 text-gray-600 dark:text-pink-200 transition-colors"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden md:block w-64 bg-white/70 dark:bg-brand-dark-card/60 backdrop-blur-md border-r border-pink-100/60 dark:border-brand-dark-border/60 h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Drawer Overlay) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black z-40"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="md:hidden fixed inset-y-0 left-0 w-64 bg-white dark:bg-brand-dark-card z-50 shadow-xl border-r border-pink-100 dark:border-brand-dark-border"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
