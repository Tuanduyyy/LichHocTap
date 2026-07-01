/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Flame, 
  Clock, 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { Task, CalendarEvent, IELTSGoals, IELTSExam, StudyStreak } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardViewProps {
  tasks: Task[];
  events: CalendarEvent[];
  goals: IELTSGoals;
  exam: IELTSExam;
  streak: StudyStreak;
  toggleTask: (id: string) => void;
  toggleEvent: (id: string) => void;
  setTab: (tab: string) => void;
  updateExamDate: (date: string) => void;
}

export default function DashboardView({
  tasks,
  events,
  goals,
  exam,
  streak,
  toggleTask,
  toggleEvent,
  setTab,
  updateExamDate
}: DashboardViewProps) {
  const [isEditingExam, setIsEditingExam] = useState(false);
  const [examInputDate, setExamInputDate] = useState(exam.date);

  // Filter tasks & events for today
  const todayStr = new Date().toISOString().split('T')[0];
  
  const todayTasks = tasks.filter(t => t.date === todayStr);
  const todayEvents = events.filter(e => e.date === todayStr);

  const completedTasksToday = todayTasks.filter(t => t.completed).length;
  const totalTasksToday = todayTasks.length;
  
  const completedEventsToday = todayEvents.filter(e => e.completed).length;
  const totalEventsToday = todayEvents.length;

  const totalItemsToday = totalTasksToday + totalEventsToday;
  const completedItemsToday = completedTasksToday + completedEventsToday;
  const progressPercent = totalItemsToday > 0 
    ? Math.round((completedItemsToday / totalItemsToday) * 100) 
    : 0;

  // Calculate Countdown
  const calculateDaysLeft = () => {
    const today = new Date(todayStr);
    const examDate = new Date(exam.date);
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = calculateDaysLeft();

  // Get color for categories
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Vocabulary': return 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900/40';
      case 'Listening': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900/40';
      case 'Reading': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900/40';
      case 'Writing': return 'bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border-pink-200 dark:border-pink-900/40';
      case 'Speaking': return 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-900/40';
      case 'Grammar': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40';
      case 'Mock Test': return 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900/40';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30';
      case 'Medium': return 'text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30';
      default: return 'text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30';
    }
  };

  // Structured Study Hours for charts
  const weeklyData = [
    { day: 'T2', hours: 2.5 },
    { day: 'T3', hours: 3.0 },
    { day: 'T4', hours: 1.5 },
    { day: 'T5', hours: 4.0 },
    { day: 'T6', hours: 2.0 },
    { day: 'T7', hours: 4.5 },
    { day: 'CN', hours: todayEvents.reduce((acc, curr) => acc + (curr.completed ? curr.duration / 60 : 0), 0) || 1.2 },
  ];

  const handleSaveExamDate = () => {
    updateExamDate(examInputDate);
    setIsEditingExam(false);
  };

  const motivationQuotes = [
    "✨ Practice makes perfect! Hãy cố gắng thêm một chút hôm nay nhé!",
    "🌸 Mỗi một đề Listening/Reading hôm nay là một bước tiến gần hơn tới band 7.5+!",
    "🚀 Đừng nản lòng, sự nhất quán quan trọng hơn sự hoàn hảo!",
    "💖 Bạn đang làm rất tốt Trần Dương Tuấn Duy ơi, keep fighting!",
  ];

  const quoteIndex = Math.min(Math.floor(daysLeft % motivationQuotes.length), motivationQuotes.length - 1);
  const activeQuote = motivationQuotes[quoteIndex >= 0 ? quoteIndex : 0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 rounded-[32px] bg-gradient-to-br from-[#EC4899] via-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200/40 dark:shadow-none relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <BookOpen className="w-64 h-64 translate-x-12 translate-y-12" />
        </div>
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-100 animate-pulse-soft" />
            <h2 className="font-display font-bold text-2xl tracking-tight">
              Xin chào, Trần Dương Tuấn Duy 👋
            </h2>
          </div>
          <p className="text-sm text-pink-50 max-w-xl font-medium">
            {activeQuote}
          </p>
        </div>
        <div className="flex items-center gap-5 relative z-10 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/15">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-pink-100 font-bold">Mục tiêu</p>
            <p className="font-display font-bold text-2xl">Band {goals.overall}</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-pink-100 font-bold">Hoàn thành hôm nay</p>
            <p className="font-display font-bold text-2xl">{completedItemsToday}/{totalItemsToday}</p>
          </div>
        </div>
      </div>

      {/* Grid: Streak, Countdown, Progress Ring */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Study Streak */}
        <div className="premium-card p-5 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-400 dark:text-pink-300/60 uppercase tracking-wider">
              Chuỗi học tập (Streak)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-4xl text-pink-600 dark:text-pink-400">
                {streak.currentStreak}
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-pink-200/60">ngày liên tiếp 🔥</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-pink-300/60 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-pink-500" />
              <span>Kỷ lục cao nhất: {streak.longestStreak} ngày</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-950/40 flex items-center justify-center text-pink-500 shadow-inner">
            <Flame className="w-8 h-8 fill-pink-500 stroke-pink-500 animate-pulse-soft" />
          </div>
        </div>

        {/* Exam Countdown */}
        <div className="premium-card p-5 flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 dark:text-pink-300/60 uppercase tracking-wider">
                Đếm ngược Ngày thi / Sự kiện
              </span>
              <button 
                onClick={() => setIsEditingExam(!isEditingExam)}
                className="text-[10px] text-pink-500 hover:underline font-semibold"
              >
                {isEditingExam ? 'Huỷ' : 'Đổi ngày'}
              </button>
            </div>

            {isEditingExam ? (
              <div className="flex items-center gap-2 mt-1">
                <input 
                  type="date" 
                  value={examInputDate}
                  onChange={(e) => setExamInputDate(e.target.value)}
                  className="px-2 py-1 text-xs rounded border border-pink-200 dark:border-pink-900 bg-white dark:bg-pink-950/60 text-gray-800 dark:text-pink-100 outline-none"
                />
                <button 
                  onClick={handleSaveExamDate}
                  className="bg-pink-500 text-white px-2 py-1 text-xs rounded font-semibold hover:bg-pink-600 transition-colors"
                >
                  Lưu
                </button>
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-bold text-4xl text-pink-600 dark:text-pink-400">
                  {daysLeft}
                </span>
                <span className="text-sm font-medium text-gray-500 dark:text-pink-200/60">Ngày còn lại ⏳</span>
              </div>
            )}
            
            <p className="text-xs text-gray-500 dark:text-pink-300/60">
              Ngày mục tiêu: {new Date(exam.date).toLocaleDateString('vi-VN')}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-950/40 flex items-center justify-center text-pink-500 shadow-inner">
            <Clock className="w-8 h-8 text-pink-500" />
          </div>
        </div>

        {/* Today's Progress */}
        <div className="premium-card p-5 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-400 dark:text-pink-300/60 uppercase tracking-wider">
              Tiến độ hôm nay
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-4xl text-pink-600 dark:text-pink-400">
                {progressPercent}%
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-pink-200/60">hoàn tất</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-pink-300/60">
              {completedItemsToday} trong {totalItemsToday} nhiệm vụ + sự kiện
            </p>
          </div>

          {/* SVG Progress Circle */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-pink-100 dark:stroke-pink-950"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-pink-500"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - progressPercent / 100)}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-bold text-gray-700 dark:text-pink-200">
              ✓
            </span>
          </div>
        </div>
      </div>

      {/* Main Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Schedule & Tasks */}
        <div className="lg:col-span-8 space-y-6">
          {/* Today's Schedule (Events) */}
          <div className="premium-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-500" />
                <h3 className="font-display font-bold text-lg text-gray-800 dark:text-pink-100">
                  🌸 Lịch học hôm nay
                </h3>
              </div>
              <button 
                onClick={() => setTab('calendar')}
                className="text-xs text-pink-500 hover:text-pink-600 font-semibold flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayEvents.length === 0 ? (
              <div className="py-10 text-center space-y-3 bg-pink-50/20 dark:bg-pink-950/10 rounded-xl border border-dashed border-pink-100 dark:border-pink-900/40">
                <p className="text-sm font-semibold text-gray-500 dark:text-pink-300/70">
                  🎉 Hôm nay bạn không có lịch học.
                </p>
                <button
                  onClick={() => setTab('calendar')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lên lịch mới ngay</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {todayEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-pink-50/20 dark:bg-pink-950/10 border border-pink-100/40 dark:border-pink-900/30 hover:border-pink-300 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleEvent(event.id)}
                        className="text-pink-500 hover:text-pink-600 transition-colors"
                      >
                        {event.completed ? (
                          <CheckCircle2 className="w-5 h-5 fill-pink-500 text-white" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      <div>
                        <h4 className={`text-sm font-semibold text-gray-800 dark:text-pink-100 ${event.completed ? 'line-through text-gray-400 dark:text-pink-300/40' : ''}`}>
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getCategoryColor(event.category)}`}>
                            {event.category}
                          </span>
                          <span className="text-[11px] text-gray-400 dark:text-pink-300/40 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time} ({event.duration} phút)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Tasks */}
          <div className="premium-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-pink-500" />
                <h3 className="font-display font-bold text-lg text-gray-800 dark:text-pink-100">
                  📌 Nhiệm vụ hôm nay
                </h3>
              </div>
              <button 
                onClick={() => setTab('tasks')}
                className="text-xs text-pink-500 hover:text-pink-600 font-semibold flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <div className="py-10 text-center space-y-3 bg-pink-50/20 dark:bg-pink-950/10 rounded-xl border border-dashed border-pink-100 dark:border-pink-900/40">
                <p className="text-sm font-semibold text-gray-500 dark:text-pink-300/70">
                  🌈 Đã hoàn thành mọi nhiệm vụ hoặc chưa có nhiệm vụ nào cho hôm nay!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {todayTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-pink-50/20 dark:bg-pink-950/10 border border-pink-100/40 dark:border-pink-900/30 hover:border-pink-300 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className="text-pink-500 hover:text-pink-600 transition-colors"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 fill-pink-500 text-white" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      <div>
                        <h4 className={`text-sm font-semibold text-gray-800 dark:text-pink-100 ${task.completed ? 'line-through text-gray-400 dark:text-pink-300/40' : ''}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getCategoryColor(task.category)}`}>
                            {task.category}
                          </span>
                          <span className={getPriorityBadge(task.priority)}>
                            {task.priority === 'High' ? 'Cao' : task.priority === 'Medium' ? 'Trung bình' : 'Thấp'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Weekly Hours Tracker & Quick Stats */}
        <div className="lg:col-span-4 space-y-6">
          {/* Weekly Hour Tracker Chart */}
          <div className="premium-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-sm text-gray-800 dark:text-pink-100">
                  📈 Thống kê giờ học tuần này
                </h3>
                <p className="text-xs text-gray-400 dark:text-pink-300/60 mt-0.5">Giờ học tích luỹ theo ngày</p>
              </div>
              <TrendingUp className="w-4 h-4 text-pink-500" />
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#F472B6" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#F472B6" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 248, 251, 0.95)', 
                      borderRadius: '12px',
                      borderColor: '#FBCFE8',
                      fontSize: '11px',
                      color: '#1F2937'
                    }} 
                  />
                  <Area type="monotone" dataKey="hours" stroke="#EC4899" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Target Breakdown */}
          <div className="premium-card p-5">
            <h3 className="font-display font-bold text-sm text-gray-800 dark:text-pink-100 mb-4">
              🏆 Điểm thi mục tiêu
            </h3>
            
            <div className="space-y-3">
              {[
                { name: 'Listening', score: goals.listening, color: 'bg-blue-500' },
                { name: 'Reading', score: goals.reading, color: 'bg-yellow-500' },
                { name: 'Writing', score: goals.writing, color: 'bg-pink-500' },
                { name: 'Speaking', score: goals.speaking, color: 'bg-orange-500' },
              ].map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-600 dark:text-pink-200">{skill.name}</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-pink-100">{skill.score}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-pink-950/40 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`${skill.color} h-full rounded-full`}
                      style={{ width: `${(skill.score / 9.0) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trạm Học Tập Focus Hub Card */}
          <div className="premium-card p-5 relative overflow-hidden group border border-pink-100/70 dark:border-pink-900/40 bg-gradient-to-br from-white via-pink-50/10 to-rose-50/10 dark:from-brand-dark-card dark:via-pink-950/5 dark:to-rose-950/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/30 dark:bg-pink-950/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8 animate-pulse-soft" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl p-2 bg-pink-50 dark:bg-pink-950/45 rounded-xl">🎧</span>
                  <div>
                    <h4 className="font-display font-bold text-sm text-gray-800 dark:text-pink-100">
                      Trạm Học Tập
                    </h4>
                    <p className="text-[10px] text-pink-500 font-bold uppercase tracking-wider">Không Gian Tập Trung ✨</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-pink-200/70 leading-relaxed font-medium">
                Tích hợp đồng hồ <strong>Pomodoro</strong>, nhạc <strong>Lo-Fi chill</strong> và âm thanh thiên nhiên giúp bạn loại bỏ xao nhãng để tập trung học tập đạt hiệu quả cao nhất.
              </p>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 dark:text-pink-300/60 font-medium">
                <div className="flex items-center gap-1.5 bg-pink-50/50 dark:bg-pink-950/20 px-2.5 py-1.5 rounded-xl border border-pink-100/30 dark:border-pink-900/20">
                  🎵 Nhạc Lo-Fi Chill
                </div>
                <div className="flex items-center gap-1.5 bg-pink-50/50 dark:bg-pink-950/20 px-2.5 py-1.5 rounded-xl border border-pink-100/30 dark:border-pink-900/20">
                  ⏱️ Pomodoro Timer
                </div>
                <div className="flex items-center gap-1.5 bg-pink-50/50 dark:bg-pink-950/20 px-2.5 py-1.5 rounded-xl border border-pink-100/30 dark:border-pink-900/20">
                  🌿 Âm thanh tự nhiên
                </div>
                <div className="flex items-center gap-1.5 bg-pink-50/50 dark:bg-pink-950/20 px-2.5 py-1.5 rounded-xl border border-pink-100/30 dark:border-pink-900/20">
                  💬 Cộng đồng tự học
                </div>
              </div>

              <a 
                href="https://tramhoctap.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#EC4899] to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl font-bold text-xs shadow-md shadow-pink-200/30 dark:shadow-none transition-all duration-300 transform group-hover:scale-[1.02]"
              >
                <span>Ghé Trạm Học Tập Ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
