import React, { useState, useEffect, useCallback, useRef } from 'react';
import { JournalEntry } from './types/nvc';
import {
  getEntries,
  deleteEntry,
  getGoogleSheetUrl,
  setGoogleSheetUrl,
  getSavedStudentProfile,
  fetchEntriesFromGoogleSheet,
  checkUrlParameters,
} from './services/storage';
import { Navbar } from './components/Navbar';
import { JournalWrite } from './components/JournalWrite';
import { StudentHistory } from './components/StudentHistory';
import { TeacherDashboard } from './components/TeacherDashboard';
import { TeacherLoginModal } from './components/TeacherLoginModal';
import { PasswordChangeModal } from './components/PasswordChangeModal';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { ShareModal } from './components/ShareModal';
import { NvcGuideModal } from './components/NvcGuideModal';
import { GiraffeCharacter } from './components/GiraffeCharacter';
import { Heart } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'write' | 'history' | 'teacher'>('write');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [sheetUrl, setSheetUrl] = useState<string>('');
  const [isTeacherAuth, setIsTeacherAuth] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Sync from sheet function
  const handleSyncFromSheet = useCallback(async () => {
    const currentUrl = getGoogleSheetUrl();
    if (!currentUrl) return;

    setIsSyncing(true);
    try {
      const res = await fetchEntriesFromGoogleSheet(currentUrl);
      if (res.success && res.data) {
        setEntries(res.data);
        setLastSyncTime(new Date().toLocaleTimeString('ko-KR'));
      }
    } catch (err) {
      console.warn('동기화 실패:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Refresh data from localStorage & sheet
  const refreshData = useCallback(() => {
    // URL param check on load (e.g. ?sheet=...)
    checkUrlParameters();
    const list = getEntries();
    setEntries(list);
    const configuredSheet = getGoogleSheetUrl();
    setSheetUrl(configuredSheet);
  }, []);

  useEffect(() => {
    refreshData();
    // If sheet configured, initial fetch from sheet
    if (getGoogleSheetUrl()) {
      handleSyncFromSheet();
    }
  }, [refreshData, handleSyncFromSheet]);

  // Periodic polling when teacher dashboard is open (every 25 seconds)
  useEffect(() => {
    if (currentTab !== 'teacher' || !sheetUrl) return;

    const interval = setInterval(() => {
      handleSyncFromSheet();
    }, 25000);

    return () => clearInterval(interval);
  }, [currentTab, sheetUrl, handleSyncFromSheet]);

  // Handle Tab Switch
  const handleSelectTab = (tab: 'write' | 'history' | 'teacher') => {
    if (tab === 'teacher') {
      if (isTeacherAuth) {
        setCurrentTab('teacher');
        handleSyncFromSheet();
      } else {
        setIsLoginModalOpen(true);
      }
    } else {
      setCurrentTab(tab);
      if (tab === 'history') {
        handleSyncFromSheet();
      }
    }
  };

  // On successful teacher login
  const handleLoginSuccess = () => {
    setIsTeacherAuth(true);
    setIsLoginModalOpen(false);
    setCurrentTab('teacher');
    handleSyncFromSheet();
  };

  // On save sheet URL
  const handleSaveSheetUrl = (url: string) => {
    setGoogleSheetUrl(url);
    setSheetUrl(url);
    if (url) {
      handleSyncFromSheet();
    }
  };

  // Current active student name
  const currentProfile = getSavedStudentProfile();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-stone-800 selection:bg-amber-200">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        isSheetConnected={Boolean(sheetUrl)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'write' && (
          <JournalWrite
            onEntrySaved={() => {
              refreshData();
              handleSyncFromSheet();
            }}
            onViewHistory={() => {
              setCurrentTab('history');
              handleSyncFromSheet();
            }}
          />
        )}

        {currentTab === 'history' && (
          <StudentHistory
            entries={entries}
            currentStudentName={currentProfile.studentName}
            onWriteNew={() => setCurrentTab('write')}
            onDeleteEntry={(id) => {
              deleteEntry(id);
              refreshData();
            }}
            onSyncFromSheet={handleSyncFromSheet}
            isSyncing={isSyncing}
          />
        )}

        {currentTab === 'teacher' && isTeacherAuth && (
          <TeacherDashboard
            entries={entries}
            onEntriesChange={refreshData}
            onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
            onOpenSheetModal={() => setIsSheetModalOpen(true)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onSyncFromSheet={handleSyncFromSheet}
            isSyncing={isSyncing}
            lastSyncTime={lastSyncTime}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-amber-100/50 border-t border-amber-200 py-6 text-center text-xs text-stone-600 space-y-2">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GiraffeCharacter mood="happy" size="sm" />
            <div className="text-left">
              <p className="font-bold text-stone-800">우리반 비폭력대화 하루공책 🦒</p>
              <p className="text-[11px] text-amber-900">
                1단계 관찰 · 2단계 느낌 · 3단계 욕구 · 4단계 부탁
              </p>
            </div>
          </div>

          <div className="text-right text-[11px] text-stone-500 space-y-0.5">
            <p className="flex items-center justify-center sm:justify-end gap-1">
              <span>기린의 따뜻한 큰 심장으로 서로를 이해해요</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </p>
            <p>다중 기기 실시간 취합 · 구글 스프레드시트 클라우드 연동</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TeacherLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={refreshData}
      />

      <GoogleSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        currentUrl={sheetUrl}
        onSaveUrl={handleSaveSheetUrl}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenSheetConfig={() => setIsSheetModalOpen(true)}
      />

      <NvcGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
