import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { storageService } from './storageService.ts';

export interface SyncStatus {
  isLoggedIn: boolean;
  user: User | null;
  lastSynced: string | null;
  syncing: boolean;
  error: string | null;
}

type StatusCallback = (status: SyncStatus) => void;
const listeners = new Set<StatusCallback>();

let currentStatus: SyncStatus = {
  isLoggedIn: false,
  user: null,
  lastSynced: localStorage.getItem('studycal_last_synced'),
  syncing: false,
  error: null,
};

function notify() {
  listeners.forEach((cb) => cb({ ...currentStatus }));
}

// Observe auth state changes
auth.onAuthStateChanged(async (user) => {
  currentStatus.user = user;
  currentStatus.isLoggedIn = !!user;
  currentStatus.error = null;
  notify();

  if (user) {
    // Perform initial synchronization when user logs in
    await syncService.syncOnLogin();
  }
});

export const syncService = {
  subscribe(callback: StatusCallback) {
    listeners.add(callback);
    callback({ ...currentStatus });
    return () => {
      listeners.delete(callback);
    };
  },

  getStatus(): SyncStatus {
    return { ...currentStatus };
  },

  async login() {
    currentStatus.syncing = true;
    currentStatus.error = null;
    notify();

    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error?.code === 'auth/popup-closed-by-user') {
        currentStatus.error = 'Cửa sổ đăng nhập đã bị đóng. Nếu bạn đang chạy ứng dụng trong khung xem trước AI Studio, vui lòng nhấn "Mở trong tab mới" (Open in new tab) ở góc trên bên phải để đăng nhập Google thành công!';
      } else {
        currentStatus.error = error.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      }
      currentStatus.syncing = false;
      notify();
    }
  },

  async logout() {
    currentStatus.syncing = true;
    currentStatus.error = null;
    notify();

    try {
      await signOut(auth);
      // Clear last synced info upon logging out
      currentStatus.lastSynced = null;
      localStorage.removeItem('studycal_last_synced');
    } catch (error: any) {
      console.error('Logout error:', error);
      currentStatus.error = error.message || 'Đăng xuất thất bại.';
    } finally {
      currentStatus.syncing = false;
      notify();
    }
  },

  async getAuthHeader(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    try {
      const token = await user.getIdToken();
      return `Bearer ${token}`;
    } catch (e) {
      console.error('Failed to get auth token:', e);
      return null;
    }
  },

  async syncOnLogin() {
    currentStatus.syncing = true;
    notify();

    try {
      const authHeader = await this.getAuthHeader();
      if (!authHeader) throw new Error('Chưa đăng nhập');

      // 1. Try to pull cloud data first
      const response = await fetch('/api/sync/pull', {
        headers: {
          'Authorization': authHeader,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu đồng bộ từ đám mây.');
      }

      const cloudData = await response.json();

      // If the cloud database has data (at least one of tasks, events, or notes exists)
      const hasCloudData = 
        (cloudData.tasks && cloudData.tasks.length > 0) ||
        (cloudData.events && cloudData.events.length > 0) ||
        (cloudData.notes && cloudData.notes.length > 0) ||
        cloudData.goals ||
        cloudData.exam;

      if (hasCloudData) {
        // Load cloud data into client localStorage
        if (cloudData.tasks) storageService.saveTasks(cloudData.tasks);
        if (cloudData.events) storageService.saveEvents(cloudData.events);
        if (cloudData.notes) storageService.saveNotes(cloudData.notes);
        if (cloudData.goals) storageService.saveGoals(cloudData.goals);
        if (cloudData.exam) storageService.saveExam(cloudData.exam);
        if (cloudData.streak) storageService.saveStreak(cloudData.streak);

        const nowStr = new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN');
        currentStatus.lastSynced = nowStr;
        localStorage.setItem('studycal_last_synced', nowStr);
        
        // Trigger page reload or state updates
        window.dispatchEvent(new Event('storage'));
      } else {
        // If cloud database is empty, push the current local state to cloud immediately
        await this.pushLocalToCloud();
      }
    } catch (error: any) {
      console.error('Sync on login error:', error);
      currentStatus.error = error.message;
    } finally {
      currentStatus.syncing = false;
      notify();
    }
  },

  async pushLocalToCloud(): Promise<boolean> {
    const authHeader = await this.getAuthHeader();
    if (!authHeader) return false;

    currentStatus.syncing = true;
    notify();

    try {
      const payload = {
        tasks: storageService.getTasks(),
        events: storageService.getEvents(),
        notes: storageService.getNotes(),
        goals: storageService.getGoals(),
        exam: storageService.getExam(),
        streak: storageService.getStreak(),
      };

      const response = await fetch('/api/sync/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Lỗi đẩy dữ liệu lên máy chủ.');
      }

      const nowStr = new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN');
      currentStatus.lastSynced = nowStr;
      localStorage.setItem('studycal_last_synced', nowStr);
      currentStatus.error = null;
      return true;
    } catch (error: any) {
      console.error('Push sync error:', error);
      currentStatus.error = error.message || 'Lỗi đồng bộ dữ liệu.';
      return false;
    } finally {
      currentStatus.syncing = false;
      notify();
    }
  },

  async pullCloudToLocal(): Promise<boolean> {
    const authHeader = await this.getAuthHeader();
    if (!authHeader) return false;

    currentStatus.syncing = true;
    notify();

    try {
      const response = await fetch('/api/sync/pull', {
        headers: {
          'Authorization': authHeader,
        },
      });

      if (!response.ok) {
        throw new Error('Lỗi tải dữ liệu đồng bộ về thiết bị.');
      }

      const cloudData = await response.json();

      // Load cloud data into client localStorage
      if (cloudData.tasks) storageService.saveTasks(cloudData.tasks);
      if (cloudData.events) storageService.saveEvents(cloudData.events);
      if (cloudData.notes) storageService.saveNotes(cloudData.notes);
      if (cloudData.goals) storageService.saveGoals(cloudData.goals);
      if (cloudData.exam) storageService.saveExam(cloudData.exam);
      if (cloudData.streak) storageService.saveStreak(cloudData.streak);

      const nowStr = new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN');
      currentStatus.lastSynced = nowStr;
      localStorage.setItem('studycal_last_synced', nowStr);
      currentStatus.error = null;

      // Trigger page reload or state updates
      window.dispatchEvent(new Event('storage'));
      return true;
    } catch (error: any) {
      console.error('Pull sync error:', error);
      currentStatus.error = error.message || 'Lỗi đồng bộ dữ liệu.';
      return false;
    } finally {
      currentStatus.syncing = false;
      notify();
    }
  }
};
