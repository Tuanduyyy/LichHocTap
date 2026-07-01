/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Palette, 
  Database, 
  Bell, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles,
  Check,
  Languages,
  Moon,
  Sun,
  Cloud,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, AppSettings } from '../types';
import { storageService } from '../services/storageService';
import { syncService } from '../services/syncService.ts';

interface SettingsViewProps {
  user: UserProfile;
  updateUser: (user: UserProfile) => void;
  settings: AppSettings;
  updateSettings: (settings: AppSettings) => void;
  resetAllData: () => void;
}

export default function SettingsView({
  user,
  updateUser,
  settings,
  updateSettings,
  resetAllData
}: SettingsViewProps) {
  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);
  const [userAvatar, setUserAvatar] = useState(user.avatar);
  
  const [backupInput, setBackupInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState<boolean | null>(null);

  const [syncStatus, setSyncStatus] = useState(syncService.getStatus());

  useEffect(() => {
    return syncService.subscribe((status) => {
      setSyncStatus(status);
      if (status.user) {
        // Automatically reflect Google User info in current profile state if desired
        setUserName(status.user.displayName || user.name);
        setUserEmail(status.user.email || user.email);
        if (status.user.photoURL) {
          setUserAvatar(status.user.photoURL);
        }
      }
    });
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: userName,
      email: userEmail,
      avatar: userAvatar
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleToggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({
      ...settings,
      theme: newTheme
    });
  };

  const handleExportData = () => {
    const backupJson = storageService.exportBackup();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(backupJson);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `StudyCal_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = () => {
    if (!backupInput.trim()) return;
    const success = storageService.importBackup(backupInput.trim());
    setImportSuccess(success);
    if (success) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Personal Profile & Theme */}
      <div className="lg:col-span-6 space-y-6">
        {/* Profile Form */}
        <div className="premium-card p-5 space-y-4">
          <h3 className="font-display font-bold text-sm text-gray-800 dark:text-pink-100 pb-3 border-b border-pink-50 dark:border-pink-950 flex items-center gap-2">
            <User className="w-4.5 h-4.5 text-pink-500" />
            <span>Thông tin cá nhân (Profile)</span>
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4">
              <img 
                src={userAvatar} 
                alt="Avatar Preview" 
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-pink-100 dark:ring-pink-950"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 dark:text-pink-300/40 uppercase">Đường dẫn ảnh đại diện (URL)</label>
                <input
                  type="text"
                  value={userAvatar}
                  onChange={(e) => setUserAvatar(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-pink-100 dark:border-pink-900 bg-pink-50/10 dark:bg-pink-950/20 text-gray-800 dark:text-pink-100 text-xs outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 dark:text-pink-300/40 uppercase">Họ và tên</label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-pink-100 dark:border-pink-900 bg-pink-50/10 dark:bg-pink-950/20 text-gray-800 dark:text-pink-100 text-xs outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 dark:text-pink-300/40 uppercase">Địa chỉ Email</label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-pink-100 dark:border-pink-900 bg-pink-50/10 dark:bg-pink-950/20 text-gray-800 dark:text-pink-100 text-xs outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-[10px] text-gray-400">
                {saveSuccess && <span className="text-emerald-500 font-bold flex items-center gap-1">✓ Đã lưu thay đổi!</span>}
              </p>
              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                Lưu hồ sơ
              </button>
            </div>
          </form>
        </div>

        {/* Customization Settings */}
        <div className="premium-card p-5 space-y-4">
          <h3 className="font-display font-bold text-sm text-gray-800 dark:text-pink-100 pb-3 border-b border-pink-50 dark:border-pink-950 flex items-center gap-2">
            <Palette className="w-4.5 h-4.5 text-pink-500" />
            <span>Giao diện & Tiện ích (Customization)</span>
          </h3>

          <div className="space-y-4">
            {/* Theme selector */}
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-pink-100">Chủ đề giao diện (Theme)</h4>
                <p className="text-[10px] text-gray-400 dark:text-pink-300/60 mt-0.5">Chuyển đổi tức thì giữa Pastel Light Pink và Dark Pink</p>
              </div>
              <button
                onClick={handleToggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-pink-100 dark:border-pink-900 bg-pink-50 dark:bg-pink-950 text-xs font-bold text-pink-500 transition-all hover:bg-pink-100"
              >
                {settings.theme === 'light' ? (
                  <>
                    <Moon className="w-4 h-4 text-pink-500" />
                    <span>Dark Pink</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-pink-500 animate-spin" />
                    <span>Light Pink</span>
                  </>
                )}
              </button>
            </div>

            {/* Language Selection */}
            <div className="flex items-center justify-between py-2 border-t border-pink-50 dark:border-pink-950/40">
              <div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-pink-100">Ngôn ngữ ứng dụng</h4>
                <p className="text-[10px] text-gray-400 dark:text-pink-300/60 mt-0.5">Lựa chọn ngôn ngữ hiển thị chính</p>
              </div>
              <div className="flex gap-1">
                {(['vi', 'en'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => updateSettings({ ...settings, language: lang })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      settings.language === lang
                        ? 'bg-pink-500 text-white border-pink-500 shadow-sm'
                        : 'bg-white dark:bg-pink-950/10 border-pink-100 dark:border-pink-900/40 text-gray-500 dark:text-pink-300'
                    }`}
                  >
                    {lang === 'vi' ? 'Tiếng Việt' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio notifications */}
            <div className="flex items-center justify-between py-2 border-t border-pink-50 dark:border-pink-950/40">
              <div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-pink-100">Chuông báo học tập</h4>
                <p className="text-[10px] text-gray-400 dark:text-pink-300/60 mt-0.5">Nhận âm thanh nhắc nhở xinh xắn trước giờ học</p>
              </div>
              <button
                onClick={() => updateSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  settings.notificationsEnabled
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : 'bg-white dark:bg-pink-950/10 border-pink-100 text-gray-400'
                }`}
              >
                {settings.notificationsEnabled ? 'Bật ✓' : 'Tắt'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Synchronization & Backup Reset */}
      <div className="lg:col-span-6 space-y-6">
        {/* Cloud Synchronization Panel */}
        <div className="premium-card p-5 space-y-4">
          <h3 className="font-display font-bold text-sm text-gray-800 dark:text-pink-100 pb-3 border-b border-pink-50 dark:border-pink-950/40 flex items-center gap-2">
            <Cloud className="w-4.5 h-4.5 text-pink-500" />
            <span>Đồng bộ đám mây (Cloud Sync)</span>
          </h3>

          <div className="space-y-4">
            {syncStatus.isLoggedIn ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {syncStatus.user?.photoURL ? (
                      <img 
                        src={syncStatus.user.photoURL} 
                        alt="User" 
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center font-bold text-pink-600">
                        {syncStatus.user?.email?.[0].toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 dark:text-pink-200 truncate">
                        {syncStatus.user?.displayName || 'Thành viên Cloud'}
                      </h4>
                      <p className="text-[10px] text-gray-400 dark:text-pink-300/60 truncate">
                        {syncStatus.user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => syncService.logout()}
                    className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-500 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-rose-100 dark:border-rose-950 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1 text-[10px] text-gray-400 dark:text-pink-300/50 leading-relaxed bg-pink-50/10 dark:bg-pink-950/10 p-3 rounded-2xl border border-pink-50 dark:border-pink-950">
                  <div className="flex justify-between">
                    <span>Đồng bộ tự động:</span>
                    <span className="text-emerald-500 font-bold">Đã kích hoạt</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Đồng bộ lần cuối:</span>
                    <span className="font-semibold text-gray-600 dark:text-pink-200">
                      {syncStatus.lastSynced || 'Chưa đồng bộ'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => syncService.pushLocalToCloud()}
                    disabled={syncStatus.syncing}
                    className="flex items-center justify-center gap-1.5 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Đẩy lên Cloud</span>
                  </button>
                  <button
                    onClick={() => syncService.pullCloudToLocal()}
                    disabled={syncStatus.syncing}
                    className="flex items-center justify-center gap-1.5 bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100/50 disabled:opacity-50 text-pink-500 border border-pink-100 dark:border-pink-900/60 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải về thiết bị</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 px-2 space-y-3">
                <div className="w-12 h-12 bg-pink-50 dark:bg-pink-950/40 rounded-full flex items-center justify-center mx-auto text-pink-500">
                  <Cloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-700 dark:text-pink-100">Đồng bộ đa thiết bị tức thì</h4>
                  <p className="text-[10px] text-gray-400 dark:text-pink-300/50 mt-1 max-w-xs mx-auto leading-relaxed">
                    Đăng nhập bằng tài khoản Google để tự động đồng bộ thời khóa biểu, ghi chú và các mục tiêu học tập giữa máy tính và điện thoại. Dữ liệu của bạn được mã hóa an toàn trên Cloud SQL.
                  </p>
                </div>
                <button
                  onClick={() => syncService.login()}
                  disabled={syncStatus.syncing}
                  className="mx-auto flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md shadow-pink-200/50 dark:shadow-none transition-all cursor-pointer hover:scale-102"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.743-.079-1.3-.179-1.864H12.24z" />
                  </svg>
                  <span>{syncStatus.syncing ? 'Đang kết nối...' : 'Đăng nhập với Google'}</span>
                </button>
              </div>
            )}

            {syncStatus.error && (
              <p className="text-[10px] text-rose-500 font-medium text-center">{syncStatus.error}</p>
            )}


            {syncStatus.syncing && (
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-pink-500 font-semibold animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Đang đồng bộ cơ sở dữ liệu...</span>
              </div>
            )}
          </div>
        </div>

        {/* Sync & Backups */}
        <div className="premium-card p-5 space-y-4">
          <h3 className="font-display font-bold text-sm text-gray-800 dark:text-pink-100 pb-3 border-b border-pink-50 dark:border-pink-950/40 flex items-center gap-2">
            <Database className="w-4.5 h-4.5 text-pink-500" />
            <span>Sao lưu & Đồng bộ (Backup)</span>
          </h3>

          <div className="space-y-4">
            <div className="p-3 bg-pink-50/20 dark:bg-pink-950/10 rounded-2xl border border-pink-100/50 dark:border-pink-900/30">
              <h4 className="text-xs font-bold text-gray-700 dark:text-pink-200">Xuất dữ liệu dự phòng (JSON Export)</h4>
              <p className="text-[10px] text-gray-400 dark:text-pink-300/50 mt-1 leading-relaxed">Tải xuống toàn bộ nhật ký học tập, ghi chú, lịch học và mục tiêu học tập của bạn thành một file JSON duy nhất để lưu trữ hoặc nhập trên thiết bị khác.</p>
              <button
                onClick={handleExportData}
                className="mt-3 flex items-center gap-1.5 bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100/50 text-pink-500 border border-pink-100 dark:border-pink-900/60 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Tải xuống file sao lưu .json</span>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 dark:text-pink-200">Nhập dữ liệu dự phòng (JSON Import)</h4>
              <p className="text-[10px] text-gray-400 dark:text-pink-300/50 leading-relaxed">Dán chuỗi văn bản JSON sao lưu của bạn vào khung bên dưới để khôi phục trạng thái.</p>
              <textarea
                rows={3}
                placeholder="Dán mã JSON sao lưu vào đây..."
                value={backupInput}
                onChange={(e) => setBackupInput(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-pink-100 dark:border-pink-900/60 bg-pink-50/10 dark:bg-pink-950/20 text-gray-800 dark:text-pink-100 text-xs outline-none focus:border-pink-500 font-mono"
              />
              
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-semibold">
                  {importSuccess === true && <span className="text-emerald-500">✓ Phục hồi thành công! Hệ thống sẽ reload...</span>}
                  {importSuccess === false && <span className="text-rose-500">❌ Lỗi: Mã sao lưu không hợp lệ.</span>}
                </span>
                <button
                  onClick={handleImportData}
                  className="flex items-center gap-1.5 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Nạp dữ liệu dự phòng</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reset System */}
        <div className="premium-card p-5 space-y-4 border border-rose-100 dark:border-rose-950/50">
          <h3 className="font-display font-bold text-sm text-gray-800 dark:text-pink-100 pb-3 border-b border-rose-50 dark:border-rose-950/20 flex items-center gap-2">
            <RotateCcw className="w-4.5 h-4.5 text-rose-500" />
            <span className="text-rose-500">Vùng khẩn cấp (Danger Zone)</span>
          </h3>

          <div className="space-y-3 p-3 bg-rose-50/20 dark:bg-pink-950/5 rounded-2xl">
            <h4 className="text-xs font-bold text-rose-600">Xóa trắng toàn bộ dữ liệu ứng dụng</h4>
            <p className="text-[10px] text-gray-400 dark:text-pink-300/40 leading-relaxed">
              Hành động này sẽ xóa toàn bộ lịch học tự chế, nhiệm vụ, ghi chú, mục tiêu hiện có của bạn và khởi tạo lại dữ liệu mẫu StudyCal ban đầu. Thao tác này không thể thu hồi.
            </p>
            
            <button
              onClick={() => {
                if (window.confirm("Bạn có chắc chắn muốn RESET toàn bộ lịch học của StudyCal về ban đầu? Mọi ghi chú tự tạo sẽ bị xoá vĩnh viễn.")) {
                  resetAllData();
                }
              }}
              className="mt-2 flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset dữ liệu mẫu ban đầu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
