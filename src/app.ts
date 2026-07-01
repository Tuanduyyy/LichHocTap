/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { requireAuth, AuthRequest } from './middleware/auth.ts';
import { getOrCreateUser } from './db/users.ts';
import { pushUserData, pullUserData } from './db/sync.ts';

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Synchronize Push
app.post('/api/sync/push', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { uid, email } = req.user;
    const userDb = await getOrCreateUser(uid, email || '');
    const result = await pushUserData(userDb.id, req.body);
    res.json(result);
  } catch (error: any) {
    console.error('Push sync error:', error);
    res.status(500).json({ error: error.message || 'Failed to push sync data' });
  }
});

// Synchronize Pull
app.get('/api/sync/pull', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { uid, email } = req.user;
    const userDb = await getOrCreateUser(uid, email || '');
    const data = await pullUserData(userDb.id);
    res.json(data);
  } catch (error: any) {
    console.error('Pull sync error:', error);
    res.status(500).json({ error: error.message || 'Failed to pull sync data' });
  }
});

// AI Planner endpoint: Parses raw text from imported Word syllabus into structured planner database entries
app.post('/api/ai-parse', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Syllabus text is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      console.warn('GEMINI_API_KEY is not configured. Falling back to client-side smart parser.');
      return res.status(400).json({
        error: 'GEMINI_API_KEY_MISSING',
        message: 'Gemini API key is not configured yet. Using offline parser instead!'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an elite, highly experienced IELTS Product Designer and Study Planner Coach.
      Your task is to analyze the following unstructured syllabus text extracted from an IELTS study guide/word file.
      You must structure this text into study tasks and calendar events so they can be imported directly into our schedule.
      
      Today's date is: ${new Date().toISOString().split('T')[0]}.
      
      Syllabus Date Parsing Instructions:
      1. Search the text for any starting date indicators, such as "Lịch bắt đầu từ ngày DD/MM/YYYY" or similar (for example, "Lịch bắt đầu từ ngày 6/7/2026").
      2. If a start date is specified in the text:
         - Parse it as the base date. E.g., "6/7/2026" means Year 2026, Month 7 (July), Day 6. This is a Monday.
         - Calculate the absolute date string in "YYYY-MM-DD" format for each task and event.
         - For "TUẦN 1" (Week 1): Monday (Thứ 2) is July 6th, Tuesday (Thứ 3) is July 7th, ..., Sunday (Chủ nhật) is July 12th.
         - For "TUẦN 2" (Week 2): Monday (Thứ 2) is July 13th, Tuesday (Thứ 3) is July 14th, etc.
      3. If NO starting date is mentioned in the text:
         - Use Today's date (${new Date().toISOString().split('T')[0]}) as the start date (Monday of Week 1), and compute absolute dates relative to that.
      
      Syllabus Table Structure Instructions:
      1. The syllabus is typically structured as a table or structured text under week headers (e.g., "TUẦN 1", "TUẦN 2", etc.).
      2. For each day (e.g. "Thứ 2", "Thứ 3", etc.), there are normally two sessions and a completion checklist:
         - "Buổi Sáng / Chiều (2 tiếng)" (or Morning/Afternoon session)
         - "Buổi Tối (2 tiếng)" (or Evening session)
         - "Checklist hoàn thành" (Checklist column containing lines starting with [ ] or checkboxes, e.g. "[ ] Sửa xong nghe", "[ ] Viết xong 2 Body").
      3. For each day row, split the content into two distinct sessions (Morning/Afternoon and Evening) and output them as separate items:
         - For "Buổi Sáng / Chiều": Create a Task and a corresponding Calendar Event scheduled at "09:00" with duration 120 (minutes).
         - For "Buổi Tối": Create a Task and a corresponding Calendar Event scheduled at "19:30" with duration 120 (minutes).
      4. Categorize each session accurately into one of these: 'Vocabulary', 'Listening', 'Reading', 'Writing', 'Speaking', 'Grammar', 'Mock Test'.
         - Identify the skill from headings like "Listening: ...", "Reading: ...", "Writing: ...", "Speaking: ...", etc.
      5. For each Task, include relevant check-list items parsed from the "Checklist hoàn thành" column for that day.
         - E.g. If the day checklist has "[ ] Sửa xong nghe", associate that checklist string to the Listening task. If it has "[ ] Viết xong 2 Body", associate it to the Writing/Body task.
         - Ensure the "checklist" field is an array of strings (e.g. ["Sửa xong nghe", "Viết xong 2 Body"]).
      6. Set "priority" based on complexity: "High" for major skills like Writing/Speaking tasks, "Medium" or "Low" for light exercises.
      7. Extract ALL study days and weeks found in the text. Output the full calendar schedule.
      
      Return exactly a JSON object conforming to this TypeScript shape (Do not include markdown blocks, just the raw JSON text):
      {
        "tasks": [
          {
            "title": string, // Short, polished Vietnamese title (e.g., "Luyện Listening Cam 16 - Test 1")
            "category": "Vocabulary" | "Listening" | "Reading" | "Writing" | "Speaking" | "Grammar" | "Mock Test",
            "priority": "Low" | "Medium" | "High",
            "description": string, // Detailed study instruction/guideline in Vietnamese
            "checklist": string[], // Extracted checkboxes for this day (e.g. ["Sửa xong nghe", "Dịch bài đọc"])
            "notes": string,
            "time": string, // "09:00" or "19:30"
            "daysOffset": number, // Relative days offset from start date
            "date": string // Calculated absolute date in "YYYY-MM-DD" format
          }
        ],
        "events": [
          {
            "title": string, // Polished Vietnamese title
            "category": "Vocabulary" | "Listening" | "Reading" | "Writing" | "Speaking" | "Grammar" | "Mock Test",
            "description": string, // Detailed notes/directions
            "time": string, // "09:00" or "19:30"
            "duration": number, // 120
            "daysOffset": number, // Relative days offset from start date
            "date": string // Calculated absolute date in "YYYY-MM-DD" format
          }
        ]
      }
      
      Syllabus Text:
      ${text.slice(0, 20000)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini API.');
    }

    const parsedJSON = JSON.parse(responseText);
    return res.json(parsedJSON);
  } catch (error: any) {
    console.error('Error in AI parse endpoint:', error);
    return res.status(500).json({
      error: 'PARSING_ERROR',
      message: error.message || 'Failed to process AI schedule generation.'
    });
  }
});

export default app;
