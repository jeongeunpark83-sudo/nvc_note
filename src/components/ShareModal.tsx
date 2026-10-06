import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { getStudentShareUrl, getGoogleSheetUrl } from '../services/storage';
import { GiraffeCharacter } from './GiraffeCharacter';
import { X, Copy, Check, QrCode, ExternalLink, Share2, Smartphone, AlertCircle, Sparkles } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSheetConfig: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onOpenSheetConfig,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const sheetUrl = getGoogleSheetUrl();
  const studentUrl = getStudentShareUrl();

  useEffect(() => {
    if (isOpen && studentUrl) {
      QRCode.toDataURL(studentUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: '#1C1917',
          light: '#FFFBEB',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR 코드 생성 실패:', err));
    }
  }, [isOpen, studentUrl]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(studentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = studentUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-amber-300 space-y-5 animate-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-3">
            <GiraffeCharacter mood="celebrate" size="sm" />
            <div>
              <h3 className="font-bold text-lg text-stone-900 flex items-center gap-1.5">
                <Share2 className="w-5 h-5 text-amber-500" />
                학생 배포용 링크 & QR 코드
              </h3>
              <p className="text-xs text-stone-500">
                선생님 시트가 자동 연결된 링크를 학생들에게 공유하세요!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!sheetUrl ? (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3 text-center">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
            <div>
              <h4 className="font-bold text-sm text-stone-900">
                구글 시트 연동이 아직 되지 않았어요!
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                학생들의 기록을 한곳에 실시간으로 모으려면 먼저 교사용 구글 시트를 연동해 주세요.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenSheetConfig();
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              구글 시트 연동 설정하러 가기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Guide notice */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                다른 기기(스마트폰/태블릿/집 컴퓨터) 자동 연결 보장
              </p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                아래 링크에는 선생님 시트 주소가 암호화되어 포함되어 있습니다. 학생들은 이 링크를 클릭하거나 QR코드를 찍기만 하면 설정 없이 곧바로 선생님 시트로 기록이 전송됩니다!
              </p>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-center">
              <span className="text-xs font-bold text-stone-700 mb-2 flex items-center gap-1">
                <QrCode className="w-4 h-4 text-amber-600" />
                교실 빔프로젝터 / TV 화면용 QR 코드
              </span>
              {qrDataUrl ? (
                <div className="p-2 bg-white rounded-2xl shadow-sm border border-amber-300">
                  <img
                    src={qrDataUrl}
                    alt="학생 배포용 QR 코드"
                    className="w-48 h-48 rounded-xl object-contain"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-stone-100 rounded-xl flex items-center justify-center text-xs text-stone-400">
                  QR 코드 생성 중...
                </div>
              )}
              <p className="text-[11px] text-stone-500 mt-2">
                학생들이 태블릿이나 스마트폰 카메라로 비추면 바로 하루공책이 열립니다 📱
              </p>
            </div>

            {/* Share Link Copy */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                학생 공유용 URL (클래스팅, 알림장, 카카오톡 등에 복사해서 붙여넣기):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={studentUrl}
                  className="flex-1 px-3 py-2 bg-stone-100 rounded-xl border border-stone-300 text-xs text-stone-700 font-mono truncate"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '복사 완료!' : '링크 복사'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-stone-200">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
