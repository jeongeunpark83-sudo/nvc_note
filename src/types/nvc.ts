export interface JournalEntry {
  id: string;
  timestamp: string; // ISO date string
  date: string; // YYYY-MM-DD
  grade: string; // 학년 (예: "4")
  classNum: string; // 반 (예: "2")
  studentNumber: string; // 번호 (예: "7")
  studentName: string; // 이름 (예: "김민우")
  observation: string; // 1단계: 관찰 (있는 그대로 본 것)
  feelings: string[]; // 2단계: 느낌 (감정 단어들)
  feelingType: 'fulfilled' | 'unfulfilled' | 'both'; // 충족/미충족 여부
  needs: string[]; // 3단계: 욕구 (소중한 가치/원하는 것)
  request: string; // 4단계: 부탁이나 다짐
  syncedToSheet?: boolean; // 구글 시트 전송 여부
  teacherComment?: string; // 선생님 격려 말씀
  teacherCommentAt?: string;
  teacherSticker?: string; // 선생님 칭찬 스티커
}

export interface FeelingItem {
  id: string;
  label: string;
  category: 'fulfilled' | 'unfulfilled';
  icon?: string;
  description?: string;
}

export interface NeedCategory {
  categoryName: string;
  icon: string;
  color: string;
  description: string;
  items: string[];
}

export interface ClassStats {
  totalEntries: number;
  todayCount: number;
  studentCount: number;
  fulfilledCount: number;
  unfulfilledCount: number;
  topFeelings: { word: string; count: number; category: 'fulfilled' | 'unfulfilled' }[];
  topNeeds: { word: string; count: number; categoryName: string }[];
}
