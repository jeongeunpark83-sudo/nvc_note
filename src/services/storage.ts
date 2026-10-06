import { JournalEntry, ClassStats } from '../types/nvc';
import { INITIAL_SAMPLE_ENTRIES } from '../data/nvcData';

const STORAGE_KEYS = {
  ENTRIES: 'nvc_journal_entries_v1',
  TEACHER_PASSWORD: 'nvc_teacher_password_v1',
  GOOGLE_SHEET_URL: 'nvc_google_sheet_url_v1',
  STUDENT_PROFILE: 'nvc_student_profile_v1',
  LAST_SYNC_TIME: 'nvc_last_sync_time_v1',
};

// 기본 비밀번호
const DEFAULT_PASSWORD = '1234';

// URL 파라미터에서 sheet 주소 자동 감지 및 등록 (학생들이 공유 링크로 들어왔을 때 자동 연동)
export function checkUrlParameters(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const sheetParam = params.get('sheet');
    if (sheetParam && sheetParam.startsWith('https://script.google.com/macros/s/')) {
      const decoded = decodeURIComponent(sheetParam);
      setGoogleSheetUrl(decoded);
      return decoded;
    }
  } catch (err) {
    console.warn('URL 파라미터 확인 중 오류:', err);
  }
  return null;
}

// 구글 시트 웹앱 URL 관리
export function getGoogleSheetUrl(): string {
  try {
    // 먼저 URL 쿼리스트링 확인
    const urlFromParam = checkUrlParameters();
    if (urlFromParam) return urlFromParam;
    return localStorage.getItem(STORAGE_KEYS.GOOGLE_SHEET_URL) || '';
  } catch {
    return '';
  }
}

export function setGoogleSheetUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GOOGLE_SHEET_URL, url.trim());
  } catch {}
}

// 학생 배포용 공유 링크 생성 (URL에 시트 주소가 자동 인코딩되어 학생 기기에서도 자동 연동됨)
export function getStudentShareUrl(customSheetUrl?: string): string {
  try {
    if (typeof window === 'undefined') return '';
    const sheet = (customSheetUrl || getGoogleSheetUrl()).trim();
    const baseUrl = window.location.origin + window.location.pathname;
    if (!sheet) return baseUrl;
    return `${baseUrl}?sheet=${encodeURIComponent(sheet)}`;
  } catch {
    return '';
  }
}

// 교사 비밀번호 관리
export function getTeacherPassword(): string {
  try {
    const pw = localStorage.getItem(STORAGE_KEYS.TEACHER_PASSWORD);
    return pw || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

export function setTeacherPassword(newPw: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHER_PASSWORD, newPw.trim());
  } catch {}
}

// 학생 프로필 정보
export interface StudentProfile {
  grade: string;
  classNum: string;
  studentNumber: string;
  studentName: string;
}

export function getSavedStudentProfile(): StudentProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
    if (data) {
      const parsed = JSON.parse(data);
      // 기존 기본값(4학년 2반)이었던 경우 새 기본값(3학년 5반)으로 자연스럽게 교체
      if (parsed.grade === '4' && parsed.classNum === '2') {
        return { ...parsed, grade: '3', classNum: '5' };
      }
      return parsed;
    }
  } catch {}
  return { grade: '3', classNum: '5', studentNumber: '', studentName: '' };
}

export function saveStudentProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(profile));
  } catch {}
}

// 로컬 엔트리 불러오기
export function getEntries(): JournalEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(INITIAL_SAMPLE_ENTRIES));
      return INITIAL_SAMPLE_ENTRIES;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('기록 불러오기 실패:', err);
    return INITIAL_SAMPLE_ENTRIES;
  }
}

// 로컬 엔트리 일괄 덮어쓰기/병합
export function saveLocalEntries(entries: JournalEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  } catch (err) {
    console.error('로컬 기록 저장 실패:', err);
  }
}

// 구글 스프레드시트에서 모든 학생 기록 가져오기 (교사 대시보드 및 멀티 기기 취합의 핵심!)
export async function fetchEntriesFromGoogleSheet(customUrl?: string): Promise<{
  success: boolean;
  data?: JournalEntry[];
  error?: string;
}> {
  const url = (customUrl || getGoogleSheetUrl()).trim();
  if (!url) {
    return { success: false, error: '구글 시트 웹 앱 URL이 설정되지 않았습니다.' };
  }

  // 1. 표준 fetch 시도
  try {
    // 캐시 방지를 위해 timestamp 추가
    const fetchUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json && json.status === 'success' && Array.isArray(json.data)) {
        // 시트 데이터 성공적으로 수신
        const remoteEntries: JournalEntry[] = json.data;
        
        // 원격 데이터가 있으면 로컬과 병합 (원격 우선, 로컬의 미동기화 항목 보존)
        if (remoteEntries.length > 0) {
          mergeRemoteEntries(remoteEntries);
        }
        
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, new Date().toISOString());
        return { success: true, data: getEntries() };
      }
    }
  } catch (fetchErr: any) {
    console.warn('표준 GET 요청 실패, JSONP 대체 시도:', fetchErr);
  }

  // 2. JSONP fallback (네트워크/방화벽 또는 리다이렉트 제한 시)
  try {
    const jsonpData = await fetchViaJSONP(url);
    if (jsonpData && jsonpData.status === 'success' && Array.isArray(jsonpData.data)) {
      const remoteEntries: JournalEntry[] = jsonpData.data;
      if (remoteEntries.length > 0) {
        mergeRemoteEntries(remoteEntries);
      }
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, new Date().toISOString());
      return { success: true, data: getEntries() };
    }
  } catch (jsonpErr: any) {
    console.warn('JSONP 요청도 실패:', jsonpErr);
  }

  return {
    success: false,
    error: '구글 시트에서 데이터를 불러오지 못했습니다. 배포 권한("모든 사용자")을 확인해 주세요.',
  };
}

