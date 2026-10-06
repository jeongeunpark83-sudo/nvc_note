import React, { useState, useMemo } from 'react';
import { JournalEntry, ClassStats } from '../types/nvc';
import { TEACHER_STICKERS } from '../data/nvcData';
import {
  computeClassStats,
  updateEntry,
  deleteEntry,
  getGoogleSheetUrl,
} from '../services/storage';
import { GiraffeCharacter } from './GiraffeCharacter';
import {
  Users,
  Calendar,
  Heart,
  TrendingUp,
  Download,
  KeyRound,
  FileSpreadsheet,
  MessageSquarePlus,
  Search,
  Filter,
  Trash2,
  Smile,
  Frown,
  CheckCircle2,
  AlertTriangle,
  Send,
  X,
  Sparkles,
  RefreshCw,
  Share2,
  QrCode,
  Smartphone,
} from 'lucide-react';

interface TeacherDashboardProps {
  entries: JournalEntry[];
  onEntriesChange: () => void;
  onOpenPasswordModal: () => void;
  onOpenSheetModal: () => void;
  onOpenShareModal: () => void;
  onSyncFromSheet: () => Promise<void>;
  isSyncing: boolean;
  lastSyncTime: string;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  entries,
  onEntriesChange,
  onOpenPasswordModal,
  onOpenSheetModal,
  onOpenShareModal,
  onSyncFromSheet,
  isSyncing,
  lastSyncTime,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'needCare' | 'byStudent'>('all');
  const [selectedStudentForTimeline, setSelectedStudentForTimeline] = useState<string>('');

  // Comment modal state
  const [commentModalEntry, setCommentModalEntry] = useState<JournalEntry | null>(null);
  const [teacherCommentText, setTeacherCommentText] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('따뜻한 기린 포옹');

  const sheetUrl = getGoogleSheetUrl();

  // Unique classes in entries
  const classList = useMemo(() => {
    const set = new Set(
      entries.map((e) => `${e.grade || '3'}학년 ${e.classNum || '5'}반`).filter(Boolean)
    );
    return Array.from(set);
  }, [entries]);

  // Entries filtered by selected class
  const classEntries = useMemo(() => {
    if (selectedClass === 'all') return entries;
    return entries.filter(
      (e) => `${e.grade || '3'}학년 ${e.classNum || '5'}반` === selectedClass
    );
  }, [entries, selectedClass]);

  // Statistics
  const stats: ClassStats = useMemo(() => {
    return computeClassStats(classEntries);
  }, [classEntries]);

  // All student names in this class
  const studentNames = useMemo(() => {
    return Array.from(new Set(classEntries.map((e) => e.studentName))).filter(Boolean);
  }, [classEntries]);

  // Tab filtered entries
  const tabFilteredEntries = useMemo(() => {
    let result = classEntries;

    if (activeTab === 'needCare') {
      result = result.filter(
        (e) =>
          e.feelingType === 'unfulfilled' ||
          e.feelings.some((f) =>
            ['속상', '서운', '화가', '불안', '피곤', '외로', '억울', '막막'].some((k) =>
              f.includes(k)
            )
          )
      );
    } else if (activeTab === 'byStudent') {
      if (selectedStudentForTimeline) {
        result = result.filter((e) => e.studentName === selectedStudentForTimeline);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.studentName.toLowerCase().includes(q) ||
          e.observation.toLowerCase().includes(q) ||
          e.feelings.some((f) => f.toLowerCase().includes(q)) ||
          e.needs.some((n) => n.toLowerCase().includes(q)) ||
          (e.request && e.request.toLowerCase().includes(q))
      );
    }

    return result;
  }, [classEntries, activeTab, selectedStudentForTimeline, searchQuery]);

  // Open comment dialog
  const handleOpenComment = (entry: JournalEntry) => {
    setCommentModalEntry(entry);
    setTeacherCommentText(entry.teacherComment || '');
    setSelectedSticker(entry.teacherSticker || '따뜻한 기린 포옹');
  };

  // Save teacher comment
  const handleSaveComment = () => {
    if (!commentModalEntry) return;
    const updated: JournalEntry = {
      ...commentModalEntry,
      teacherComment: teacherCommentText.trim(),
      teacherCommentAt: new Date().toISOString(),
      teacherSticker: selectedSticker,
    };
    updateEntry(updated);
    setCommentModalEntry(null);
    onEntriesChange();
  };

