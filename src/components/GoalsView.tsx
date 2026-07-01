/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  CheckCircle, 
  Award, 
  BookOpen, 
  Heart,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { IELTSGoals } from '../types';

interface GoalsViewProps {
  goals: IELTSGoals;
  saveGoals: (goals: IELTSGoals) => void;
}

export default function GoalsView({
  goals,
  saveGoals
}: GoalsViewProps) {
  const [listening, setListening] = useState(goals.listening);
  const [reading, setReading] = useState(goals.reading);
  const [writing, setWriting] = useState(goals.writing);
  const [speaking, setSpeaking] = useState(goals.speaking);

  // Automatically calculate overall average based on standard IELTS rounding (to nearest 0.5)
  const calculateOverall = (l: number, r: number, w: number, s: number) => {
    const rawAvg = (l + r + w + s) / 4;
    const decimal = rawAvg - Math.floor(rawAvg);
    
    if (decimal < 0.25) {
      return Math.floor(rawAvg);
    } else if (decimal < 0.75) {
      return Math.floor(rawAvg) + 0.5;
    } else {
      return Math.ceil(rawAvg);
    }
  };

  const calculatedOverall = calculateOverall(listening, reading, writing, speaking);

  const handleSave = () => {
    saveGoals({
      listening,
      reading,
      writing,
      speaking,
      overall: calculatedOverall
    });
  };

  // Recommendations and motivators based on targeted band
  const getMotivationalFeedback = (band: number) => {
    if (band >= 8.0) return {
      badge: '👑 Học giả Xuất sắc',
      desc: 'Mục tiêu cực kỳ xuất sắc! Bạn đang hướng tới đẳng cấp sử dụng ngôn ngữ và kiến thức vô cùng lưu loát. Hãy tập trung luyện các đề khó và viết chuyên sâu.',
      tips: ['Kỹ năng Nghe: Luyện chép chính tả (dictation) tốc độ 1.25x.', 'Kỹ năng Đọc: Đọc các bài báo khoa học, phân tích hằng ngày.', 'Kỹ năng Viết: Sử dụng từ ngữ chuẩn xác, đa dạng và viết mạch lạc.', 'Kỹ năng Nói: Nói trôi chảy không ngắc ngứ và tự nhiên nhất có thể.']
    };
    if (band >= 7.0) return {
      badge: '⭐️ Học tập Chuyên sâu',
      desc: 'Mục tiêu rất cao và lý tưởng cho học tập chuyên nghiệp, du học hoặc thăng tiến. Tiếp tục duy trì kỷ luật làm bài tập trung cao độ hằng ngày.',
      tips: ['Kỹ năng Nghe: Chú ý ghi nhớ từ đồng nghĩa (synonyms) và cấu trúc câu phức.', 'Kỹ năng Đọc: Quản lý thời gian phân bổ đúng thời gian mỗi bài đọc.', 'Kỹ năng Viết: Đảm bảo viết đúng cấu trúc, lập luận chặt chẽ.', 'Kỹ năng Nói: Tập trung mở rộng vốn từ vựng học thuật phong phú.']
    };
    return {
      badge: '🌸 Học tập Vững vàng',
      desc: 'Mục tiêu rất thiết thực! Tập trung xây vững nền móng ngữ pháp, phát âm và từ vựng cơ bản trước khi giải bài dồn dập.',
      tips: ['Từ vựng: Ghi chép từ vựng mới theo chủ đề hằng ngày.', 'Ngữ pháp: Ôn vững các cấu trúc câu, mệnh đề quan hệ và liên từ.', 'Phát âm: Phát âm chuẩn để cải thiện giao tiếp và lắng nghe.', 'Lắng nghe: Nghe chậm rãi kết hợp phụ đề để quen phản xạ.']
    };
  };

  const feedback = getMotivationalFeedback(calculatedOverall);

  return (
    <div className="space-y-6">
      {/* Target goals dashboard banner */}
      <div className="premium-card p-6 bg-gradient-to-tr from-pink-500/10 via-pink-50/30 to-fuchsia-500/5 dark:from-pink-950/20 dark:to-pink-900/10 border border-pink-100 dark:border-pink-900/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-300 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse-soft" />
              <span>{feedback.badge}</span>
            </div>
            <h2 className="text-xl font-display font-bold text-gray-800 dark:text-pink-100">
              Thiết lập mục tiêu học tập cá nhân
            </h2>
            <p className="text-xs text-gray-500 dark:text-pink-300/60 max-w-md leading-relaxed">
              {feedback.desc}
            </p>
          </div>

          {/* Big overall target indicator ring */}
          <div className="flex flex-col items-center gap-2 bg-white dark:bg-brand-dark-card p-4 rounded-2xl border border-pink-100/50 dark:border-pink-900/20 shadow-sm min-w-[150px]">
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-pink-300/60 tracking-wider">Mục tiêu chung</span>
            
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  className="stroke-pink-100 dark:stroke-pink-950"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  className="stroke-pink-500"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - calculatedOverall / 9.0)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="font-display font-black text-2xl text-gray-800 dark:text-pink-100">{calculatedOverall}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Configuration */}
        <div className="lg:col-span-7 premium-card p-6 space-y-6">
          <h3 className="font-display font-bold text-sm text-gray-800 dark:text-pink-100 pb-3 border-b border-pink-50 dark:border-pink-950/40">
            📊 Tùy chỉnh điểm số mục tiêu (Target Scores)
          </h3>

          <div className="space-y-5">
            {/* Listening */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-600 dark:text-pink-200">🎧 Nghe (Listening Goal)</span>
                <span className="font-mono font-bold text-pink-600 dark:text-pink-400 text-sm">Điểm {listening}</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.0"
                step="0.5"
                value={listening}
                onChange={(e) => setListening(Number(e.target.value))}
                className="w-full h-2 bg-pink-100 dark:bg-pink-950 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-pink-300/30 font-semibold font-mono">
                <span>4.0</span>
                <span>6.5</span>
                <span>9.0</span>
              </div>
            </div>

            {/* Reading */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-600 dark:text-pink-200">📖 Đọc (Reading Goal)</span>
                <span className="font-mono font-bold text-pink-600 dark:text-pink-400 text-sm">Điểm {reading}</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.0"
                step="0.5"
                value={reading}
                onChange={(e) => setReading(Number(e.target.value))}
                className="w-full h-2 bg-pink-100 dark:bg-pink-950 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-pink-300/30 font-semibold font-mono">
                <span>4.0</span>
                <span>6.5</span>
                <span>9.0</span>
              </div>
            </div>

            {/* Writing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-600 dark:text-pink-200">✍️ Viết (Writing Goal)</span>
                <span className="font-mono font-bold text-pink-600 dark:text-pink-400 text-sm">Điểm {writing}</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.0"
                step="0.5"
                value={writing}
                onChange={(e) => setWriting(Number(e.target.value))}
                className="w-full h-2 bg-pink-100 dark:bg-pink-950 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-pink-300/30 font-semibold font-mono">
                <span>4.0</span>
                <span>6.5</span>
                <span>9.0</span>
              </div>
            </div>

            {/* Speaking */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-600 dark:text-pink-200">🗣️ Nói (Speaking Goal)</span>
                <span className="font-mono font-bold text-pink-600 dark:text-pink-400 text-sm">Điểm {speaking}</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.0"
                step="0.5"
                value={speaking}
                onChange={(e) => setSpeaking(Number(e.target.value))}
                className="w-full h-2 bg-pink-100 dark:bg-pink-950 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-pink-300/30 font-semibold font-mono">
                <span>4.0</span>
                <span>6.5</span>
                <span>9.0</span>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-4 border-t border-pink-50 dark:border-pink-950 flex items-center justify-between">
              <p className="text-[10px] text-gray-400 dark:text-pink-300/40">
                💡 Thay đổi sẽ tự động tính toán điểm Overall gợi ý.
              </p>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-pink-100 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Cập nhật mục tiêu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Actionable Tips */}
        <div className="lg:col-span-5 premium-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-pink-50 dark:border-pink-950/40">
              <h3 className="font-display font-bold text-sm text-gray-800 dark:text-pink-100">
                💡 Lời khuyên cho mục tiêu {calculatedOverall}
              </h3>
              <Heart className="w-4 h-4 text-pink-500 fill-current" />
            </div>

            <div className="space-y-4">
              {feedback.tips.map((tip, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3 rounded-xl bg-pink-50/25 dark:bg-pink-950/10 border border-pink-100/30 dark:border-pink-900/20">
                  <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-600 flex-shrink-0 flex items-center justify-center font-display font-bold text-[10px]">{idx + 1}</span>
                  <p className="text-xs text-gray-600 dark:text-pink-200/90 leading-relaxed font-semibold">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-pink-50 dark:border-pink-950/40 text-center bg-pink-50/10 p-3.5 rounded-2xl">
            <p className="text-xs font-display font-bold text-pink-500">“Sự nỗ lực nhỏ của ngày hôm nay là thành công của ngày mai!” ✨</p>
          </div>
        </div>
      </div>
    </div>
  );
}
