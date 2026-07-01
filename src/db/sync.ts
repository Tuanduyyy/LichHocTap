import { db } from './index.ts';
import { tasks, events, notes, goals, exam, streak, users } from './schema.ts';
import { eq } from 'drizzle-orm';

interface SyncPayload {
  tasks: any[];
  events: any[];
  notes: any[];
  goals: any;
  exam: any;
  streak: any;
}

export async function pushUserData(userDbId: number, data: SyncPayload) {
  try {
    await db.transaction(async (tx) => {
      // 1. Synchronize list-based data by replacing existing with the latest client state
      // This is the cleanest conflict-free replication method for single-user offline-first syncing.
      await tx.delete(tasks).where(eq(tasks.userId, userDbId));
      await tx.delete(events).where(eq(events.userId, userDbId));
      await tx.delete(notes).where(eq(notes.userId, userDbId));

      if (data.tasks && data.tasks.length > 0) {
        const taskValues = data.tasks.map((t) => ({
          id: t.id,
          userId: userDbId,
          title: t.title || '',
          date: t.date || '',
          time: t.time || '',
          category: t.category || 'Vocabulary',
          priority: t.priority || 'Medium',
          description: t.description || '',
          checklist: t.checklist || [],
          notes: t.notes || '',
          completed: !!t.completed,
        }));
        await tx.insert(tasks).values(taskValues);
      }

      if (data.events && data.events.length > 0) {
        const eventValues = data.events.map((e) => ({
          id: e.id,
          userId: userDbId,
          title: e.title || '',
          date: e.date || '',
          time: e.time || '',
          duration: Number(e.duration) || 60,
          category: e.category || 'Vocabulary',
          description: e.description || '',
          notes: e.notes || '',
          completed: !!e.completed,
        }));
        await tx.insert(events).values(eventValues);
      }

      if (data.notes && data.notes.length > 0) {
        const noteValues = data.notes.map((n) => ({
          id: n.id,
          userId: userDbId,
          title: n.title || '',
          content: n.content || '',
          pinned: !!n.pinned,
          updatedAt: n.updatedAt || new Date().toISOString(),
        }));
        await tx.insert(notes).values(noteValues);
      }

      // 2. Synchronize single-record states via atomic upserts
      if (data.goals) {
        await tx
          .insert(goals)
          .values({
            userId: userDbId,
            listening: Number(data.goals.listening) || 0,
            reading: Number(data.goals.reading) || 0,
            writing: Number(data.goals.writing) || 0,
            speaking: Number(data.goals.speaking) || 0,
            overall: Number(data.goals.overall) || 0,
          })
          .onConflictDoUpdate({
            target: goals.userId,
            set: {
              listening: Number(data.goals.listening) || 0,
              reading: Number(data.goals.reading) || 0,
              writing: Number(data.goals.writing) || 0,
              speaking: Number(data.goals.speaking) || 0,
              overall: Number(data.goals.overall) || 0,
              updatedAt: new Date(),
            },
          });
      }

      if (data.exam) {
        await tx
          .insert(exam)
          .values({
            userId: userDbId,
            date: data.exam.date || '',
            targetScore: Number(data.exam.targetScore) || 0,
          })
          .onConflictDoUpdate({
            target: exam.userId,
            set: {
              date: data.exam.date || '',
              targetScore: Number(data.exam.targetScore) || 0,
              updatedAt: new Date(),
            },
          });
      }

      if (data.streak) {
        await tx
          .insert(streak)
          .values({
            userId: userDbId,
            currentStreak: Number(data.streak.currentStreak) || 0,
            longestStreak: Number(data.streak.longestStreak) || 0,
            lastActiveDate: data.streak.lastActiveDate || '',
          })
          .onConflictDoUpdate({
            target: streak.userId,
            set: {
              currentStreak: Number(data.streak.currentStreak) || 0,
              longestStreak: Number(data.streak.longestStreak) || 0,
              lastActiveDate: data.streak.lastActiveDate || '',
              updatedAt: new Date(),
            },
          });
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error pushing user data sync:', error);
    throw new Error('Push sync failed. Please try again later.', { cause: error });
  }
}

export async function pullUserData(userDbId: number) {
  try {
    const userTasks = await db.select().from(tasks).where(eq(tasks.userId, userDbId));
    const userEvents = await db.select().from(events).where(eq(events.userId, userDbId));
    const userNotes = await db.select().from(notes).where(eq(notes.userId, userDbId));

    const userGoals = await db.select().from(goals).where(eq(goals.userId, userDbId));
    const userExam = await db.select().from(exam).where(eq(exam.userId, userDbId));
    const userStreak = await db.select().from(streak).where(eq(streak.userId, userDbId));

    return {
      tasks: userTasks.map((t) => ({
        id: t.id,
        title: t.title,
        date: t.date,
        time: t.time,
        category: t.category,
        priority: t.priority,
        description: t.description,
        checklist: t.checklist,
        notes: t.notes,
        completed: t.completed,
      })),
      events: userEvents.map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        time: e.time,
        duration: e.duration,
        category: e.category,
        description: e.description,
        notes: e.notes,
        completed: e.completed,
      })),
      notes: userNotes.map((n) => ({
        id: n.id,
        title: n.title,
        content: n.content,
        pinned: n.pinned,
        updatedAt: n.updatedAt,
      })),
      goals: userGoals[0]
        ? {
            listening: userGoals[0].listening,
            reading: userGoals[0].reading,
            writing: userGoals[0].writing,
            speaking: userGoals[0].speaking,
            overall: userGoals[0].overall,
          }
        : null,
      exam: userExam[0]
        ? {
            date: userExam[0].date,
            targetScore: userExam[0].targetScore,
          }
        : null,
      streak: userStreak[0]
        ? {
            currentStreak: userStreak[0].currentStreak,
            longestStreak: userStreak[0].longestStreak,
            lastActiveDate: userStreak[0].lastActiveDate,
          }
        : null,
    };
  } catch (error) {
    console.error('Error pulling user data sync:', error);
    throw new Error('Pull sync failed. Please try again later.', { cause: error });
  }
}