  // CSV Export for teacher
  const handleExportCSV = () => {
    const headers = [
      '제출일시',
      '날짜',
      '학년',
      '반',
      '번호',
      '이름',
      '1단계_관찰',
      '2단계_느낌',
      '느낌유형',
      '3단계_욕구',
      '4단계_부탁_다짐',
      '선생님_코멘트',
    ];

    const rows = classEntries.map((e) => [
      `"${e.timestamp || ''}"`,
      `"${e.date || ''}"`,
      `"${e.grade || ''}"`,
      `"${e.classNum || ''}"`,
      `"${e.studentNumber || ''}"`,
      `"${e.studentName || ''}"`,
      `"${(e.observation || '').replace(/"/g, '""')}"`,
      `"${(e.feelings || []).join(', ')}"`,
      `"${e.feelingType || ''}"`,
      `"${(e.needs || []).join(', ')}"`,
      `"${(e.request || '').replace(/"/g, '""')}"`,
      `"${(e.teacherComment || '').replace(/"/g, '""')}"`,
    ]);

    // Add UTF-8 BOM so Excel opens Korean text cleanly without garbled characters
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `우리반_비폭력대화_하루공책_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Emotional climate calculation
  const totalFeelingsReported = (stats.fulfilledCount || 0) + (stats.unfulfilledCount || 0);
  const fulfilledRatio = totalFeelingsReported > 0 ? Math.round((stats.fulfilledCount / totalFeelingsReported) * 100) : 50;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <GiraffeCharacter mood="happy" size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-500 text-stone-900 rounded-full text-xs font-bold">
                교사 전용 대시보드
              </span>
              {sheetUrl ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  구글 시트 실시간 연동 중
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                  로컬 보관 모드
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              우리반 마음 안테나 & 하루공책 관리 🦒
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              학생들의 느낌과 욕구를 한눈에 살펴보고 따뜻한 피드백을 건네보세요.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Real-time Cloud Sync Button */}
          <button
            onClick={onSyncFromSheet}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            title="구글 시트에 모인 모든 학생 기기의 하루공책을 실시간으로 가져옵니다"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? '시트에서 취합 중...' : '시트 실시간 취합'}</span>
          </button>

          {/* Share Link & QR Button */}
          <button
            onClick={onOpenShareModal}
            className="px-3.5 py-2 rounded-xl border-2 border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs"
            title="학생들이 다른 기기에서 바로 연결되는 링크 및 QR코드 생성"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-700" />
            <span>학생 배포용 링크 & QR</span>
          </button>

          <button
            onClick={onOpenSheetModal}
            className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
            연동 설정
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            엑셀 저장
          </button>

          <button
            onClick={onOpenPasswordModal}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            비밀번호 변경
          </button>
        </div>
      </div>

      {/* Multi-Device Aggregation Notice Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-2xl p-4 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Smartphone className="w-4 h-4 text-amber-700 shrink-0" />
          <div>
            <span className="font-bold text-amber-950">
              📱 학생 각자의 스마트폰·태블릿에서 입력한 하루공책 취합 방법:
            </span>
            <p className="text-stone-600 text-[11px] mt-0.5">
              상단 <span className="font-bold text-amber-900">[학생 배포용 링크 & QR]</span>을 복사해 학생들에게 안내하세요. 학생들이 제출하면 우측 <span className="font-bold text-amber-900">[시트 실시간 취합]</span> 버튼을 누르거나 페이지 진입 시 자동으로 교사 컴퓨터에 모입니다!
            </p>
          </div>
        </div>

        {lastSyncTime && (
          <div className="text-[11px] text-stone-500 font-medium shrink-0 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-200">
            마지막 취합: {lastSyncTime}
          </div>
        )}
      </div>

      {/* Class filter and Stats Grid */}
      <div className="space-y-4">
        {/* Class selector row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700">학급 선택:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 bg-white rounded-xl border border-amber-300 text-xs font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            >
              <option value="all">전체 학급</option>
              {classList.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            기준 일자: {new Date().toLocaleDateString('ko-KR')}
          </span>
        </div>

        {/* 4 Metrics Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200/80 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              오늘 제출 기록
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-stone-900">{stats.todayCount}</span>
              <span className="text-xs text-stone-400">명</span>
            </div>
            <p className="text-[11px] text-amber-700 font-medium">오늘 교실의 하루공책</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200/80 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              참여 학생 수
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-stone-900">{stats.studentCount}</span>
              <span className="text-xs text-stone-400">명 누적</span>
            </div>
            <p className="text-[11px] text-blue-700 font-medium">총 {stats.totalEntries}회 작성됨</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200/80 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-emerald-600" />
              충족된 느낌 (긍정)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-700">{stats.fulfilledCount}</span>
              <span className="text-xs text-stone-400">건</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">기쁨·감사·평온</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200/80 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              마음 돌봄 필요 (미충족)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-rose-600">{stats.unfulfilledCount}</span>
              <span className="text-xs text-stone-400">건</span>
            </div>
            <p className="text-[11px] text-rose-700 font-medium">속상·서운·피곤</p>
          </div>
        </div>

        {/* Emotion Climate Bar + Top Feelings/Needs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Emotion Climate Meter */}
          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                학급 정서 기후 (감정 온도)
              </h3>
              <span className="text-[11px] font-bold text-stone-500">
                충족 {fulfilledRatio}%
              </span>
            </div>

            <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden flex border border-stone-200">
              <div
                style={{ width: `${fulfilledRatio}%` }}
                className="bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
                title={`충족된 느낌: ${fulfilledRatio}%`}
              />
              <div
                style={{ width: `${100 - fulfilledRatio}%` }}
                className="bg-rose-400 transition-all duration-500"
                title={`돌봄 필요 느낌: ${100 - fulfilledRatio}%`}
              />
            </div>

            <div className="flex justify-between text-[11px] text-stone-600 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                기쁨·평온 ({stats.fulfilledCount})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                돌봄필요 ({stats.unfulfilledCount})
              </span>
            </div>

            <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200 leading-relaxed">
              💡 미충족 비율이 높을 때는 친구 간 갈등이나 신체적 피로도(수면 부족, 숙제 부담)를 살펴보세요.
            </p>
          </div>

          {/* Top Feelings */}
          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              가장 많이 표현된 느낌 TOP 5
            </h3>
            {stats.topFeelings.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-4 text-center">아직 기록된 느낌이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {stats.topFeelings.slice(0, 5).map((f) => (
                  <div key={f.word} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-700 flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          f.category === 'unfulfilled' ? 'bg-rose-400' : 'bg-amber-400'
                        }`}
                      />
                      {f.word}
                    </span>
                    <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md text-[11px]">
                      {f.count}회
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Needs */}
          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              우리 반이 원한 소중한 욕구 TOP 5
            </h3>
            {stats.topNeeds.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-4 text-center">아직 기록된 욕구가 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {stats.topNeeds.slice(0, 5).map((n) => (
                  <div key={n.word} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {n.word}
                    </span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px] border border-emerald-200">
                      {n.count}회
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Observation Feed & Tabs */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'all'
                  ? 'bg-amber-400 text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              전체 기록 ({classEntries.length})
            </button>
            <button
              onClick={() => setActiveTab('needCare')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                activeTab === 'needCare'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              마음 돌봄 필요 우선보기
            </button>
            <button
              onClick={() => setActiveTab('byStudent')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'byStudent'
                  ? 'bg-amber-400 text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              학생별 타임라인
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="학생 이름, 관찰 내용 검색..."
              className="w-full pl-8 pr-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Student selector when activeTab is byStudent */}
        {activeTab === 'byStudent' && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <span className="text-xs font-bold text-amber-900 shrink-0">학생 선택:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedStudentForTimeline('')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  selectedStudentForTimeline === ''
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-amber-100'
                }`}
              >
                전체 학생
              </button>
              {studentNames.map((name) => (
                <button
                  key={name}
                  onClick={() => setSelectedStudentForTimeline(name)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    selectedStudentForTimeline === name
                      ? 'bg-amber-500 text-white'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-amber-100'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feed List */}
        {tabFilteredEntries.length === 0 ? (
          <div className="py-12 text-center text-stone-400 space-y-2">
            <GiraffeCharacter mood="thinking" size="md" className="mx-auto" />
            <p className="text-xs font-medium">해당 조건의 하루공책 기록이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tabFilteredEntries.map((entry) => {
              const isUnfulfilled = entry.feelingType === 'unfulfilled';

              return (
                <div
                  key={entry.id}
                  className={`p-5 rounded-3xl border-2 transition relative ${
                    isUnfulfilled
                      ? 'bg-rose-50/40 border-rose-200'
                      : 'bg-white border-amber-200/80 hover:border-amber-300'
                  }`}
                >
                  {/* Card Top */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-2xl bg-amber-400 text-stone-900 font-extrabold flex items-center justify-center text-sm shadow-xs">
                        {entry.studentName.slice(0, 1)}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-sm">
                            {entry.studentName}
                          </h4>
                          <span className="text-xs text-stone-500">
                            {entry.grade || '3'}학년 {entry.classNum || '5'}반{' '}
                            {entry.studentNumber ? `${entry.studentNumber}번` : ''}
                          </span>
                          {isUnfulfilled && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-200 flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              돌봄 필요
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {entry.date || entry.timestamp.split('T')[0]} (
                          {new Date(entry.timestamp).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          )
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleOpenComment(entry)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                          entry.teacherComment
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                        }`}
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                        {entry.teacherComment ? '응원 말씀 수정' : '응원 한마디 남기기'}
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('이 학생의 기록을 삭제하시겠습니까?')) {
                            deleteEntry(entry.id);
                            onEntriesChange();
                          }
                        }}
                        className="p-1.5 text-stone-300 hover:text-rose-500 rounded-lg transition"
                        title="기록 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 4 Steps Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs">
                    {/* Step 1 Observation */}
                    <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100">
                      <span className="font-bold text-amber-900 block mb-1 text-[11px]">
                        🔍 1단계 [관찰]
                      </span>
                      <p className="text-stone-800 leading-relaxed">{entry.observation}</p>
                    </div>

                    {/* Step 2 Feelings & Step 3 Needs */}
                    <div className="space-y-2">
                      <div className="bg-white p-2.5 rounded-2xl border border-stone-200">
                        <span className="font-bold text-stone-600 block mb-1 text-[11px]">
                          💛 2단계 [느낌]
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {entry.feelings.map((f, i) => (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                isUnfulfilled
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-2xl border border-stone-200">
                        <span className="font-bold text-stone-600 block mb-1 text-[11px]">
                          🌱 3단계 [욕구]
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {entry.needs.map((n, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-100 text-emerald-800"
                            >
                              🌱 {n}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 Request */}
                  {entry.request && (
                    <div className="mt-2.5 bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs">
                      <span className="font-bold text-stone-700 block mb-0.5 text-[11px]">
                        💌 4단계 [부탁과 다짐]
                      </span>
                      <p className="text-stone-700 italic">"{entry.request}"</p>
                    </div>
                  )}

                  {/* Teacher's Comment banner if present */}
                  {entry.teacherComment && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-300 text-xs flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-0.5">
                          <span>👩‍🏫 남긴 응원 말씀:</span>
                          {entry.teacherSticker && (
                            <span className="px-2 py-0.2 bg-amber-200 text-amber-900 rounded-full text-[10px]">
                              {entry.teacherSticker}
                            </span>
                          )}
                        </div>
                        <p className="text-stone-800">{entry.teacherComment}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Teacher Comment Modal */}
      {commentModalEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-amber-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-3">
                <GiraffeCharacter mood="caring" size="sm" />
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    {commentModalEntry.studentName} 학생에게 응원 한마디
                  </h3>
                  <p className="text-xs text-stone-500">
                    학생이 자신의 모아보기 화면에서 선생님의 따뜻한 응원을 보게 됩니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCommentModalEntry(null)}
                className="p-1 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {/* Sticker Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                칭찬 스티커 고르기
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {TEACHER_STICKERS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSticker(s.label)}
                    className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                      selectedSticker === s.label
                        ? 'bg-amber-400 text-stone-900 border-amber-500 ring-2 ring-amber-300'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span className="truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">
                격려와 공감의 말씀
              </label>
              <textarea
                value={teacherCommentText}
                onChange={(e) => setTeacherCommentText(e.target.value)}
                rows={3}
                placeholder="예: 민우야, 속상한 마음을 솔직하게 표현해줘서 고마워. 선생님도 항상 널 지지할게 🦒💛"
                className="w-full p-3 rounded-2xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-xs leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCommentModalEntry(null)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-semibold"
              >
                취소
              </button>
              <button
                onClick={handleSaveComment}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                응원 등록하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
