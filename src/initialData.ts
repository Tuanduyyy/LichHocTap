/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, CalendarEvent, Note, IELTSGoals, IELTSExam, UserProfile, StudyStreak } from './types';

// Helper to get formatted dates relative to today
const getRelativeDateStr = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const initialUser: UserProfile = {
  name: 'Trần Dương Tuấn Duy',
  email: 'tranduongtuanduy.6a4@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
};

export const initialGoals: IELTSGoals = {
  listening: 8.0,
  reading: 8.0,
  writing: 6.5,
  speaking: 7.0,
  overall: 7.5,
};

export const initialExam: IELTSExam = {
  date: getRelativeDateStr(60), // 60 days from now
  targetScore: 7.5,
};

export const initialStreak: StudyStreak = {
  currentStreak: 5,
  longestStreak: 12,
  lastActiveDate: getRelativeDateStr(0),
};

export const initialTasks: Task[] = [
  {
    id: 't1',
    title: 'Học 15 từ vựng Academic Topic: Environment 🌳',
    date: getRelativeDateStr(0), // Today
    time: '08:30',
    category: 'Vocabulary',
    priority: 'Medium',
    description: 'Tập trung học các collocation điểm cao như: mitigate climate change, sustainable development, ecological footprint.',
    completed: true,
    notes: 'Đã thuộc được 12 từ, còn 3 từ khó cần review tối nay.',
    checklist: [
      { id: 'tc1', text: 'Tạo thẻ Anki mới', completed: true },
      { id: 'tc2', text: 'Đặt câu với 5 từ khó nhất', completed: true },
      { id: 'tc3', text: 'Ôn tập lại trước khi đi ngủ', completed: false },
    ],
  },
  {
    id: 't2',
    title: 'Luyện 1 Đề Listening Cam 18 - Test 3 🎧',
    date: getRelativeDateStr(0), // Today
    time: '10:00',
    category: 'Listening',
    priority: 'High',
    description: 'Nghe tập trung không dừng băng, sau đó chữa chi tiết những câu sai.',
    completed: false,
    notes: '',
    checklist: [
      { id: 'tc4', text: 'Nghe liên tục 30 phút', completed: false },
      { id: 'tc5', text: 'Check đáp án và đếm số câu đúng', completed: false },
      { id: 'tc6', text: 'Nghe lại script chữa từ khoá bẫy', completed: false },
    ],
  },
  {
    id: 't3',
    title: 'Viết mở bài & thân bài 1 - Writing Task 2 ✍️',
    date: getRelativeDateStr(0), // Today
    time: '14:30',
    category: 'Writing',
    priority: 'High',
    description: 'Chủ đề: "Some people think that universities should provide graduates with the knowledge and skills needed in the workplace." Điểm mục tiêu: 7.0+',
    completed: false,
    notes: 'Cần sử dụng các cấu trúc đảo ngữ và từ nối linh hoạt.',
    checklist: [
      { id: 'tc7', text: 'Lập dàn ý (Brainstorming) trong 5 phút', completed: true },
      { id: 'tc8', text: 'Viết Introduction chất lượng', completed: false },
      { id: 'tc9', text: 'Viết Body Paragraph 1 phân tích lợi ích', completed: false },
    ],
  },
  {
    id: 't4',
    title: 'Luyện Nói Speaking Part 2 trước gương 🗣️',
    date: getRelativeDateStr(0), // Today
    time: '16:00',
    category: 'Speaking',
    priority: 'Medium',
    description: 'Topic: Describe an interesting old person you met. Sử dụng các idiom ngọt ngào: "over the moon", "sprightly", "full of beans".',
    completed: true,
    notes: 'Nói trôi chảy được 1p45s. Lần sau cần nói dài hơn chút và quản lý tốc độ tốt hơn.',
    checklist: [
      { id: 'tc10', text: 'Ghi âm bản nói đầu tiên', completed: true },
      { id: 'tc11', text: 'Sửa lỗi ngữ pháp & phát âm sai', completed: true },
      { id: 'tc12', text: 'Ghi âm bản thứ hai mượt hơn', completed: true },
    ],
  },
  {
    id: 't5',
    title: 'Luyện Reading Passage 2 Cam 17 - Matching Headings 📖',
    date: getRelativeDateStr(1), // Tomorrow
    time: '09:00',
    category: 'Reading',
    priority: 'High',
    description: 'Tập trung luyện kỹ năng Skimming & Scanning để giải quyết dạng bài khó nhất này.',
    completed: false,
    notes: '',
    checklist: [
      { id: 'tc13', text: 'Đọc lướt xác định topic sentence', completed: false },
      { id: 'tc14', text: 'Gạch chân từ khoá đồng nghĩa (Synonyms)', completed: false },
    ],
  },
  {
    id: 't6',
    title: 'Học Ngữ pháp: Mệnh đề quan hệ rút gọn 📝',
    date: getRelativeDateStr(1), // Tomorrow
    time: '11:00',
    category: 'Grammar',
    priority: 'Low',
    description: 'Học cách rút gọn dùng V-ing, V3/ed, và To V để tăng band điểm Grammar.',
    completed: false,
    notes: '',
    checklist: [
      { id: 'tc15', text: 'Đọc lý thuyết và lấy ví dụ', completed: false },
      { id: 'tc16', text: 'Làm 15 bài tập tự luyện', completed: false },
    ],
  }
];

