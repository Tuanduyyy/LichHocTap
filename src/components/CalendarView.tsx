/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  X, 
  Trash2, 
  Check, 
  Calendar as CalendarIcon,
  Sparkles,
  Smile
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarEvent, StudyCategory } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  toggleEvent: (id: string) => void;
}

export default function CalendarView({
  events,
  addEvent,
  updateEvent,
  deleteEvent,
  toggleEvent
}: CalendarViewProps) {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // Event Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('09:00');
  const [formDuration, setFormDuration] = useState(60);
  const [formCategory, setFormCategory] = useState<StudyCategory>('Vocabulary');
  const [formDescription, setFormDescription] = useState('');

  const categories: StudyCategory[] = [
    'Vocabulary',
    'Listening',
    'Reading',
    'Writing',
    'Speaking',
    'Grammar',
    'Mock Test'
  ];

  const getCategoryClasses = (cat: StudyCategory) => {
    switch (cat) {
      case 'Vocabulary': return 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900/40';
      case 'Listening': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900/40';
      case 'Reading': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900/40';
      case 'Writing': return 'bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border-pink-200 dark:border-pink-900/40';
      case 'Speaking': return 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-900/40';
      case 'Grammar': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40';
      case 'Mock Test': return 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900/40';
    }
  };

  const getCategoryDot = (cat: StudyCategory) => {
    switch (cat) {
      case 'Vocabulary': return 'bg-purple-500';
      case 'Listening': return 'bg-blue-500';
      case 'Reading': return 'bg-yellow-500';
      case 'Writing': return 'bg-pink-500';
      case 'Speaking': return 'bg-orange-500';
      case 'Grammar': return 'bg-emerald-500';
      case 'Mock Test': return 'bg-rose-500';
    }
  };

  // Helper date arithmetic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    // Adjust day index so Monday is 0, Sunday is 6
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = () => {
    if (view === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (view === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (view === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  // Open Form Modal for Creating New Event
  const openCreateModal = (dateStr?: string) => {
    setSelectedEvent(null);
    setFormTitle('');
    setFormDate(dateStr || new Date().toISOString().split('T')[0]);
    setFormTime('09:00');
    setFormDuration(60);
    setFormCategory('Vocabulary');
    setFormDescription('');
    setIsModalOpen(true);
  };

  // Open Form Modal for Editing Event
  const openEditModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setFormTitle(event.title);
    setFormDate(event.date);
    setFormTime(event.time);
    setFormDuration(event.duration);
    setFormCategory(event.category);
    setFormDescription(event.description);
    setIsModalOpen(true);
  };

  // Handle Event submission
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (selectedEvent) {
      updateEvent({
        ...selectedEvent,
        title: formTitle,
        date: formDate,
        time: formTime,
        duration: Number(formDuration),
        category: formCategory,
        description: formDescription,
      });
    } else {
      addEvent({
        title: formTitle,
        date: formDate,
        time: formTime,
        duration: Number(formDuration),
        category: formCategory,
        description: formDescription,
        notes: '',
        completed: false,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    setIsModalOpen(false);
  };

  // View render helpers
  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);
    const blanks = Array(firstDayIndex).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const gridItems = [...blanks, ...days];

    const weekLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    return (
      <div className="space-y-4">
        {/* Days of week labels */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 dark:text-pink-300/40 uppercase">
          {weekLabels.map((lbl, idx) => (
            <div key={idx} className="py-2">{lbl}</div>
          ))}
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-7 gap-2">
          {gridItems.map((dayNum, index) => {
            if (dayNum === null) {
              return (
                <div 
                  key={`blank-${index}`} 
                  className="aspect-square bg-gray-50/30 dark:bg-pink-950/5 rounded-xl border border-transparent" 
                />
              );
            }

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.date === dateStr);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div 
                key={`day-${dayNum}`}
                onClick={(e) => {
                  // Prevent opening modal if clicking nested elements
                  if (e.target === e.currentTarget) {
                    openCreateModal(dateStr);
                  }
                }}
                className={`aspect-square p-2 rounded-xl bg-white dark:bg-brand-dark-card border transition-all hover:border-pink-300 dark:hover:border-pink-800 cursor-pointer flex flex-col justify-between ${
                  isToday 
                    ? 'border-pink-500 ring-1 ring-pink-500/20' 
                    : 'border-pink-100/50 dark:border-pink-950/50'
                }`}
              >
                {/* Day header */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
                    isToday ? 'bg-pink-500 text-white shadow-sm' : 'text-gray-700 dark:text-pink-100'
                  }`}>
                    {dayNum}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openCreateModal(dateStr);
                    }}
                    className="p-0.5 text-gray-300 hover:text-pink-500 dark:hover:text-pink-300 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Day events visual preview */}
                <div className="flex-1 mt-1 overflow-y-auto space-y-1 select-none pointer-events-auto">
                  {dayEvents.slice(0, 2).map(ev => (
                    <div 
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(ev);
                      }}
                      className={`text-[9px] px-1.5 py-0.5 rounded border leading-tight truncate flex items-center gap-1 font-semibold hover:opacity-90 ${getCategoryClasses(ev.category)} ${ev.completed ? 'opacity-40 line-through' : ''}`}
                    >
                      <span className={`w-1 h-1 rounded-full ${getCategoryDot(ev.category)}`} />
                      <span className="truncate">{ev.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[8px] text-center text-pink-500 font-bold">
                      +{dayEvents.length - 2} bài học
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    // Get start of week (Monday)
    const currentDay = currentDate.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - distanceToMonday);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day, idx) => {
          const dateStr = day.toISOString().split('T')[0];
          const dayEvents = events.filter(e => e.date === dateStr);
          const isToday = new Date().toISOString().split('T')[0] === dateStr;

          const daysNamesVi = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

          return (
            <div 
              key={idx}
              className={`p-3.5 rounded-xl bg-white dark:bg-brand-dark-card border flex flex-col min-h-[300px] ${
                isToday 
                  ? 'border-pink-500 shadow-sm' 
                  : 'border-pink-100/50 dark:border-pink-950/40'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-pink-50/50 dark:border-pink-950/20">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{daysNamesVi[idx]}</h4>
                  <span className={`text-base font-display font-bold font-mono ${isToday ? 'text-pink-500' : 'text-gray-700 dark:text-pink-200'}`}>
                    {day.getDate()}/{day.getMonth() + 1}
                  </span>
                </div>
                <button 
                  onClick={() => openCreateModal(dateStr)}
                  className="p-1 rounded-lg bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 dark:hover:bg-pink-900/60 text-pink-500 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Day Events Stack */}
              <div className="flex-1 space-y-2 overflow-y-auto max-h-[350px]">
                {dayEvents.length === 0 ? (
                  <div className="h-full flex items-center justify-center py-6 text-center text-[11px] text-gray-300 dark:text-pink-900/40 italic">
                    Chưa có lịch học
                  </div>
                ) : (
                  dayEvents.map(ev => (
                    <div 
                      key={ev.id}
                      onClick={() => openEditModal(ev)}
                      className={`p-2.5 rounded-xl border cursor-pointer hover:scale-[1.02] transition-all ${getCategoryClasses(ev.category)} ${ev.completed ? 'opacity-40 line-through' : ''}`}
                    >
                      <h5 className="text-xs font-bold truncate leading-tight">{ev.title}</h5>
                      <div className="flex items-center justify-between mt-1.5 text-[9px] opacity-80 font-semibold font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ev.time}
                        </span>
                        <span>{ev.duration}p</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayEvents = events.filter(e => e.date === dateStr);

    return (
      <div className="premium-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-bold text-gray-800 dark:text-pink-100 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-pink-500" />
              <span>Thời khóa biểu: {currentDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </h3>
            <p className="text-xs text-gray-400 dark:text-pink-300/60">Quản lý các ca học tập trung trong ngày hôm nay</p>
          </div>
          <button 
            onClick={() => openCreateModal(dateStr)}
            className="flex items-center gap-1.5 bg-pink-500 hover:bg-pink-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all shadow-pink-100"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm ca học</span>
          </button>
        </div>

        {dayEvents.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-pink-50/10 dark:bg-pink-950/5 rounded-2xl border border-dashed border-pink-100 dark:border-pink-900/30">
            <Smile className="w-10 h-10 text-pink-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-500 dark:text-pink-300/60">
              🎉 Hôm nay bạn không có lịch học. Thảnh thơi nghỉ ngơi hoặc bấm Thêm ca học nhé!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {dayEvents.map(ev => (
              <div 
                key={ev.id}
                onClick={() => openEditModal(ev)}
                className="flex items-center justify-between p-4 rounded-xl bg-pink-50/20 dark:bg-pink-950/10 border border-pink-100/40 dark:border-pink-900/20 hover:border-pink-300 dark:hover:border-pink-800 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Status Toggle Box */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEvent(ev.id);
                    }}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      ev.completed 
                        ? 'bg-pink-500 text-white shadow-sm shadow-pink-100' 
                        : 'border border-pink-200 text-transparent hover:border-pink-500'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  
                  <div>
                    <h4 className={`text-sm font-bold text-gray-800 dark:text-pink-100 ${ev.completed ? 'line-through text-gray-400 dark:text-pink-300/40' : ''}`}>
                      {ev.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-pink-300/60 mt-0.5 line-clamp-1">{ev.description || 'Chưa có mô tả nội dung học.'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getCategoryClasses(ev.category)}`}>
                        {ev.category}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-pink-300/40 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ev.time} ({ev.duration} phút)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${ev.completed ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 'bg-pink-50 text-pink-600 dark:bg-pink-950/30'}`}>
                    {ev.completed ? 'Xong' : 'Chờ học'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-brand-dark-card p-5 rounded-[24px] border border-pink-100 dark:border-pink-950/40 shadow-sm shadow-pink-100/20 dark:shadow-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-pink-950 flex items-center justify-center text-pink-500 shadow-inner">
            <CalendarIcon className="w-5 h-5 text-[#EC4899]" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-gray-800 dark:text-pink-100">
              {view === 'month' && currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
              {view === 'week' && `Tuần thứ ${Math.ceil(currentDate.getDate() / 7)}, ${currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}`}
              {view === 'day' && currentDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h2>
            <p className="text-xs text-gray-400 dark:text-pink-300/60 font-medium">Lập kế hoạch học tập cá nhân thông minh</p>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1 bg-pink-50/60 dark:bg-pink-950/40 p-1 rounded-full">
          {(['month', 'week', 'day'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                view === v
                  ? 'bg-[#EC4899] text-white shadow-sm'
                  : 'text-gray-500 hover:text-[#EC4899] dark:text-pink-300'
              }`}
            >
              {v === 'month' ? 'Tháng' : v === 'week' ? 'Tuần' : 'Ngày'}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            className="p-2.5 rounded-full bg-pink-50/50 dark:bg-pink-950/50 hover:bg-pink-100 dark:hover:bg-pink-900 border border-pink-100/40 dark:border-pink-900/30 text-gray-700 dark:text-pink-100 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 rounded-full bg-pink-50/50 dark:bg-pink-950/50 hover:bg-pink-100 dark:hover:bg-pink-900 border border-pink-100/40 dark:border-pink-900/30 text-xs font-bold text-gray-700 dark:text-pink-100 transition-colors cursor-pointer"
          >
            Hôm nay
          </button>
          <button 
            onClick={handleNext}
            className="p-2.5 rounded-full bg-pink-50/50 dark:bg-pink-950/50 hover:bg-pink-100 dark:hover:bg-pink-900 border border-pink-100/40 dark:border-pink-900/30 text-gray-700 dark:text-pink-100 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => openCreateModal()}
            className="flex items-center gap-1.5 bg-[#EC4899] hover:bg-[#db3a86] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md shadow-pink-200/50 transition-all cursor-pointer hover:scale-102 ml-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm ca</span>
          </button>
        </div>
      </div>

      {/* Render selected view */}
      <div className="transition-all duration-300">
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
      </div>

      {/* Event Details / Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-brand-dark-card w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-pink-100 dark:border-brand-dark-border"
            >
              <div className="bg-gradient-to-r from-pink-500 to-pink-400 px-5 py-4 flex items-center justify-between text-white">
                <h3 className="font-display font-bold text-base flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 animate-pulse-soft" />
                  <span>{selectedEvent ? 'Chi tiết ca học' : 'Lên ca học mới'}</span>
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="p-5 space-y-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-pink-300/60 uppercase">Tên ca học / Đề tài</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Luyện Listening Cam 18 - Section 2..."
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-800 dark:text-pink-100 text-sm outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                {/* Category selectors */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-pink-300/60 uppercase">Phân loại kỹ năng</label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {categories.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setFormCategory(cat)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                          formCategory === cat
                            ? 'bg-pink-500 text-white shadow-sm border-pink-500'
                            : 'bg-white dark:bg-pink-950/10 border-pink-100 dark:border-pink-900/40 text-gray-600 dark:text-pink-300 hover:border-pink-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DateTime fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 dark:text-pink-300/60 uppercase">Ngày học</label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-800 dark:text-pink-100 text-xs outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 dark:text-pink-300/60 uppercase">Giờ học</label>
                    <input
                      type="time"
                      required
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-800 dark:text-pink-100 text-xs outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-pink-300/60 uppercase">Thời lượng học tập</label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-800 dark:text-pink-100 text-xs outline-none focus:border-pink-500"
                  >
                    <option value={30}>30 phút (Học nhanh / Review)</option>
                    <option value={45}>45 phút (Nói Speaking Part 1/2)</option>
                    <option value={60}>60 phút (Luyện Viết Task 1 & 2)</option>
                    <option value={90}>90 phút (Nghe & Sửa lỗi chi tiết)</option>
                    <option value={120}>120 phút (Đề Đọc Reading hoàn chỉnh)</option>
                    <option value={180}>180 phút (Mock Test 3 Kỹ năng)</option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-pink-300/60 uppercase">Mô tả / Ghi chú buổi học</label>
                  <textarea
                    placeholder="Mục tiêu buổi học, số câu đúng mong muốn, cấu trúc ngữ pháp cần sử dụng..."
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-800 dark:text-pink-100 text-xs outline-none focus:border-pink-500"
                  />
                </div>

                {/* Submit Box */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  {selectedEvent ? (
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedEvent.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-100 hover:bg-rose-50 hover:text-rose-600 text-rose-500 text-xs font-semibold transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa ca</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-pink-100 dark:border-pink-950 text-gray-500 dark:text-pink-300 text-xs font-semibold hover:bg-pink-50/50 transition-colors"
                    >
                      Đóng
                    </button>
                    <button
                      type="submit"
                      className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-pink-100 transition-colors"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
