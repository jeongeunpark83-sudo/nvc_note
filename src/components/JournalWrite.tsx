import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types/nvc';
import {
  FULFILLED_FEELINGS,
  UNFULFILLED_FEELINGS,
  NEED_CATEGORIES,
  GIRAFFE_CHEERS,
} from '../data/nvcData';
import {
  saveEntry,
  getSavedStudentProfile,
  getGoogleSheetUrl,
} from '../services/storage';
import { GiraffeCharacter } from './GiraffeCharacter';
import confetti from 'canvas-confetti';
import {
  Send,
  Plus,
  X,
  CheckCircle,
  Sparkles,
  BookOpen,
  Heart,
  Smile,
  Frown,
  Compass,
  MessageCircleHeart,
  Lightbulb,
  CloudCheck,
} from 'lucide-react';

interface JournalWriteProps {
  onEntrySaved: () => void;
  onViewHistory: () => void;
}

export const JournalWrite: React.FC<JournalWriteProps> = ({
  onEntrySaved,
  onViewHistory,
}) => {
  // Student Profile
  const [grade, setGrade] = useState('3');
  const [classNum, setClassNum] = useState('5');
  const [studentNumber, setStudentNumber] = useState('');
  const [studentName, setStudentName] = useState('');

  // NVC 4 Steps
  const [observation, setObservation] = useState('');
  const [feelings, setFeelings] = useState<string[]>([]);
  const [activeFeelingTab, setActiveFeelingTab] = useState<'fulfilled' | 'unfulfilled'>('fulfilled');
  const [customFeeling, setCustomFeeling] = useState('');
  const [needs, setNeeds] = useState<string[]>([]);
  const [customNeed, setCustomNeed] = useState('');
  const [request, setRequest] = useState('');

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [syncStatus, setSyncStatus] = useState<boolean | null>(null);
  const [randomCheer, setRandomCheer] = useState('');
  const [hasSheetConfigured, setHasSheetConfigured] = useState(false);

  // Load saved profile on mount
  useEffect(() => {
    const profile = getSavedStudentProfile();
    if (profile) {
      if (profile.grade) setGrade(profile.grade);
      if (profile.classNum) setClassNum(profile.classNum);
      if (profile.studentNumber) setStudentNumber(profile.studentNumber);
      if (profile.studentName) setStudentName(profile.studentName);
    }
    setHasSheetConfigured(!!getGoogleSheetUrl());
  }, []);

  // Toggle feeling
  const toggleFeeling = (label: string) => {
    if (feelings.includes(label)) {
      setFeelings(feelings.filter((f) => f !== label));
    } else {
      setFeelings([...feelings, label]);
    }
  };

  // Add custom feeling
  const handleAddCustomFeeling = (e: React.FormEvent) => {
    e.preventDefault();
    if (customFeeling.trim() && !feelings.includes(customFeeling.trim())) {
      setFeelings([...feelings, customFeeling.trim()]);
      setCustomFeeling('');
    }
  };

  // Toggle need
  const toggleNeed = (need: string) => {
    if (needs.includes(need)) {
      setNeeds(needs.filter((n) => n !== need));
    } else {
      setNeeds([...needs, need]);
    }
  };

  // Add custom need
  const handleAddCustomNeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (customNeed.trim() && !needs.includes(customNeed.trim())) {
      setNeeds([...needs, customNeed.trim()]);
      setCustomNeed('');
    }
  };

  // Submit journal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      alert('이름을 입력해 주세요! 기린이 기다리고 있어요 🦒');
      return;
    }

    if (!observation.trim()) {
      alert('1단계 [관찰] 오늘 있었던 일을 적어주세요.');
      return;
    }

    if (feelings.length === 0) {
      alert('2단계 [느낌] 최소 1개 이상의 느낌 단어를 골라주세요.');
      return;
    }

    if (needs.length === 0) {
      alert('3단계 [욕구] 최소 1개 이상의 내 마음속 욕구를 골라주세요.');
      return;
    }

    setIsSubmitting(true);

    // Determine feeling category
    const hasFulfilled = feelings.some((f) =>
      FULFILLED_FEELINGS.some((ff) => f.includes(ff.label.split('/')[0].trim()))
    );
    const hasUnfulfilled = feelings.some((f) =>
      UNFULFILLED_FEELINGS.some((uf) => f.includes(uf.label.split('/')[0].trim()))
    );

    let feelingType: 'fulfilled' | 'unfulfilled' | 'both' = 'fulfilled';
    if (hasFulfilled && hasUnfulfilled) feelingType = 'both';
    else if (hasUnfulfilled) feelingType = 'unfulfilled';

    const newEntry: JournalEntry = {
      id: 'entry-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      grade: grade.trim(),
      classNum: classNum.trim(),
      studentNumber: studentNumber.trim(),
      studentName: studentName.trim(),
      observation: observation.trim(),
      feelings,
      feelingType,
      needs,
      request: request.trim(),
    };

    const res = await saveEntry(newEntry);
    setIsSubmitting(false);
    setSyncStatus(res.synced);
    setIsSubmitted(true);

    const cheer = GIRAFFE_CHEERS[Math.floor(Math.random() * GIRAFFE_CHEERS.length)];
    setRandomCheer(cheer);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FBBF24', '#34D399', '#FB7185', '#60A5FA'],
      });
    } catch {}

    onEntrySaved();
  };

  const handleResetForNew = () => {
    setObservation('');
    setFeelings([]);
    setNeeds([]);
    setRequest('');
    setIsSubmitted(false);
    setSyncStatus(null);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white rounded-3xl p-8 border-4 border-amber-300 shadow-xl text-center space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Confetti decoration top bar */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-400 via-pink-400 to-emerald-400" />

          <div className="flex justify-center">
            <GiraffeCharacter mood="celebrate" size="lg" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
              기린 우체통 접수 완료! 📮
            </span>
            <h2 className="text-2xl font-bold text-stone-900">
              {studentName} 학생, 오늘 하루공책을 멋지게 마쳤어요!
            </h2>
            <p className="text-amber-900 text-sm italic font-medium px-4 py-3 bg-amber-50 rounded-2xl border border-amber-200">
              {randomCheer}
            </p>
          </div>

          {/* Sync status alert */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1">
            <div className="flex items-center justify-center gap-1.5 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>하루공책이 우리 교실 공책에 안전하게 기록되었습니다.</span>
            </div>
            {hasSheetConfigured && (
              <p className="text-emerald-700 flex items-center justify-center gap-1">
                <CloudCheck className="w-3.5 h-3.5" />
                선생님 구글 스프레드시트에도 실시간 자동 저장되었습니다!
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={handleResetForNew}
              className="px-6 py-3 rounded-2xl border-2 border-amber-300 text-amber-900 font-bold hover:bg-amber-50 transition text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              새로운 공책 또 쓰기
            </button>
            <button
              onClick={onViewHistory}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition text-sm shadow-md flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              내가 쓴 하루공책 모아보기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-orange-50 rounded-3xl p-6 border-2 border-amber-200 shadow-sm mb-4 flex flex-col md:flex-row items-center gap-5">
        <GiraffeCharacter mood="happy" size="md" />
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200/70 text-amber-900 rounded-full text-xs font-bold mb-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            마음과 마음을 이어주는 기린의 언어
          </div>
          <h1 className="text-2xl font-bold text-stone-900">
            우리반 비폭력대화 하루공책 🦒
          </h1>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            비폭력대화는 큰 심장과 긴 목을 가진 기린처럼,
            <span className="font-semibold text-amber-900"> 있는 그대로 보고(관찰)</span>,
            <span className="font-semibold text-amber-900"> 솔직한 감정을 알아채며(느낌)</span>,
            <span className="font-semibold text-amber-900"> 소중한 마음(욕구)</span>을 나누는 따뜻한 대화법입니다.
          </p>
        </div>
      </div>

      {/* Cloud Sheet Sync Status Banner */}
      <div
        className={`mb-6 p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
          hasSheetConfigured
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
            : 'bg-amber-50 text-amber-900 border-amber-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {hasSheetConfigured ? (
            <CloudCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>
            {hasSheetConfigured
              ? '선생님 구글 시트와 연결됨: 작성 즉시 선생님 컴퓨터로 실시간 전송됩니다 ✨'
              : '알림: 선생님이 공유해주신 링크(QR코드)로 접속하면 교사 시트에 자동 취합됩니다.'}
          </span>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
            hasSheetConfigured
              ? 'bg-emerald-200 text-emerald-950'
              : 'bg-amber-200 text-amber-950'
          }`}
        >
          {hasSheetConfigured ? '실시간 연동 ON' : '로컬 보관 모드'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Profile Card */}
        <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-xs">
          <h2 className="text-sm font-bold text-stone-800 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center text-xs font-extrabold">
              👦
            </span>
            누가 작성하고 있나요?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-stone-600 font-semibold mb-1">학년</label>
              <div className="relative">
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="예: 3"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 bg-amber-50/30 font-medium"
                />
                <span className="absolute right-3 top-2.5 text-stone-400">학년</span>
              </div>
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">반</label>
              <div className="relative">
                <input
                  type="text"
                  value={classNum}
                  onChange={(e) => setClassNum(e.target.value)}
                  placeholder="예: 5"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 bg-amber-50/30 font-medium"
                />
                <span className="absolute right-3 top-2.5 text-stone-400">반</span>
              </div>
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">번호</label>
              <div className="relative">
                <input
                  type="text"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  placeholder="예: 15"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 bg-amber-50/30 font-medium"
                />
                <span className="absolute right-3 top-2.5 text-stone-400">번</span>
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">
                이름 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="예: 김민우"
                className="w-full px-3 py-2 rounded-xl border-2 border-amber-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white font-bold text-stone-800"
                required
              />
            </div>
          </div>
        </div>

        {/* Step 1: 관찰 (Observation) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                1
              </span>
              <div>
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                  1단계: 관찰 (있는 그대로 보기)
                  <span className="text-rose-500 text-xs">*</span>
                </h3>
                <p className="text-xs text-stone-500">
                  판단이나 비난 없이, 카메라로 찍은 것처럼 오늘 일어난 사실을 적어보아요.
                </p>
              </div>
            </div>
            <GiraffeCharacter mood="listening" size="sm" />
          </div>

          <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <span className="font-bold">기린 힌트:</span> "친구가 날 무시했다" 대신 
              <span className="font-semibold"> "내가 이야기할 때 친구가 다른 쪽을 보았다"</span>처럼 사실 위주로 표현해 보세요.
            </p>
          </div>

          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            rows={3}
            placeholder="오늘 나에게 어떤 일이 있었나요? 학교에서, 집에서, 혹은 친구와 있었던 일이나 본 것을 편안하게 적어보세요..."
            className="w-full p-4 rounded-2xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-sm leading-relaxed"
            required
          />
        </div>

        {/* Step 2: 느낌 (Feelings) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                2
              </span>
              <div>
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                  2단계: 느낌 (내 마음 알아채기)
                  <span className="text-rose-500 text-xs">*</span>
                </h3>
                <p className="text-xs text-stone-500">
                  그 일을 겪었을 때 내 마음속에 떠오른 감정들을 골라주세요 (여러 개 선택 가능).
                </p>
              </div>
            </div>
            <GiraffeCharacter mood="caring" size="sm" />
          </div>

          {/* Selected feelings display */}
          <div className="min-h-11 p-3 bg-amber-50/50 rounded-2xl border border-dashed border-amber-300 flex flex-wrap gap-2 items-center">
            {feelings.length === 0 ? (
              <span className="text-xs text-stone-400 italic">
                아래에서 오늘 느꼈던 감정 단어들을 콕콕 눌러보세요 👇
              </span>
            ) : (
              feelings.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400 text-stone-900 font-bold rounded-xl text-xs shadow-xs animate-in zoom-in-95"
                >
                  <span>{f}</span>
                  <button
                    type="button"
                    onClick={() => toggleFeeling(f)}
                    className="p-0.5 hover:bg-amber-500 rounded-full"
                  >
                    <X className="w-3 h-3 text-stone-800" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Feeling Category Tabs */}
          <div className="flex gap-2 p-1 bg-stone-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveFeelingTab('fulfilled')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeFeelingTab === 'fulfilled'
                  ? 'bg-amber-400 text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Smile className="w-4 h-4 text-amber-700" />
              욕구가 채워졌을 때 (기쁨·감사·평온)
            </button>
            <button
              type="button"
              onClick={() => setActiveFeelingTab('unfulfilled')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeFeelingTab === 'unfulfilled'
                  ? 'bg-rose-400 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Frown className="w-4 h-4 text-stone-100" />
              욕구가 채워지지 않았을 때 (속상·서운·피곤)
            </button>
          </div>

          {/* Feelings Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {(activeFeelingTab === 'fulfilled' ? FULFILLED_FEELINGS : UNFULFILLED_FEELINGS).map(
              (item) => {
                const isSelected = feelings.includes(item.label);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleFeeling(item.label)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition flex items-center gap-2 ${
                      isSelected
                        ? activeFeelingTab === 'fulfilled'
                          ? 'bg-amber-400 text-stone-900 border-amber-500 ring-2 ring-amber-300'
                          : 'bg-rose-400 text-white border-rose-500 ring-2 ring-rose-300'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    <span className="text-base shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              }
            )}
          </div>

          {/* Custom Feeling Add Input */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={customFeeling}
              onChange={(e) => setCustomFeeling(e.target.value)}
              placeholder="목록에 없는 다른 느낌 직접 입력하기..."
              className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={handleAddCustomFeeling}
              className="px-3 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-stone-900 transition flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              추가
            </button>
          </div>
        </div>

        {/* Step 3: 욕구 (Needs) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                3
              </span>
              <div>
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                  3단계: 욕구 (소중한 내 마음)
                  <span className="text-rose-500 text-xs">*</span>
                </h3>
                <p className="text-xs text-stone-500">
                  그런 느낌이 든 이유는, 내 마음에 소중한 욕구가 있었기 때문이에요.
                </p>
              </div>
            </div>
            <GiraffeCharacter mood="thinking" size="sm" />
          </div>

          {/* Selected needs display */}
          <div className="min-h-11 p-3 bg-amber-50/50 rounded-2xl border border-dashed border-amber-300 flex flex-wrap gap-2 items-center">
            {needs.length === 0 ? (
              <span className="text-xs text-stone-400 italic">
                내가 진정으로 바라고 원했던 소중한 가치를 골라보세요 🌱
              </span>
            ) : (
              needs.map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs animate-in zoom-in-95"
                >
                  <span>🌱 {n}</span>
                  <button
                    type="button"
                    onClick={() => toggleNeed(n)}
                    className="p-0.5 hover:bg-emerald-600 rounded-full"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Needs Categories Accordion/Cards */}
          <div className="space-y-3">
            {NEED_CATEGORIES.map((category) => (
              <div
                key={category.categoryName}
                className="bg-stone-50/80 rounded-2xl p-3.5 border border-stone-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-bold text-xs text-stone-800">
                      {category.categoryName}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 hidden sm:inline">
                    {category.description}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {category.items.map((item) => {
                    const isSelected = needs.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleNeed(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                          isSelected
                            ? 'bg-emerald-500 text-white font-bold shadow-xs ring-2 ring-emerald-300'
                            : 'bg-white hover:bg-emerald-50 border border-stone-200 text-stone-700'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Custom Need Add Input */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={customNeed}
              onChange={(e) => setCustomNeed(e.target.value)}
              placeholder="목록에 없는 다른 욕구 직접 입력하기 (예: 조용한 나만의 시간)..."
              className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={handleAddCustomNeed}
              className="px-3 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-stone-900 transition flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              추가
            </button>
          </div>
        </div>

        {/* Step 4: 부탁이나 다짐 (Request / Intention) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                4
              </span>
              <div>
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                  4단계: 부탁이나 다짐 (앞으로의 한 걸음)
                </h3>
                <p className="text-xs text-stone-500">
                  나 자신, 친구, 또는 선생님에게 하고 싶은 따뜻한 부탁이나 내일의 다짐을 적어보세요.
                </p>
              </div>
            </div>
            <GiraffeCharacter mood="happy" size="sm" />
          </div>

          {/* Prompt suggestions */}
          <div className="flex flex-wrap gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => setRequest((prev) => (prev ? prev + ' ' : '') + '내일은 내가 먼저 반갑게 인사해보기!')}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg border border-amber-200 transition"
            >
              💡 "내일은 내가 먼저 반갑게 인사해보기!"
            </button>
            <button
              type="button"
              onClick={() => setRequest((prev) => (prev ? prev + ' ' : '') + '친구에게 내 기분을 솔직하고 부드럽게 말해보기')}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg border border-amber-200 transition"
            >
              💡 "내 기분을 부드럽게 말해보기"
            </button>
            <button
              type="button"
              onClick={() => setRequest((prev) => (prev ? prev + ' ' : '') + '오늘 밤에는 푹 자며 나를 쉬게 해주기')}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg border border-amber-200 transition"
            >
              💡 "푹 자며 나를 쉬게 해주기"
            </button>
          </div>

          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            rows={2}
            placeholder="예: '친구에게: 다음에는 내 이야기도 끝까지 들어주면 고맙겠어' 또는 '나에게: 오늘 수고 많았으니 푹 쉬자!'"
            className="w-full p-4 rounded-2xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-sm leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-stone-900 font-extrabold text-base rounded-3xl shadow-lg hover:shadow-xl transition transform active:scale-[0.99] flex items-center justify-center gap-3 border-2 border-amber-300 disabled:opacity-50"
          >
            <Send className="w-5 h-5 text-stone-900" />
            {isSubmitting ? '기린 우체통에 넣는 중...' : '기린 우체통에 하루공책 쏙 넣기 📮'}
          </button>
          <p className="text-center text-xs text-stone-500 mt-2 font-medium">
            작성한 하루공책은 교실 공책과 선생님 시트에 안전하게 전달됩니다 🦒💛
          </p>
        </div>
      </form>
    </div>
  );
};