export const initialEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Học Từ Vựng Academic Topic: Environment 🌳',
    date: getRelativeDateStr(0),
    time: '08:30',
    duration: 60,
    category: 'Vocabulary',
    description: 'Ghi chép từ mới vào notebook xinh xắn.',
    notes: '',
    completed: true,
  },
  {
    id: 'e2',
    title: 'Luyện Listening Cam 18 Test 3 🎧',
    date: getRelativeDateStr(0),
    time: '10:00',
    duration: 90,
    category: 'Listening',
    description: 'Nghe tập trung, sửa lỗi phát âm và bẫy chính tả.',
    notes: '',
    completed: false,
  },
  {
    id: 'e3',
    title: 'Viết Bài Writing Task 2 ✍️',
    date: getRelativeDateStr(0),
    time: '14:30',
    duration: 60,
    category: 'Writing',
    description: 'Viết nháp Body 1 & Body 2.',
    notes: '',
    completed: false,
  },
  {
    id: 'e4',
    title: 'Speaking Part 2 Practice 🗣️',
    date: getRelativeDateStr(0),
    time: '16:00',
    duration: 45,
    category: 'Speaking',
    description: 'Ghi âm và kiểm tra độ mạch lạc.',
    notes: '',
    completed: true,
  },
  {
    id: 'e5',
    title: 'Luyện tập Reading Cam 17 📖',
    date: getRelativeDateStr(1),
    time: '09:00',
    duration: 60,
    category: 'Reading',
    description: 'Tập trung sửa lỗi matching headings cực khó.',
    notes: '',
    completed: false,
  },
  {
    id: 'e6',
    title: 'Review Ngữ pháp Mệnh đề rút gọn 📝',
    date: getRelativeDateStr(1),
    time: '11:00',
    duration: 60,
    category: 'Grammar',
    description: 'Củng cố các chủ điểm ngữ pháp nâng cao.',
    notes: '',
    completed: false,
  },
  {
    id: 'e7',
    title: 'Làm Đề Full Mock Test Tại Nhà 🏆',
    date: getRelativeDateStr(2),
    time: '08:00',
    duration: 180,
    category: 'Mock Test',
    description: 'Kiểm tra năng lực tổng quan dưới áp lực thời gian thật.',
    notes: '',
    completed: false,
  }
];

export const initialNotes: Note[] = [
  {
    id: 'n1',
    title: '💡 Hướng dẫn sử dụng StudyCal',
    content: `Chào mừng bạn đến với 🌸 **StudyCal**! Đây là trợ thủ đắc lực giúp bạn lập kế hoạch học tập và công việc cá nhân hiệu quả.

### Các chức năng chính:
1. **Dashboard**: Xem tổng quan lịch học hôm nay, đếm ngược sự kiện quan trọng, streak học tập, và tiến độ hoàn thành.
2. **Calendar**: Xem lịch học linh hoạt theo Ngày (Day), Tuần (Week), Tháng (Month). Bạn có thể bấm để tạo lịch học mới hoặc chỉnh sửa.
3. **Study Tasks**: Quản lý list công việc học tập hằng ngày theo danh mục màu sắc cực dễ thương.
4. **Vocabulary / Skills**: Các bài học phân loại cụ thể theo kỹ năng.
5. **Import Word (.docx)**: Bấm nút "📄 Import Study Schedule" ở góc phải để tải lên giáo trình của bạn. Planner sẽ tự động chuyển đổi sang lịch học trực quan!
6. **Mục tiêu học tập**: Đặt điểm target cho từng kỹ năng và theo dõi thanh tiến độ ngọt ngào.

Chúc bạn học tập thật vui vẻ và năng suất mỗi ngày! ✨`,
    pinned: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    title: '📝 Bộ Idioms Nói Cho Speaking Part 2',
    content: `Dưới đây là một số thành ngữ cực kỳ đắt giá giúp nâng band điểm phát âm và từ vựng trong bài thi Nói:

* **Over the moon** (Cực kỳ hạnh phúc): *I was over the moon when I passed the test.*
* **Down in the dumps** (Buồn bã, chán nản): *She felt down in the dumps after failing.*
* **Full of beans** (Tràn đầy năng lượng): *Despite his old age, he is still full of beans.*
* **Burn the midnight oil** (Thức khuya học bài): *I had to burn the midnight oil to prepare for Writing.*
* **Once in a blue moon** (Rất hiếm khi): *I visit the museum once in a blue moon.*

Lưu ý: Chỉ dùng tự nhiên, tránh gượng ép!`,
    pinned: false,
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // Yesterday
  }
];
