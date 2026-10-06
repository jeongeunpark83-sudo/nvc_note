import React, { useState } from 'react';
import { getTeacherPassword, setTeacherPassword } from '../services/storage';
import { KeyRound, Check, X, AlertCircle } from 'lucide-react';
import { GiraffeCharacter } from './GiraffeCharacter';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const savedPw = getTeacherPassword();
    if (currentPw !== savedPw) {
      setError('현재 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!newPw.trim()) {
      setError('새 비밀번호를 입력해 주세요.');
      return;
    }

    if (newPw.length < 4) {
      setError('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }

    if (newPw !== confirmPw) {
      setError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setTeacherPassword(newPw);
    setSuccessMsg('비밀번호가 성공적으로 변경되었습니다!');
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1200);
  };

  const handleResetToDefault = () => {
    if (window.confirm('비밀번호를 초기 비밀번호(1234)로 재설정하시겠습니까?')) {
      setTeacherPassword('1234');
      setSuccessMsg('초기 비밀번호(1234)로 재설정되었습니다.');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <GiraffeCharacter mood="caring" size="sm" />
            <div>
              <h3 className="font-bold text-lg text-stone-900 flex items-center gap-1.5">
                <KeyRound className="w-5 h-5 text-amber-500" />
                교사 비밀번호 변경
              </h3>
              <p className="text-xs text-stone-500">대시보드 접속 비밀번호를 안전하게 변경하세요.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              현재 비밀번호
            </label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="현재 비밀번호 입력 (초기값: 1234)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              새 비밀번호 (4자 이상)
            </label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="새 비밀번호 입력"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              새 비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="새 비밀번호 다시 입력"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm"
              required
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-1.5 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs flex items-center gap-1.5 border border-emerald-200">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs text-stone-400 hover:text-stone-600 underline"
            >
              초기값(1234)으로 초기화
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-semibold"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                비밀번호 저장
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
