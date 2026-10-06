import React, { useState } from 'react';
import { getTeacherPassword } from '../services/storage';
import { GiraffeCharacter } from './GiraffeCharacter';
import { Lock, KeyRound, AlertCircle, X } from 'lucide-react';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = getTeacherPassword();
    if (password === saved) {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-4 border-amber-300 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <GiraffeCharacter mood="thinking" size="sm" />
            <div>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-600" />
                선생님 대시보드 로그인
              </h3>
              <p className="text-xs text-stone-500">학생들의 하루공책을 열람합니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-100 text-stone-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              선생님 비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder="비밀번호 입력 (기본: 1234)"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm font-medium"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-1.5 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>비밀번호가 일치하지 않습니다. (기본: 1234)</span>
            </div>
          )}

          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
            <p className="font-semibold flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-amber-700" />
              초기 비밀번호 안내: <span className="underline font-bold">1234</span>
            </p>
            <p className="text-stone-500">
              대시보드 접속 후 언제든지 원하는 비밀번호로 변경할 수 있습니다.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-semibold"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              대시보드 입장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
