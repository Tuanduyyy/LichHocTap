/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  X,
  ListTodo,
  Check,
  Calendar as CalendarIcon,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, StudyCategory, PriorityLevel, ChecklistItem } from '../types';

interface TaskViewProps {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
}

export default function TaskView({
  tasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTask
}: TaskViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StudyCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Completed' | 'Pending'>('All');
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | 'All'>('All');

  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Add Task Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('08:00');
  const [category, setCategory] = useState<StudyCategory>('Vocabulary');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [description, setDescription] = useState('');
  const [checklistInput, setChecklistInput] = useState('');
  const [notes, setNotes] = useState('');

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

  const getPriorityClasses = (prio: PriorityLevel) => {
    switch (prio) {
      case 'High': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30';
      case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30';
      case 'Low': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30';
    }
  };

  // Add sub-checklist item to an existing task
  const [newChecklistItemText, setNewChecklistItemText] = useState('');

  const handleAddChecklistItem = (task: Task) => {
    if (!newChecklistItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: Math.random().toString(),
      text: newChecklistItemText.trim(),
      completed: false,
    };
    updateTask({
      ...task,
      checklist: [...task.checklist, newItem],
    });
    setNewChecklistItemText('');
  };

  const handleToggleChecklistItem = (task: Task, itemId: string) => {
    const updatedChecklist = task.checklist.map(item => {
      if (item.id === itemId) return { ...item, completed: !item.completed };
      return item;
    });
    updateTask({
      ...task,
      checklist: updatedChecklist,
    });
  };

  const handleDeleteChecklistItem = (task: Task, itemId: string) => {
    updateTask({
      ...task,
      checklist: task.checklist.filter(item => item.id !== itemId),
    });
  };

  // Add Task handler
  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Parse pre-entered checklist items (split by commas or newlines)
    const checklistItems: ChecklistItem[] = checklistInput
      .split('\n')
      .filter(line => line.trim())
      .map(line => ({
        id: Math.random().toString(),
        text: line.trim(),
        completed: false,
      }));

    addTask({
      title: title.trim(),
      date,
      time,
      category,
      priority,
      description: description.trim(),
      notes: notes.trim(),
      checklist: checklistItems,
      completed: false,
    });

    // Reset Form
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('08:00');
    setCategory('Vocabulary');
    setPriority('Medium');
    setDescription('');
    setChecklistInput('');
    setNotes('');
    setIsFormOpen(false);
  };

  // Filter & Search Logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    
    const matchesStatus = selectedStatus === 'All' || 
                          (selectedStatus === 'Completed' && task.completed) || 
                          (selectedStatus === 'Pending' && !task.completed);
                          
    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar Filters */}
      <div className="lg:col-span-3 space-y-5">
        <div className="premium-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-pink-100/50 dark:border-pink-950/40">
            <ListTodo className="w-4.5 h-4.5 text-pink-500" />
            <h3 className="font-display font-bold text-sm text-gray-800 dark:text-pink-100">Bộ lọc thông minh</h3>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm nhiệm vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full text-xs border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-800 dark:text-pink-100 outline-none focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 transition-all"
            />
            <Search className="absolute left-3.5 top-3 w-3.5 h-3.5 text-gray-400" />
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 dark:text-pink-300/40 uppercase tracking-wider">Kỹ năng / Phân mục</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as StudyCategory | 'All')}
              className="w-full px-4 py-2.5 rounded-full border border-pink-100 dark:border-pink-900/60 bg-white dark:bg-pink-950/10 text-gray-700 dark:text-pink-200 text-xs outline-none focus:border-[#EC4899] cursor-pointer"
            >
              <option value="All">Tất cả phân mục</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 dark:text-pink-300/40 uppercase tracking-wider">Trạng thái</label>
            <div className="flex flex-col gap-1.5">
              {(['All', 'Pending', 'Completed'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedStatus === status
                      ? 'bg-pink-50 text-[#EC4899] dark:bg-pink-950/40 dark:text-pink-300 font-bold border-l-4 border-[#EC4899]'
                      : 'text-gray-500 dark:text-pink-200/60 hover:bg-pink-50/30'
                  }`}
                >
                  {status === 'All' ? 'Tất cả nhiệm vụ' : status === 'Pending' ? 'Đang thực hiện' : 'Đã hoàn thành'}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 dark:text-pink-300/40 uppercase tracking-wider">Độ ưu tiên</label>
            <div className="flex gap-1.5">
              {(['All', 'High', 'Medium', 'Low'] as const).map(prio => (
                <button
                  key={prio}
                  onClick={() => setSelectedPriority(prio)}
                  className={`flex-1 text-center py-2 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                    selectedPriority === prio
                      ? 'bg-[#EC4899] text-white border-[#EC4899] shadow-sm'
                      : 'bg-white dark:bg-pink-950/10 border-pink-100 dark:border-pink-900/40 text-gray-500 dark:text-pink-300 hover:border-pink-300'
                  }`}
                >
                  {prio === 'All' ? 'Tất cả' : prio}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-[#EC4899] hover:bg-[#db3a86] text-white py-3 rounded-full text-xs font-bold shadow-md shadow-pink-200/50 dark:shadow-none transition-all hover:scale-102 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm nhiệm vụ mới</span>
        </button>
      </div>

      {/* Tasks List */}
      <div className="lg:col-span-9 space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="premium-card p-12 text-center space-y-4 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-pink-50 dark:bg-pink-950/40 flex items-center justify-center text-pink-400">
              <ListTodo className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-gray-700 dark:text-pink-100">Không tìm thấy nhiệm vụ nào</h3>
              <p className="text-xs text-gray-400 dark:text-pink-300/60 mt-1 max-w-sm">Hãy thử thay đổi điều kiện lọc, từ khóa tìm kiếm hoặc bấm nút "Thêm nhiệm vụ mới" để thiết lập lịch ôn tập!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(task => {
              const isExpanded = expandedTaskId === task.id;
              const completedSubtasks = task.checklist.filter(item => item.completed).length;
              const totalSubtasks = task.checklist.length;

              return (
                <div 
                  key={task.id}
                  className={`premium-card p-4 transition-all duration-300 border-l-4 ${
                    task.completed 
                      ? 'border-l-gray-300 dark:border-l-pink-950 opacity-80' 
                      : task.priority === 'High' 
                        ? 'border-l-rose-500' 
                        : task.priority === 'Medium' 
                          ? 'border-l-amber-500' 
                          : 'border-l-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Checkbox button */}
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 text-pink-500 hover:text-pink-600 transition-colors flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5.5 h-5.5 fill-pink-500 text-white shadow-sm" />
                        ) : (
                          <Circle className="w-5.5 h-5.5 text-pink-200 hover:text-pink-500" />
                        )}
                      </button>

                      {/* Main Task Meta */}
                      <div className="space-y-1">
                        <h4 className={`text-sm font-bold text-gray-800 dark:text-pink-100 leading-snug cursor-pointer hover:text-pink-500 transition-colors ${task.completed ? 'line-through text-gray-400 dark:text-pink-300/40' : ''}`}
                            onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                        >
                          {task.title}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${getCategoryClasses(task.category)}`}>
                            {task.category}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${getPriorityClasses(task.priority)}`}>
                            Priority: {task.priority}
                          </span>
                          {task.date && (
                            <span className="text-[10px] text-gray-400 dark:text-pink-300/40 font-mono flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {new Date(task.date).toLocaleDateString('vi-VN')} {task.time && `@ ${task.time}`}
                            </span>
                          )}
                          {totalSubtasks > 0 && (
                            <span className="text-[10px] text-pink-500 font-semibold font-mono bg-pink-50 dark:bg-pink-950/40 px-1.5 py-0.5 rounded-md">
                              Subtasks: {completedSubtasks}/{totalSubtasks}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-pink-950/30 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-pink-950/30 transition-colors"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded checklist & notes drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden mt-4 pt-4 border-t border-pink-50 dark:border-pink-950/40 space-y-4"
                      >
                        {/* Task Description */}
                        {task.description && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-pink-300/40 uppercase tracking-wider">Mô tả chi tiết</span>
                            <p className="text-xs text-gray-600 dark:text-pink-200/80 leading-relaxed bg-pink-50/10 dark:bg-pink-950/10 p-2.5 rounded-xl border border-pink-50/20 dark:border-pink-950/20">{task.description}</p>
                          </div>
                        )}

                        {/* Interactive Sub-checklist */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-gray-400 dark:text-pink-300/40 uppercase tracking-wider">Các bước thực hiện (Checklist)</span>
                          <div className="space-y-1.5">
                            {task.checklist.map(item => (
                              <div 
                                key={item.id}
                                className="flex items-center justify-between p-2 rounded-xl hover:bg-pink-50/30 dark:hover:bg-pink-950/25 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleToggleChecklistItem(task, item.id)}
                                    className="text-pink-500 hover:text-pink-600 transition-all"
                                  >
                                    {item.completed ? (
                                      <CheckCircle2 className="w-4 h-4 fill-pink-500 text-white" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-pink-200" />
                                    )}
                                  </button>
                                  <span className={`text-xs text-gray-700 dark:text-pink-200/90 ${item.completed ? 'line-through text-gray-400' : ''}`}>
                                    {item.text}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleDeleteChecklistItem(task, item.id)}
                                  className="text-gray-300 hover:text-rose-500 transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}

                            {/* Add new subtask input inline */}
                            <div className="flex items-center gap-2 pt-1.5">
                              <input
                                type="text"
                                placeholder="Thêm bước thực hiện..."
                                value={newChecklistItemText}
                                onChange={(e) => setNewChecklistItemText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddChecklistItem(task);
                                }}
                                className="flex-1 px-3 py-1.5 rounded-lg text-xs border border-pink-100 dark:border-pink-900 bg-transparent outline-none focus:border-pink-400 text-gray-800 dark:text-pink-100"
                              />
                              <button
                                onClick={() => handleAddChecklistItem(task)}
                                className="bg-pink-50 px-3 py-1.5 rounded-lg hover:bg-pink-100 text-pink-600 text-xs font-bold transition-all"
                              >
                                Thêm
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Custom notes box */}
                        {task.notes && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-pink-300/40 uppercase tracking-wider">Nhật ký kết quả học</span>
                            <div className="text-xs italic text-gray-500 dark:text-pink-300/60 leading-relaxed bg-amber-50/20 dark:bg-pink-950/20 p-2.5 rounded-xl border border-amber-100/20 dark:border-pink-950/20">
                              {task.notes}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-brand-dark-card w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-pink-100 dark:border-brand-dark-border"
            >
              <div className="bg-gradient-to-r from-pink-500 to-pink-400 px-5 py-4 flex items-center justify-between text-white">
                <h3 className="font-display font-bold text-base flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 animate-pulse-soft" />
                  <span>Thêm nhiệm vụ học tập mới</span>
                </h3>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTaskSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-pink-300/60 uppercase">Tên nhiệm vụ</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Đọc Passage 3 Cam 18 - Review Từ mới"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-800 dark:text-pink-100 text-sm outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                {/* Grid: Category and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 dark:text-pink-300/60 uppercase">Phân loại kỹ năng</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as StudyCategory)}
                      className="w-full px-3 py-2 rounded-xl border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-700 dark:text-pink-200 text-xs outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 dark:text-pink-300/60 uppercase">Độ ưu tiên</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                      className="w-full px-3 py-2 rounded-xl border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-700 dark:text-pink-200 text-xs outline-none"
                    >
                      <option value="High">🔴 Cao (High)</option>
                      <option value="Medium">🟡 Trung bình (Medium)</option>
                      <option value="Low">🔵 Thấp (Low)</option>
                    </select>
                  </div>
                </div>

                {/* Grid: Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 dark:text-pink-300/60 uppercase">Hạn hoàn thành</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-700 dark:text-pink-200 text-xs outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 dark:text-pink-300/60 uppercase">Giờ nhắc nhở</label>
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-700 dark:text-pink-200 text-xs outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-pink-300/60 uppercase">Mô tả chi tiết</label>
                  <textarea
                    rows={2}
                    placeholder="Mục tiêu hoặc bài tập cần làm cụ thể..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-800 dark:text-pink-100 text-xs outline-none focus:border-pink-500"
                  />
                </div>

                {/* Pre-checklist input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-pink-300/60 uppercase">Tạo các bước nhỏ (Nhập mỗi dòng một việc)</label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ:&#13;Brainstorming dàn bài 10p&#13;Viết mở bài&#13;Tra các từ vựng đồng nghĩa"
                    value={checklistInput}
                    onChange={(e) => setChecklistInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-800 dark:text-pink-100 text-xs outline-none focus:border-pink-500"
                  />
                </div>

                {/* Notes box */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-pink-300/60 uppercase">Ghi chú kết quả sau khi ôn tập</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Đọc đúng 28/40 câu (Band 6.5)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-800 dark:text-pink-100 text-xs outline-none focus:border-pink-500"
                  />
                </div>

                {/* Action Box */}
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-pink-100 dark:border-pink-950 text-gray-500 dark:text-pink-300 text-xs font-semibold hover:bg-pink-50/50 transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-pink-100 transition-colors"
                  >
                    Lưu nhiệm vụ
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
