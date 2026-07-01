import { pgTable, serial, text, integer, boolean, timestamp, jsonb, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table mapping Firebase UID to PostgreSQL
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tasks table referencing users
export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(), // Using the client's UUID as primary key
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  time: text('time').notNull(), // HH:MM
  category: text('category').notNull(), // StudyCategory
  priority: text('priority').notNull(), // PriorityLevel
  description: text('description').notNull(),
  checklist: jsonb('checklist').notNull(), // ChecklistItem[]
  notes: text('notes').notNull(),
  completed: boolean('completed').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Events table referencing users
export const events = pgTable('events', {
  id: text('id').primaryKey(), // Using the client's UUID as primary key
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  time: text('time').notNull(), // HH:MM
  duration: integer('duration').notNull(), // duration in minutes
  category: text('category').notNull(), // StudyCategory
  description: text('description').notNull(),
  notes: text('notes').notNull(),
  completed: boolean('completed').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Notes table referencing users
export const notes = pgTable('notes', {
  id: text('id').primaryKey(), // Using the client's UUID as primary key
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  pinned: boolean('pinned').notNull(),
  updatedAt: text('updated_at').notNull(), // ISO String stored as text
});

// Study goals table referencing users (one per user)
export const goals = pgTable('goals', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  listening: real('listening').notNull(),
  reading: real('reading').notNull(),
  writing: real('writing').notNull(),
  speaking: real('speaking').notNull(),
  overall: real('overall').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Exam setup referencing users (one per user)
export const exam = pgTable('exam', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), // YYYY-MM-DD
  targetScore: real('target_score').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Study streak referencing users (one per user)
export const streak = pgTable('streak', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').notNull(),
  longestStreak: integer('longest_streak').notNull(),
  lastActiveDate: text('last_active_date').notNull(), // YYYY-MM-DD
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations for drizzle query convenience
export const usersRelations = relations(users, ({ many, one }) => ({
  tasks: many(tasks),
  events: many(events),
  notes: many(notes),
  goals: one(goals, {
    fields: [users.id],
    references: [goals.userId],
  }),
  exam: one(exam, {
    fields: [users.id],
    references: [exam.userId],
  }),
  streak: one(streak, {
    fields: [users.id],
    references: [streak.userId],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));
