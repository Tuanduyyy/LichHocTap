# 🌸 My IELTS Planner Pro

**My IELTS Planner Pro** là một ứng dụng lập kế hoạch cá nhân hằng ngày kết hợp các tinh hoa trải nghiệm người dùng từ *Notion, Google Calendar, Todoist, và Sunsama* được tối ưu hóa riêng biệt cho người ôn luyện IELTS. 

Ứng dụng được thiết kế theo phong cách **Pastel Pink Premium** cực kỳ ngọt ngào, hiện đại, tạo động lực mạnh mẽ mỗi ngày cho học viên.

---

## ✨ Các Tính Năng Nổi Bật

1. **🌸 Dashboard Thông Minh**:
   - Đếm ngược ngày thi IELTS trực quan.
   - Theo dõi chuỗi học tập (**Study Streak**) liên tiếp với biểu tượng ngọn lửa dễ thương.
   - Biểu đồ tiến độ hoàn thành nhiệm vụ và ca học hằng ngày.
   - Thống kê thời gian biểu theo tuần bằng biểu đồ Recharts.

2. **📅 Lịch Học Đa Dạng (Calendar)**:
   - Xem lịch linh hoạt theo **Tháng**, **Tuần**, và **Ngày**.
   - Hỗ trợ thêm mới, chỉnh sửa, thay đổi thời gian học nhanh chóng.
   - Giao diện kéo thả và nhấp chuột trực quan đạt chuẩn 8px Spacing System.

3. **📌 Quản Lý Nhiệm Vụ (Task Board)**:
   - Phân loại kỹ năng IELTS theo màu sắc chuẩn chỉ:
     - *Vocabulary* → Purple 🟣
     - *Listening* → Blue 🔵
     - *Reading* → Yellow 🟡
     - *Writing* → Pink 💗
     - *Speaking* → Orange 🟠
     - *Grammar* → Green 🟢
     - *Mock Test* → Red 🔴
   - Tạo các bước nhỏ thực hiện trong mỗi nhiệm vụ (**Interactive Sub-checklist**).
   - Nhật ký ghi lại kết quả tự luyện thi.

4. **📄 Nhập Thời Khóa Biểu Thông Minh (Import Word)**:
   - Đọc trực tiếp tài liệu thời khóa biểu `.docx` bằng thư viện **Mammoth.js**.
   - Tự động nhận diện Tuần, Ngày, Giờ, kỹ năng ôn tập và chia ca học tương ứng trên lịch bằng trí tuệ nhân tạo **Gemini AI** (hoặc thông qua Bộ phân tích chuỗi regex offline tích hợp sẵn).

5. **🎯 Sổ Tay Mục Tiêu (Goals Tracker)**:
   - Thanh trượt tùy chỉnh điểm thi mục tiêu cho từng kỹ năng (*Listening, Reading, Writing, Speaking*).
   - Tự động tính toán điểm trung bình Overall IELTS theo chuẩn làm tròn của IDP & British Council (làm tròn về .0 hoặc .5 gần nhất).
   - Đưa ra lời khuyên học tập cá nhân hóa tương ứng với thang điểm của bạn.

6. **📝 Sổ Tay Nhật Ký Ghi Chú (Notes)**:
   - Viết ghi chú tự do, ghim các từ vựng/idiom quan trọng lên đầu trang.
   - Giao diện chia đôi màn hình soạn thảo mượt mà.

7. **📈 Thống Kê Chuyên Sâu (Statistics)**:
   - Biểu đồ phân bổ tỷ lệ các kỹ năng học tập (Donut chart).
   - Biểu đồ liên kết so sánh số giờ học và số lượng nhiệm vụ hoàn thành theo ngày trong tuần.

8. **🌓 Chế Độ Dark Mode Độc Quyền**:
   - Chuyển đổi tức thì giữa chủ đề **Pastel Light Pink** và **Dark Pink Theme** huyền ảo, lưu trạng thái người dùng vào LocalStorage.

---

## 🛠️ Tech Stack & Kiến Trúc Dự Án

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Framer Motion (imported from `motion/react`).
- **Charts**: Recharts.
- **Word Parser**: Mammoth.js.
- **Backend / AI Proxy**: Express (NodeJS), `@google/genai` (Gemini API SDK).