// JSONP 헬퍼
function fetchViaJSONP(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const callbackName = 'gas_callback_' + Math.round(100000 * Math.random());
    const script = document.createElement('script');
    const separator = url.includes('?') ? '&' : '?';
    script.src = `${url}${separator}callback=${callbackName}&_t=${Date.now()}`;
    
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('JSONP 타임아웃'));
    }, 12000);

    const cleanup = () => {
      clearTimeout(timeout);
      if (script.parentNode) script.parentNode.removeChild(script);
      delete (window as any)[callbackName];
    };

    (window as any)[callbackName] = (data: any) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('JSONP 스크립트 로드 에러'));
    };

    document.head.appendChild(script);
  });
}

// 원격 데이터와 로컬 데이터 똑똑하게 병합
function mergeRemoteEntries(remoteEntries: JournalEntry[]): void {
  const localList = getEntries();
  const remoteMap = new Map<string, JournalEntry>();

  // 원격 항목 맵 구성 (ID 또는 날짜+이름+시간 기준)
  remoteEntries.forEach((r) => {
    const key = r.id || `${r.date}_${r.studentName}_${r.timestamp}`;
    remoteMap.set(key, r);
  });

  // 로컬 항목 중 아직 원격에 없는 것(방금 오프라인으로 쓴 것 등) 찾기
  const merged: JournalEntry[] = [...remoteEntries];
  
  localList.forEach((local) => {
    const key = local.id || `${local.date}_${local.studentName}_${local.timestamp}`;
    if (!remoteMap.has(key)) {
      // 원격에 없으면 로컬 전용 항목이므로 보존
      merged.push(local);
    }
  });

  // 최신 순 정렬
  merged.sort((a, b) => {
    const timeA = new Date(a.timestamp || a.date).getTime() || 0;
    const timeB = new Date(b.timestamp || b.date).getTime() || 0;
    return timeB - timeA;
  });

  saveLocalEntries(merged);
}

// 구글 스프레드시트 웹앱으로 학생 일기 전송
export async function syncEntryToGoogleSheet(entry: JournalEntry, customUrl?: string): Promise<boolean> {
  const url = (customUrl || getGoogleSheetUrl()).trim();
  if (!url) return false;

  const payload = {
    action: 'add_entry',
    id: entry.id,
    timestamp: entry.timestamp,
    date: entry.date,
    grade: entry.grade,
    classNum: entry.classNum,
    studentNumber: entry.studentNumber,
    studentName: entry.studentName,
    observation: entry.observation,
    feelings: entry.feelings,
    feelingType: entry.feelingType,
    needs: entry.needs,
    request: entry.request,
    teacherComment: entry.teacherComment || '',
    teacherSticker: entry.teacherSticker || '',
  };

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (err) {
    console.warn('구글 시트 전송 중 오류 발생:', err);
    return false;
  }
}

// 교사 코멘트 구글 시트에 업데이트 전송
export async function syncCommentToGoogleSheet(
  id: string,
  teacherComment: string,
  teacherSticker: string
): Promise<boolean> {
  const url = getGoogleSheetUrl().trim();
  if (!url) return false;

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'update_comment',
        id,
        teacherComment,
        teacherSticker,
      }),
    });
    return true;
  } catch (err) {
    console.warn('코멘트 시트 동기화 실패:', err);
    return false;
  }
}

