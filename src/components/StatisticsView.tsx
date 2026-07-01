/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart3, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  ListTodo, 
  Flame, 
  Sparkles,
  PieChart as PieIcon
} from 'lucide-react';
import { Task, CalendarEvent, StudyCategory, StudyStreak } from '../types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar,
  Legend
} from 'recharts';

interface StatisticsViewProps {
  tasks: Task[];
  events: CalendarEvent[];
  streak: StudyStreak;
}

export default function StatisticsView({
  tasks,
  events,
  streak
}: StatisticsViewProps) {
  // Aggregate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.completed).length;
  const eventCompletionRate = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;

  // Study hours by category calculation
  const categoryHours: Record<StudyCategory, number> = {
    'Vocabulary': 0,
    'Listening': 0,
    'Reading': 0,
    'Writing': 0,
    'Speaking': 0,
    'Grammar': 0,
    'Mock Test': 0,
  };

  events.forEach(e => {
    if (e.completed) {
      categoryHours[e.category] = (categoryHours[e.category] || 0) + (e.duration / 60);
    }
  });

  // Format data for category pie chart
  const COLORS = {
    'Vocabulary': '#A855F7', // Purple
    'Listening': '#3B82F6',  // Blue
    'Reading': '#EAB308',    // Yellow
    'Writing': '#EC4899',    // Pink
    'Speaking': '#F97316',   // Orange
    'Grammar': '#10B981',    // Green
    'Mock Test': '#EF4444',  // Red
  };

  const pieData = Object.entries(categoryHours)
    .map(([name, val]) => ({
      name,
      value: Number(val.toFixed(1)),
      color: COLORS[name as StudyCategory],
    }))
    .filter(item => item.value > 0);

  // If pieData is empty (no completed events), use some default representative proportions
  const activePieData = pieData.length > 0 ? pieData : [
    { name: 'Vocabulary', value: 1.5, color: COLORS['Vocabulary'] },
    { name: 'Listening', value: 3.0, color: COLORS['Listening'] },
    { name: 'Reading', value: 2.0, color: COLORS['Reading'] },
    { name: 'Writing', value: 2.5, color: COLORS['Writing'] },
    { name: 'Speaking', value: 1.2, color: COLORS['Speaking'] },
  ];

  // Study hours by day of week
  const studyHoursWeek = [
    { day: 'Thứ 2', hours: 3.5, tasks: 4 },
    { day: 'Thứ 3', hours: 4.0, tasks: 5 },
    { day: 'Thứ 4', hours: 2.0, tasks: 2 },
    { day: 'Thứ 5', hours: 5.5, tasks: 6 },
    { day: 'Thứ 6', hours: 3.0, tasks: 3 },
    { day: 'Thứ 7', hours: 6.0, tasks: 7 },
    { day: 'Chủ Nhật', hours: 2.5, tasks: 3 },
  ];

  const totalStudyHoursWeek = studyHoursWeek.reduce((acc, curr) => acc + curr.hours, 0);

  return (
    <div className="space-y-6">
      {/* Cards stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Total Tasks completed */}
        <div className="premium-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-pink-300/40 uppercase tracking-wider">
              Nhiệm vụ hoàn thành
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-bold text-3xl text-pink-600 dark:text-pink-400">
                {completedTasks}/{totalTasks}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-pink-300/60 font-semibold">Tỷ lệ hoàn tất {taskCompletionRate}%</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-pink-950/40 flex items-center justify-center text-purple-500">
            <ListTodo className="w-6 h-6" />
          </div>
        </div>

        {/* Study hours this week */}
        <div className="premium-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-pink-300/40 uppercase tracking-wider">
              Giờ học tuần này
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-bold text-3xl text-pink-600 dark:text-pink-400">
                {totalStudyHoursWeek.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">giờ</span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-pink-300/60 font-semibold">Bao gồm ca tự học + giải đề</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-pink-950/40 flex items-center justify-center text-blue-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Study Streak */}
        <div className="premium-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-pink-300/40 uppercase tracking-wider">
              Chuỗi học (Streak)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-bold text-3xl text-pink-600 dark:text-pink-400">
                {streak.currentStreak}
              </span>
              <span className="text-xs text-gray-400">ngày 🔥</span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-pink-300/60 font-semibold">Kỷ lục: {streak.longestStreak} ngày</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-pink-950/40 flex items-center justify-center text-orange-500">
            <Flame className="w-6 h-6 fill-current" />
          </div>
        </div>

        {/* Event success rate */}
        <div className="premium-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-pink-300/40 uppercase tracking-wider">
              Ca học hoàn thành
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-bold text-3xl text-pink-600 dark:text-pink-400">
                {completedEvents}/{totalEvents}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-pink-300/60 font-semibold">Độ tập trung: {eventCompletionRate}%</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-pink-950/40 flex items-center justify-center text-emerald-500">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area chart study trend */}
        <div className="lg:col-span-8 premium-card p-5">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-pink-50 dark:border-pink-950/40">
            <div>
              <h3 className="font-display font-bold text-sm text-gray-800 dark:text-pink-100 flex items-center gap-1.5">
                <TrendingUp className="w-4.5 h-4.5 text-pink-500" />
                <span>Tiến trình tích luỹ học tập</span>
              </h3>
              <p className="text-[11px] text-gray-400 dark:text-pink-300/60">Biểu đồ đối chiếu thời lượng học tập và số lượng bài tập hoàn tất hằng ngày</p>
            </div>
            <Sparkles className="w-4 h-4 text-pink-500 animate-pulse-soft" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyHoursWeek} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHoursLarge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" name="Thời lượng học (Giờ)" dataKey="hours" stroke="#EC4899" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHoursLarge)" />
                <Area type="monotone" name="Bài tập hoàn thành (Task)" dataKey="tasks" stroke="#3B82F6" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill category donut/pie chart */}
        <div className="lg:col-span-4 premium-card p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-pink-50 dark:border-pink-950/40">
            <h3 className="font-display font-bold text-sm text-gray-800 dark:text-pink-100 flex items-center gap-1.5">
              <PieIcon className="w-4.5 h-4.5 text-pink-500" />
              <span>Cơ cấu phân bổ kỹ năng</span>
            </h3>
            <p className="text-[11px] text-gray-400 dark:text-pink-300/60 mt-0.5">Biểu đồ thể hiện sự tập trung phân chia theo 4 kỹ năng chính & ngữ pháp</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center relative my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {activePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 248, 251, 0.95)', 
                    borderRadius: '10px',
                    borderColor: '#FBCFE8',
                    fontSize: '10px',
                    color: '#1F2937'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Overlay Center Target Score */}
            <div className="absolute text-center flex flex-col items-center justify-center">
              <span className="text-[9px] uppercase font-bold text-gray-400 dark:text-pink-300/60">Luyện nhiều</span>
              <span className="text-xs font-bold text-pink-500 font-display">Listening</span>
            </div>
          </div>

          {/* Pie Chart Custom Legend */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px] border-t border-pink-50 dark:border-pink-950/40 pt-3">
            {activePieData.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5 font-semibold text-gray-600 dark:text-pink-200">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name} ({item.value}h)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
