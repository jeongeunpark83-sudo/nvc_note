import React from 'react';
import { GiraffeCharacter } from './GiraffeCharacter';
import { BookOpen, PenTool, LayoutDashboard, HelpCircle, FileSpreadsheet, CheckCircle2, Share2 } from 'lucide-react';

interface NavbarProps {
  currentTab: 'write' | 'history' | 'teacher';
  onSelectTab: (tab: 'write' | 'history' | 'teacher') => void;
  onOpenGuide: () => void;
  onOpenSheetModal: () => void;
  onOpenShareModal?: () => void;
  isSheetConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenGuide,
  onOpenSheetModal,
  onOpenShareModal,
  isSheetConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-amber-50/90 backdrop-blur-md border-b-2 border-amber-200">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div
          onClick={() => onSelectTab('write')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <GiraffeCharacter mood="happy" size="sm" className="group-hover:scale-105 transition" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base text-stone-900 tracking-tight">
                우리반 비폭력대화 하루공책
              </span>
              <span className="text-xs">🦒</span>
            </div>
            <p className="text-[11px] text-amber-800 font-medium hidden sm:block">
              기린의 큰 심장으로 나와 친구의 마음을 잇는 시간
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('write')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentTab === 'write'
                ? 'bg-amber-400 text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-amber-100/60'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>하루공책 쓰기</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentTab === 'history'
                ? 'bg-amber-400 text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-amber-100/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>모아보기</span>
          </button>

          <button
            onClick={() => onSelectTab('teacher')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentTab === 'teacher'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900 hover:bg-amber-100/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
            <span>선생님 대시보드</span>
          </button>
        </nav>

        {/* Right side utility icons */}
        <div className="flex items-center gap-1.5">
          {/* Share Link button */}
          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              title="학생들에게 배포할 링크와 QR코드 열기"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition border border-amber-300 bg-amber-100/70 hover:bg-amber-200 text-amber-900"
            >
              <Share2 className="w-3 h-3 text-amber-700" />
              <span>학생 배포용 링크</span>
            </button>
          )}

          {/* Sheet Status Badge */}
          <button
            onClick={onOpenSheetModal}
            title={isSheetConnected ? '구글 스프레드시트 실시간 연동됨' : '구글 스프레드시트 연동 설정하기'}
            className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition border ${
              isSheetConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-stone-100 text-stone-600 border-stone-300 hover:bg-stone-200'
            }`}
          >
            <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
            <span>{isSheetConnected ? '시트 연동됨' : '시트 연동'}</span>
          </button>

          {/* Guide Button */}
          <button
            onClick={onOpenGuide}
            className="p-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-amber-200/50 transition flex items-center gap-1 text-xs font-bold"
            title="비폭력대화란?"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span className="hidden lg:inline text-[11px]">기린 대화법</span>
          </button>
        </div>
      </div>
    </header>
  );
};
