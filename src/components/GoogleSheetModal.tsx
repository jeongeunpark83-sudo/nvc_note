import React, { useState } from 'react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/nvcData';
import { testGoogleSheetConnection } from '../services/storage';
import { Check, Copy, ExternalLink, HelpCircle, X, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { GiraffeCharacter } from './GiraffeCharacter';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSaveUrl: (url: string) => void;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  onSaveUrl,
}) => {
  const [url, setUrl] = useState(currentUrl);
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = GOOGLE_APPS_SCRIPT_CODE;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTest = async () => {
    if (!url.trim()) {
      setTestResult({ success: false, message: '배포된 웹 앱 URL을 먼저 입력해 주세요.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    const res = await testGoogleSheetConnection(url);
    setTestResult(res);
    setTesting(false);
  };

  const handleSave = () => {
    onSaveUrl(url.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-amber-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 px-6 py-4 flex items-center justify-between border-b border-amber-200">
          <div className="flex items-center gap-3">
            <GiraffeCharacter mood="celebrate" size="sm" />
            <div>
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                구글 스프레드시트 실시간 연동
                <span className="text-xs bg-amber-900 text-amber-100 px-2.5 py-0.5 rounded-full font-medium">
                  교사용
                </span>
              </h2>
              <p className="text-xs text-amber-950 font-medium">
                학생들이 쓴 비폭력대화 하루공책을 선생님 구글 시트에 실시간 자동 저장해요!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-500/20 text-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-stone-700">
          {/* Step Guide */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">1</span>
              3분 만에 구글 시트 연동하기 (쉬워요!)
            </h3>

            <div className="grid grid-cols-1 gap-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-amber-800 shrink-0">①</span>
                <div>
                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-amber-900 underline hover:text-amber-700"
                  >
                    sheets.new 클릭하여 새 구글 스프레드시트 열기
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-xs text-stone-500">
                    시트 이름은 예: <span className="font-medium text-stone-700">'2026 우리반 비폭력대화 하루공책'</span>으로 지어주세요.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-bold text-amber-800 shrink-0">②</span>
                <div>
                  <p className="font-semibold text-stone-800">
                    상단 메뉴에서 <span className="text-amber-800">[확장 프로그램]</span> → <span className="text-amber-800">[Apps Script]</span> 클릭
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-bold text-amber-800 shrink-0">③</span>
                <div>
                  <p className="font-semibold text-stone-800">
                    기존 내용을 지우고 아래의 <span className="text-amber-800">Code.gs 스크립트</span>를 붙여넣은 뒤 저장 (Ctrl+S)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-bold text-amber-800 shrink-0">④</span>
                <div>
                  <p className="font-semibold text-stone-800">
                    우측 상단 <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs">[배포]</span> → <span className="font-bold">[새 배포]</span> 클릭
                  </p>
                  <ul className="text-xs text-stone-600 mt-1 list-disc list-inside space-y-0.5 bg-white p-2.5 rounded-xl border border-amber-100">
                    <li>유형 선택(톱니바퀴): <span className="font-bold text-stone-800">웹 앱(Web app)</span></li>
                    <li>다음 사용자 권한으로 실행: <span className="font-bold text-stone-800">나 (내 계정)</span></li>
                    <li>
                      액세스 권한: <span className="font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">모든 사용자 (Anyone)</span>
                      <span className="text-stone-500 ml-1">← 학생들이 로그인 없이 제출하려면 필수예요!</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-bold text-amber-800 shrink-0">⑤</span>
                <div>
                  <p className="font-semibold text-stone-800">
                    배포 완료 후 나타난 <span className="text-amber-800">웹 앱 URL</span>을 복사하여 아래에 붙여넣기
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Code.gs Copy Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 flex items-center gap-1.5 text-xs">
                📜 Apps Script에 붙여넣을 완성 코드 (Code.gs)
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '복사 완료!' : 'Code.gs 코드 전체 복사'}
              </button>
            </div>

            <div className="relative">
              <pre className="p-3 bg-stone-900 text-amber-100 text-xs rounded-2xl overflow-x-auto max-h-36 font-mono border border-stone-700 leading-relaxed">
                {GOOGLE_APPS_SCRIPT_CODE}
              </pre>
            </div>
          </div>

          {/* URL Input and Test */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <label className="block font-bold text-stone-900 text-sm">
              🔗 배포된 구글 웹 앱 URL 입력:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm bg-stone-50 font-mono"
              />
              <button
                type="button"
                onClick={handleTest}
                disabled={testing}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 shrink-0"
              >
                {testing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                )}
                {testing ? '연동 테스트 중...' : '연동 테스트'}
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{testResult.success ? '연동 성공!' : '확인 필요'}</p>
                  <p>{testResult.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-stone-50 px-6 py-4 flex items-center justify-between border-t border-stone-200">
          <div className="text-xs text-stone-500 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            연동하지 않아도 이 브라우저에 안전하게 보관됩니다.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:bg-stone-200 rounded-xl text-xs font-semibold transition"
            >
              닫기
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              저장 및 적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