// 구글 시트 연동 테스트
export async function testGoogleSheetConnection(url: string): Promise<{ success: boolean; message: string }> {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    return { success: false, message: '웹 앱 URL을 입력해 주세요.' };
  }

  if (!cleanUrl.startsWith('https://script.google.com/macros/s/')) {
    return { 
      success: false, 
      message: '올바른 Google Apps Script 웹 앱 URL이 아닙니다. (https://script.google.com/macros/s/... 형식)' 
    };
  }

  try {
    // 1. GET 테스트로 읽기 권한 확인
    const getRes = await fetch(cleanUrl + (cleanUrl.includes('?') ? '&' : '?') + '_test=1');
    if (getRes.ok) {
      const data = await getRes.json();
      if (data && data.status === 'success') {
        return {
          success: true,
          message: `구글 시트와 성공적으로 연결되었습니다! (시트에 현재 누적된 학생 기록: ${data.count || 0}건)`,
        };
      }
    }
  } catch (e) {
    // GET 에러 시 POST로 백업 테스트 시도
  }

  try {
    const testEntry: JournalEntry = {
      id: 'test-' + Date.now(),
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      grade: '체크',
      classNum: '체크',
      studentNumber: '0',
      studentName: '연동확인_기린',
      observation: '스프레드시트 실시간 연동 테스트를 진행했습니다.',
      feelings: ['설레는', '반가운'],
      feelingType: 'fulfilled',
      needs: ['연결과 우정', '신뢰'],
      request: '스프레드시트에 이 행이 잘 추가되었는지 확인해 보세요!',
      syncedToSheet: true,
    };

    await fetch(cleanUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(testEntry),
    });

    return { 
      success: true, 
      message: '연동 신호가 성공적으로 전송되었습니다! 스프레드시트에 새 행이 생겼는지 확인해 보세요.' 
    };
  } catch (err: any) {
    return { 
      success: false, 
      message: '연동 전송 중 오류가 발생했습니다: ' + (err.message || '네트워크 확인 필요') 
    };
  }
}

// 새 일기 저장
export async function saveEntry(entry: JournalEntry): Promise<{ success: boolean; synced: boolean }> {
  try {
    const list = getEntries();
    
    let synced = false;
    const sheetUrl = getGoogleSheetUrl();
    if (sheetUrl) {
      synced = await syncEntryToGoogleSheet(entry, sheetUrl);
    }

    const updatedEntry: JournalEntry = {
      ...entry,
      syncedToSheet: synced,
    };

    const newList = [updatedEntry, ...list.filter(e => e.id !== entry.id)];
    saveLocalEntries(newList);

    saveStudentProfile({
      grade: entry.grade,
      classNum: entry.classNum,
      studentNumber: entry.studentNumber,
      studentName: entry.studentName,
    });

    return { success: true, synced };
  } catch (err) {
    console.error('저장 실패:', err);
    return { success: false, synced: false };
  }
}

// 항목 수정
export function updateEntry(entry: JournalEntry): void {
  try {
    const list = getEntries();
    const index = list.findIndex(e => e.id === entry.id);
    if (index !== -1) {
      list[index] = entry;
      saveLocalEntries(list);
    }
    // 시트에도 업데이트 전송
    if (entry.teacherComment) {
      syncCommentToGoogleSheet(entry.id, entry.teacherComment, entry.teacherSticker || '');
    }
  } catch (err) {
    console.error('수정 실패:', err);
  }
}

// 항목 삭제
export function deleteEntry(id: string): void {
  try {
    const list = getEntries();
    const filtered = list.filter(e => e.id !== id);
    saveLocalEntries(filtered);
  } catch (err) {
    console.error('삭제 실패:', err);
  }
}

// 통계 계산 함수
export function computeClassStats(entries: JournalEntry[]): ClassStats {
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = entries.filter(e => e.date === today);
  
  const uniqueStudents = new Set(entries.map(e => `${e.grade}-${e.classNum}-${e.studentName}`)).size;
  
  let fulfilledCount = 0;
  let unfulfilledCount = 0;
  
  const feelingFreq: Record<string, { count: number; category: 'fulfilled' | 'unfulfilled' }> = {};
  const needsFreq: Record<string, number> = {};

  entries.forEach(e => {
    if (e.feelingType === 'fulfilled') fulfilledCount++;
    else if (e.feelingType === 'unfulfilled') unfulfilledCount++;
    else {
      fulfilledCount += 0.5;
      unfulfilledCount += 0.5;
    }

    (e.feelings || []).forEach(f => {
      const isUn = f.includes('속상') || f.includes('서운') || f.includes('화가') || f.includes('불안') || f.includes('피곤') || f.includes('외로') || f.includes('답답');
      const cat = isUn ? 'unfulfilled' : 'fulfilled';
      if (!feelingFreq[f]) {
        feelingFreq[f] = { count: 0, category: cat };
      }
      feelingFreq[f].count++;
    });

    (e.needs || []).forEach(n => {
      needsFreq[n] = (needsFreq[n] || 0) + 1;
    });
  });

  const topFeelings = Object.entries(feelingFreq)
    .map(([word, val]) => ({ word, count: val.count, category: val.category }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const topNeeds = Object.entries(needsFreq)
    .map(([word, count]) => ({ word, count, categoryName: '' }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    totalEntries: entries.length,
    todayCount: todayEntries.length,
    studentCount: uniqueStudents,
    fulfilledCount: Math.round(fulfilledCount),
    unfulfilledCount: Math.round(unfulfilledCount),
    topFeelings,
    topNeeds,
  };
}
