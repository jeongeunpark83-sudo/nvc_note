import { JournalEntry, ClassStats } from '../types/nvc';
import { INITIAL_SAMPLE_ENTRIES } from '../data/nvcData';

const STORAGE_KEYS = {
  ENTRIES: 'nvc_journal_entries_v1',
  TEACHER_PASSWORD: 'nvc_teacher_password_v1',
  GOOGLE_SHEET_URL: 'nvc_google_sheet_url_v1',
  STUDENT_PROFILE: 'nvc_student_profile_v1',
  CLASS_SETTINGS: 'nvc_class_settings_v1',
};

// 기본 비밀번호
const DEFAULT_PASSWORD = '1234';

// 로컬 엔트리 불러오기
export function getEntries(): JournalEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (!data) {
      // 초기 기본 샘플 데이터 제공
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(INITIAL_SAMPLE_ENTRIES));
      return INITIAL_SAMPLE_ENTRIES;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('기록 불러오기 실패:', err);
    return INITIAL_SAMPLE_ENTRIES;
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
  localStorage.setItem(STORAGE_KEYS.TEACHER_PASSWORD, newPw.trim());
}

// 구글 시트 웹앱 URL 관리
export function getGoogleSheetUrl(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.GOOGLE_SHEET_URL) || '';
  } catch {
    return '';
  }
}

export function setGoogleSheetUrl(url: string): void {
  localStorage.setItem(STORAGE_KEYS.GOOGLE_SHEET_URL, url.trim());
}

// 학생 기본 정보 (기억하기)
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
      return JSON.parse(data);
    }
  } catch {}
  return { grade: '4', classNum: '2', studentNumber: '', studentName: '' };
}

export function saveStudentProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(profile));
  } catch {}
}

// 구글 스프레드시트 웹앱으로 전송 함수
export async function syncEntryToGoogleSheet(entry: JournalEntry, customUrl?: string): Promise<boolean> {
  const url = (customUrl || getGoogleSheetUrl()).trim();
  if (!url) return false;

  const payload = {
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
  };

  try {
    // Google Apps Script는 no-cors 모드로 전송해야 브라우저의 CORS 및 리다이렉트 정책을 통과합니다.
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
    const testEntry: JournalEntry = {
      id: 'test-' + Date.now(),
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      grade: '체크',
      classNum: '체크',
      studentNumber: '0',
      studentName: '연동테스트_기린',
      observation: '스프레드시트 연동 테스트를 진행했습니다.',
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
      message: '연동 신호가 성공적으로 전송되었습니다! 구글 스프레드시트에 새 행이 생겼는지 확인해 보세요.' 
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
    
    // 구글 시트 전송 시도
    let synced = false;
    const sheetUrl = getGoogleSheetUrl();
    if (sheetUrl) {
      synced = await syncEntryToGoogleSheet(entry, sheetUrl);
    }

    const updatedEntry: JournalEntry = {
      ...entry,
      syncedToSheet: synced,
    };

    // 최신 항목이 맨 앞으로
    const newList = [updatedEntry, ...list.filter(e => e.id !== entry.id)];
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(newList));

    // 학생 프로필 저장
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

// 항목 수정 (선생님 코멘트 또는 스티커 추가 등)
export function updateEntry(entry: JournalEntry): void {
  try {
    const list = getEntries();
    const index = list.findIndex(e => e.id === entry.id);
    if (index !== -1) {
      list[index] = entry;
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(list));
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
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(filtered));
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
