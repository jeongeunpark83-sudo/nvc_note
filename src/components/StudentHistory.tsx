import React, { useState, useMemo } from 'react';
import { JournalEntry } from '../types/nvc';
import { GiraffeCharacter } from './GiraffeCharacter';
import {
  Calendar,
  User,
  Heart,
  Search,
  MessageCircle,
  Tag,
  Sparkles,
  BookOpen,
  Trash2,
  Filter,
  RefreshCw,
} from 'lucide-react';

interface StudentHistoryProps {
  entries: JournalEntry[];
  currentStudentName: string;
  onWriteNew: () => void;
  onDeleteEntry: (id: string) => void;
  onSyncFromSheet?: () => Promise<void>;
  isSyncing?: boolean;
}

export const StudentHistory: React.FC<StudentHistoryProps> = ({
  entries,
  currentStudentName,
  onWriteNew,
  onDeleteEntry,
  onSyncFromSheet,
  isSyncing = false,
}) => {
  const [selectedStudent, setSelectedStudent] = useState<string>(currentStudentName || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [feelingFilter, setFeelingFilter] = useState<'all' | 'fulfilled' | 'unfulfilled'>('all');

  // List of all unique student names
  const allStudentNames = useMemo(() => {
    const names = Array.from(new Set(entries.map((e) => e.studentName))).filter(Boolean);
    return names;
  }, [entries]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Student filter
      if (selectedStudent !== 'all' && entry.studentName !== selectedStudent) {
        return false;
      }

      // Feeling type filter
      if (feelingFilter !== 'all') {
        if (feelingFilter === 'fulfilled' && entry.feelingType === 'unfulfilled') return false;
        if (feelingFilter === 'unfulfilled' && entry.feelingType === 'fulfilled') return false;
      }

      // Query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inObs = entry.observation.toLowerCase().includes(q);
        const inFeel = entry.feelings.some((f) => f.toLowerCase().includes(q));
        const inNeed = entry.needs.some((n) => n.toLowerCase().includes(q));
        const inReq = entry.request?.toLowerCase().includes(q) || false;
        const inName = entry.studentName.toLowerCase().includes(q);
        if (!inObs && !inFeel && !inNeed && !inReq && !inName) {
          return false;
        }
      }

      return true;
    });
  }, [entries, selectedStudent, feelingFilter, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <GiraffeCharacter mood="caring" size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
                마음 기록 보관함 📚
              </span>
              <span className="text-xs text-stone-500 font-medium">
                총 {entries.length}개의 기록 누적
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              {selectedStudent === 'all'
                ? '우리반 비폭력대화 하루공책 모아보기'
                : `${selectedStudent} 학생의 하루공책 모음집 🦒`}
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              차곡차곡 쌓인 내 마음의 발자국을 다시 읽어보세요.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSyncFromSheet && (
            <button
              onClick={onSyncFromSheet}
              disabled={isSyncing}
              className="px-3.5 py-2.5 bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              title="구글 시트에서 최신 기록 새로고침"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? '동기화 중...' : '시트 새로고침'}</span>
            </button>
          )}

          <button
            onClick={onWriteNew}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-bold shadow-md transition flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            새 하루공책 쓰기
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-amber-50/70 p-4 rounded-3xl border border-amber-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Student dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <User className="w-4 h-4 text-amber-700 shrink-0" />
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full md:w-48 px-3 py-2 bg-white rounded-xl border border-amber-300 text-xs font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
          >
            <option value="all">전체 학생 기록 보기</option>
            {allStudentNames.map((name) => (
              <option key={name} value={name}>
                {name} 학생
              </option>
            ))}
          </select>
        </div>

        {/* Emotion filter tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/80 rounded-2xl border border-amber-200 w-full md:w-auto justify-center">
          <button
            onClick={() => setFeelingFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              feelingFilter === 'all'
                ? 'bg-amber-400 text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFeelingFilter('fulfilled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              feelingFilter === 'fulfilled'
                ? 'bg-amber-400 text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            기쁜 느낌 😊
          </button>
          <button
            onClick={() => setFeelingFilter('unfulfilled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              feelingFilter === 'unfulfilled'
                ? 'bg-rose-400 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            속상한 느낌 🥺
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-56">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="관찰·느낌·욕구 내용 검색..."
            className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-amber-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-400"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-amber-300 space-y-4">
          <GiraffeCharacter mood="thinking" size="lg" className="mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-800">
              해당하는 하루공책 기록이 없어요
            </h3>
            <p className="text-xs text-stone-500">
              필터를 변경하거나 오늘 있었던 일을 새로 기록해 볼까요?
            </p>
          </div>
          <button
            onClick={onWriteNew}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-bold shadow-md transition inline-flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            오늘의 하루공책 작성하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEntries.map((entry) => {
            const isUnfulfilled = entry.feelingType === 'unfulfilled';
            const dateStr = entry.date || entry.timestamp.split('T')[0];

            return (
              <div
                key={entry.id}
                className="bg-white rounded-3xl p-6 border-2 border-amber-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* Header ribbon */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    isUnfulfilled
                      ? 'bg-rose-400'
                      : entry.feelingType === 'both'
                      ? 'bg-gradient-to-r from-amber-400 to-rose-400'
                      : 'bg-amber-400'
                  }`}
                />

                {/* Entry meta */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-xs border border-amber-300">
                      {entry.studentName.slice(0, 1)}
                    </span>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">
                        {entry.studentName}
                        <span className="text-xs text-stone-500 font-normal ml-1">
                          ({entry.grade || '4'}학년 {entry.classNum || '2'}반 {entry.studentNumber ? `${entry.studentNumber}번` : ''})
                        </span>
                      </h4>
                      <p className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('이 하루공책 기록을 삭제하시겠습니까?')) {
                        onDeleteEntry(entry.id);
                      }
                    }}
                    className="p-1.5 text-stone-300 hover:text-rose-500 transition rounded-lg hover:bg-stone-100"
                    title="기록 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content: 4 Steps */}
                <div className="space-y-3 text-xs">
                  {/* 1. Observation */}
                  <div className="bg-amber-50/40 p-3 rounded-2xl border border-amber-100">
                    <span className="font-bold text-amber-900 block mb-1 flex items-center gap-1 text-[11px]">
                      🔍 1단계 [관찰]
                    </span>
                    <p className="text-stone-800 leading-relaxed whitespace-pre-wrap">
                      {entry.observation}
                    </p>
                  </div>

                  {/* 2. Feelings */}
                  <div>
                    <span className="font-bold text-stone-600 block mb-1 text-[11px] flex items-center gap-1">
                      💛 2단계 [느낌]
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {entry.feelings.map((f, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded-lg font-bold text-[11px] ${
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

                  {/* 3. Needs */}
                  <div>
                    <span className="font-bold text-stone-600 block mb-1 text-[11px] flex items-center gap-1">
                      🌱 3단계 [욕구]
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {entry.needs.map((n, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg font-bold text-[11px] bg-emerald-100 text-emerald-900"
                        >
                          🌱 {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 4. Request */}
                  {entry.request && (
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <span className="font-bold text-stone-700 block mb-0.5 text-[11px] flex items-center gap-1">
                        💌 4단계 [부탁과 다짐]
                      </span>
                      <p className="text-stone-700 italic">
                        "{entry.request}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Teacher's Comment & Sticker section */}
                {entry.teacherComment ? (
                  <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1">
                        👩‍🏫 선생님의 따뜻한 응원
                      </span>
                      {entry.teacherSticker && (
                        <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full font-bold text-[10px]">
                          {entry.teacherSticker}
                        </span>
                      )}
                    </div>
                    <p className="text-stone-800 font-medium leading-relaxed">
                      {entry.teacherComment}
                    </p>
                  </div>
                ) : (
                  <div className="pt-1 flex items-center justify-between text-[11px] text-stone-400">
                    <span className="flex items-center gap-1">
                      🦒 기린 친구가 마음을 기억하고 있어요
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