### Cấu Trúc Mã Nguồn Sạch (Clean Architecture)
```
/
├── server.ts                 # File cấu hình server Express & proxy AI
├── package.json              # Quản lý script và dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite & Tailwind bundler config
├── src/
│   ├── main.tsx              # Entrypoint chính của React
│   ├── App.tsx               # Root Component quản lý State chính
│   ├── types.ts              # Định nghĩa các TypeScript Interface chuẩn
│   ├── initialData.ts        # Dữ liệu mẫu onboarding (onboarding mock data)
│   ├── index.css             # Cấu hình Fonts, Tailwind theme, Custom classes
│   ├── services/
│   │   └── storageService.ts # LocalStorage engine & backup exporter
│   └── components/
│       ├── Sidebar.tsx       # Thanh điều hướng có đồng bộ Cloud indicator
│       ├── DashboardView.tsx # Bento-grid tổng quan
│       ├── CalendarView.tsx  # Lịch học Tháng/Tuần/Ngày & Form chỉnh sửa
│       ├── TaskView.tsx      # Danh mục nhiệm vụ & Checklist
│       ├── NotesView.tsx     # Quản lý sổ tay ghi chú
│       ├── GoalsView.tsx     # Sliders mục tiêu & Lời khuyên
│       ├── StatisticsView.tsx# Biểu đồ Recharts
│       ├── SettingsView.tsx  # Quản lý cấu hình, backup dữ liệu
│       └── ImportModal.tsx   # Tải file .docx và phân tích thời khóa biểu
```

---

## 🚀 Hướng Dẫn Chạy Local (Local Development)

### 1. Cài đặt Dependencies
Mở terminal tại thư mục root và gõ:
```bash
npm install
```

### 2. Cấu hình biến môi trường
Tạo file `.env` tại thư mục root dựa trên mẫu `.env.example`:
```env
GEMINI_API_KEY="MÃ_API_GEMINI_CỦA_BẠN"
```
*(Nếu bạn không có mã API Gemini, hệ thống sẽ tự động kích hoạt bộ phân tích cấu trúc chuỗi regex offline thông minh để bạn vẫn import file Word IELTS thành công 100%).*

### 3. Khởi chạy chế độ lập trình (Dev Mode)
Chạy lệnh sau:
```bash
npm run dev
```
Mở trình duyệt truy cập `http://localhost:3000` để bắt đầu trải nghiệm!

---

## 🗄️ Hướng Dẫn Cấu Hình Đồng Bộ Lâu Dài (Supabase & PostgreSQL)

Để đưa ứng dụng này lên cloud với Supabase, bạn hãy thực hiện theo các bước sau:

### Bước 1: Khởi tạo database PostgreSQL trên Supabase
1. Truy cập [Supabase](https://supabase.com/) và tạo một Project mới.
2. Tại mục **SQL Editor**, chạy đoạn mã SQL khởi tạo các bảng tương ứng với `src/types.ts` như dưới đây:

```sql
-- 1. Bảng Users
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Bảng Tasks
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  description TEXT,
  checklist JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Bảng Calendar Events
CREATE TABLE calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  notes TEXT,
  completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Bảng Notes
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  pinned BOOLEAN DEFAULT false NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Kích hoạt Row Level Security (RLS) để bảo mật thông tin người dùng
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Tạo Policy cho người dùng chỉ đọc/ghi dữ liệu của chính mình
CREATE POLICY "Users can only access their own data" ON tasks 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own events" ON calendar_events 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own notes" ON notes 
  FOR ALL USING (auth.uid() = user_id);
```

### Bước 2: Tích hợp SDK Client trong dự án
1. Cài đặt gói thư viện Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```
2. Tạo file `/src/lib/supabaseClient.ts` để kết nối:
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

---

## 🌸 Thông Điệp Gửi Người Dùng
Chúc bạn **Trần Dương Tuấn Duy** học tập thật vui vẻ, giữ vững ngọn lửa streak học tập mỗi ngày để bứt phá band điểm IELTS mong muốn! App được xây dựng với tình yêu dành cho sự ngăn nắp, dễ thương và năng suất. ✨
