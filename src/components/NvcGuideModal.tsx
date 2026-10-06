import React from 'react';
import { GiraffeCharacter } from './GiraffeCharacter';
import { X, Heart, Eye, Sparkles, Send, ShieldCheck } from 'lucide-react';

interface NvcGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NvcGuideModal: React.FC<NvcGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-amber-300 overflow-hidden my-auto animate-in zoom-in-95">
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 px-6 py-4 flex items-center justify-between border-b border-amber-200">
          <div className="flex items-center gap-3">
            <GiraffeCharacter mood="happy" size="sm" />
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                기린의 언어: 비폭력대화(NVC)란?
              </h2>
              <p className="text-xs text-amber-950 font-medium">
                마음과 마음을 이어주는 4단계 대화 여행 🦒💛
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-amber-500/20 text-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-sm text-stone-700 leading-relaxed">
          {/* Why Giraffe? */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-3">
            <span className="text-2xl">🦒</span>
            <div className="space-y-1">
              <h3 className="font-bold text-stone-900 text-xs">
                왜 '기린'이 비폭력대화의 상징일까요?
              </h3>
              <p className="text-xs text-stone-600">
                육상 동물 중 <span className="font-bold text-amber-900">가장 큰 심장</span>을 가진 기린은
                따뜻하고 큰 마음으로 다른 사람과 나 자신을 품어줍니다. 또한 <span className="font-bold text-amber-900">긴 목</span>으로 멀리 넓게 바라보며, 편견이나 성급한 판단 없이 있는 그대로의 사실을 관찰할 수 있답니다.
              </p>
            </div>
          </div>

          {/* 4 Steps */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              비폭력대화의 4단계
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center text-[11px] font-extrabold">
                    1
                  </span>
                  <span>관찰 (Observation)</span>
                </div>
                <p className="text-stone-600">
                  내 판단이나 평가를 섞지 않고, 마치 비디오카메라가 찍은 것처럼 일어난 사실만을 명확하게 말해요.
                </p>
                <div className="p-2 bg-white rounded-xl border border-stone-200 text-stone-500 text-[11px]">
                  "친구가 항상 나만 괴롭힌다" (X)<br />
                  → "오늘 줄을 설 때 친구가 내 발을 밟았다" (O)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center text-[11px] font-extrabold">
                    2
                  </span>
                  <span>느낌 (Feeling)</span>
                </div>
                <p className="text-stone-600">
                  그 일을 겪었을 때 내 몸과 마음에 일어난 솔직한 감정을 알아채고 표현해요. 생각이 아닌 느낌이에요.
                </p>
                <div className="p-2 bg-white rounded-xl border border-stone-200 text-stone-500 text-[11px]">
                  "친구가 날 무시한다는 느낌이야" (생각)<br />
                  → "그 순간 당황스럽고 서운했어" (느낌)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center text-[11px] font-extrabold">
                    3
                  </span>
                  <span>욕구 (Need)</span>
                </div>
                <p className="text-stone-600">
                  모든 느낌의 뿌리는 욕구에 있어요. 내가 진정으로 원하고 소중하게 여기는 마음의 가치를 찾아요.
                </p>
                <div className="p-2 bg-white rounded-xl border border-stone-200 text-stone-500 text-[11px]">
                  "친구가 사과해야 해" (수단/요구)<br />
                  → "존중받고 안전하게 어울리고 싶었어" (욕구)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center text-[11px] font-extrabold">
                    4
                  </span>
                  <span>부탁 (Request)</span>
                </div>
                <p className="text-stone-600">
                  강요나 명령이 아니라, 상대방이 자유롭게 선택할 수 있도록 구체적이고 긍정적인 행동을 부탁해요.
                </p>
                <div className="p-2 bg-white rounded-xl border border-stone-200 text-stone-500 text-[11px]">
                  "똑바로 해!" (명령/비난)<br />
                  → "내 이야기를 끝까지 들어줄 수 있겠니?" (부탁)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-stone-50 px-6 py-3 flex justify-end border-t border-stone-200">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            확인했어요! 🦒
          </button>
        </div>
      </div>
    </div>
  );
};
