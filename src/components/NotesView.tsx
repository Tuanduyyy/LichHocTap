/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Pin, 
  Trash2, 
  Edit3, 
  Save, 
  BookOpen, 
  Sparkles,
  ArrowLeft,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Note } from '../types';

interface NotesViewProps {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
}

export default function NotesView({
  notes,
  addNote,
  updateNote,
  deleteNote
}: NotesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Editor form states
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Handle click to view or edit a note
  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleAddNewNote = () => {
    const newNote = {
      title: '📝 Ghi chú IELTS mới',
      content: 'Nhấp vào đây để ghi chép từ vựng mới, lỗi sai thường gặp khi viết bài...',
      pinned: false,
    };
    addNote(newNote);
    
    // Auto select the newly added note (will be the first one in list when sorted)
    // We delay slightly to let state propagate
    setTimeout(() => {
      const allNotes = [...notes];
      if (allNotes.length > 0) {
        handleSelectNote(allNotes[allNotes.length - 1]);
      }
    }, 50);
  };

  const handleSaveNote = () => {
    if (!selectedNote || !editTitle.trim()) return;

    updateNote({
      ...selectedNote,
      title: editTitle.trim(),
      content: editContent,
      updatedAt: new Date().toISOString(),
    });

    setSelectedNote({
      ...selectedNote,
      title: editTitle.trim(),
      content: editContent,
      updatedAt: new Date().toISOString(),
    });

    setIsEditing(false);
  };

  const handleTogglePin = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    updateNote({
      ...note,
      pinned: !note.pinned,
    });
    if (selectedNote?.id === note.id) {
      setSelectedNote({
        ...selectedNote,
        pinned: !note.pinned,
      });
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNote(id);
    if (selectedNote?.id === id) {
      setSelectedNote(notes.find(n => n.id !== id) || null);
    }
  };

  // Filter notes by search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort notes: pinned first, then by date updatedAt descending
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      {/* Left Column: Notes List */}
      <div className="lg:col-span-4 flex flex-col gap-4 h-full overflow-hidden">
        <div className="premium-card p-4 space-y-4 flex flex-col flex-shrink-0">
          <div className="flex items-center justify-between pb-2 border-b border-pink-100/50 dark:border-pink-950/40">
            <h3 className="font-display font-bold text-sm text-gray-800 dark:text-pink-100 flex items-center gap-1.5">
              <BookOpen className="w-4.5 h-4.5 text-pink-500" />
              <span>Sổ tay ghi chú ({notes.length})</span>
            </h3>
            <button 
              onClick={handleAddNewNote}
              className="px-3.5 py-1.5 bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-950/60 text-[#EC4899] rounded-full transition-all flex items-center gap-1 text-xs font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo mới</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm ghi chú..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full text-xs border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-800 dark:text-pink-100 outline-none focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 transition-all"
            />
            <Search className="absolute left-3.5 top-3 w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        {/* Note Cards Stack */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {sortedNotes.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-400 dark:text-pink-300/40 italic bg-white dark:bg-brand-dark-card rounded-2xl border border-dashed border-pink-100 dark:border-pink-950 p-6">
              Không tìm thấy ghi chú nào
            </div>
          ) : (
            sortedNotes.map(note => {
              const isSelected = selectedNote?.id === note.id;
              return (
                <div 
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-pink-50/70 border-pink-300 dark:bg-pink-950/30 dark:border-pink-800' 
                      : 'bg-white dark:bg-brand-dark-card border-pink-100/50 dark:border-pink-950/40 hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-gray-800 dark:text-pink-100 truncate flex-1 leading-tight">
                      {note.title}
                    </h4>
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button 
                        onClick={(e) => handleTogglePin(note, e)}
                        className={`p-0.5 rounded transition-colors ${
                          note.pinned 
                            ? 'text-pink-500 hover:text-pink-600' 
                            : 'text-gray-300 hover:text-pink-400'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(note.id, e)}
                        className="p-0.5 text-gray-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 dark:text-pink-300/60 mt-1.5 line-clamp-2 leading-relaxed">
                    {note.content.replace(/[#*`_]/g, '')}
                  </p>

                  <div className="flex items-center justify-between mt-3 text-[9px] text-gray-400 dark:text-pink-300/30 font-semibold font-mono">
                    <span>Cập nhật</span>
                    <span>{new Date(note.updatedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Note Editor */}
      <div className="lg:col-span-8 h-full flex flex-col overflow-hidden">
        {selectedNote ? (
          <div className="premium-card p-5 h-full flex flex-col overflow-hidden bg-white">
            {/* Header / Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-pink-50 dark:border-pink-950/40 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-pink-500 font-bold bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded">
                  {isEditing ? 'Đang soạn thảo' : 'Chế độ đọc'}
                </span>
                <span className="text-[11px] text-gray-400 dark:text-pink-300/40">
                  Lần cuối: {new Date(selectedNote.updatedAt).toLocaleString('vi-VN')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-lg border border-pink-100 text-gray-500 text-xs font-semibold hover:bg-pink-50/50 transition-colors"
                    >
                      Huỷ
                    </button>
                    <button 
                      onClick={handleSaveNote}
                      className="flex items-center gap-1.5 bg-pink-500 hover:bg-pink-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu lại</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      setEditTitle(selectedNote.title);
                      setEditContent(selectedNote.content);
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-1.5 bg-pink-50 hover:bg-pink-100 text-pink-500 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-pink-100 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
              </div>
            </div>

            {/* Note Editor Canvas */}
            <div className="flex-1 overflow-y-auto mt-4 space-y-4">
              {isEditing ? (
                <div className="h-full flex flex-col gap-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-base font-bold text-gray-800 dark:text-pink-100 border-b border-pink-100/50 dark:border-pink-950 pb-2 outline-none focus:border-pink-500 bg-transparent"
                    placeholder="Tiêu đề ghi chú..."
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full flex-1 text-xs text-gray-700 dark:text-pink-200/90 outline-none leading-relaxed font-mono p-3 bg-pink-50/10 dark:bg-pink-950/5 rounded-2xl resize-none"
                    placeholder="Ghi chú nội dung học tập... Bạn có thể gõ văn bản Markdown cơ bản ở đây."
                  />
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
                  <h1 className="text-lg font-display font-bold text-gray-800 dark:text-pink-100">
                    {selectedNote.title}
                  </h1>
                  
                  {/* Styled Raw Notes Rendering */}
                  <div className="text-xs text-gray-600 dark:text-pink-200/90 leading-relaxed space-y-2 whitespace-pre-wrap font-sans bg-pink-50/5 p-4 rounded-2xl border border-pink-50/20">
                    {selectedNote.content}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="premium-card p-12 text-center flex flex-col items-center justify-center h-full">
            <BookOpen className="w-12 h-12 text-pink-300 animate-pulse-soft mb-3" />
            <h4 className="text-gray-700 dark:text-pink-100 font-bold font-display text-sm">Chưa chọn ghi chú</h4>
            <p className="text-xs text-gray-400 dark:text-pink-300/60 mt-1 max-w-xs">Chọn ghi chú từ danh mục bên trái hoặc bấm "Tạo mới" để lập nhật ký học nhé!</p>
          </div>
        )}
      </div>
    </div>
  );
}
