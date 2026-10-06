import { FeelingItem, NeedCategory, JournalEntry } from '../types/nvc';

// 비폭력대화(NVC) 느낌 단어 목록
export const FULFILLED_FEELINGS: FeelingItem[] = [
  { id: 'f_happy', label: '기쁜', category: 'fulfilled', icon: '😊' },
  { id: 'f_thankful', label: '감사한', category: 'fulfilled', icon: '🙏' },
  { id: 'f_proud', label: '뿌듯한 / 보람찬', category: 'fulfilled', icon: '🌟' },
  { id: 'f_excited', label: '신나는 / 설레는', category: 'fulfilled', icon: '🎉' },
  { id: 'f_peaceful', label: '평온한 / 편안한', category: 'fulfilled', icon: '🌿' },
  { id: 'f_relieved', label: '안도하는 / 다행인', category: 'fulfilled', icon: '😌' },
  { id: 'f_warm', label: '따뜻한 / 든든한', category: 'fulfilled', icon: '💛' },
  { id: 'f_confident', label: '자신감 넘치는', category: 'fulfilled', icon: '💪' },
  { id: 'f_touched', label: '감동받은', category: 'fulfilled', icon: '🥺' },
  { id: 'f_cheerful', label: '유쾌한 / 웃음 나는', category: 'fulfilled', icon: '😄' },
  { id: 'f_refreshed', label: '홀가분한 / 상쾌한', category: 'fulfilled', icon: '🍃' },
  { id: 'f_hopeful', label: '희망찬 / 기대되는', category: 'fulfilled', icon: '🌈' },
  { id: 'f_fond', label: '다정한 / 애정 어린', category: 'fulfilled', icon: '🥰' },
  { id: 'f_amazed', label: '신기한 / 흥미진진한', category: 'fulfilled', icon: '👀' },
];

export const UNFULFILLED_FEELINGS: FeelingItem[] = [
  { id: 'u_sad', label: '속상한 / 슬픈', category: 'unfulfilled', icon: '😢' },
  { id: 'u_hurt', label: '서운한 / 섭섭한', category: 'unfulfilled', icon: '🥺' },
  { id: 'u_angry', label: '화가 나는 / 답답한', category: 'unfulfilled', icon: '😠' },
  { id: 'u_anxious', label: '불안한 / 걱정되는', category: 'unfulfilled', icon: '😰' },
  { id: 'u_tired', label: '피곤한 / 지친', category: 'unfulfilled', icon: '😴' },
  { id: 'u_lonely', label: '외로운 / 소외된 느낌인', category: 'unfulfilled', icon: '🌧️' },
  { id: 'u_unfair', label: '억울한 / 분한', category: 'unfulfilled', icon: '😤' },
  { id: 'u_embarrassed', label: '부끄러운 / 당황스러운', category: 'unfulfilled', icon: '😳' },
  { id: 'u_scared', label: '무서운 / 두려운', category: 'unfulfilled', icon: '😨' },
  { id: 'u_bored', label: '지루한 / 따분한', category: 'unfulfilled', icon: '🥱' },
  { id: 'u_confused', label: '어리둥절한 / 혼란스러운', category: 'unfulfilled', icon: '😵' },
  { id: 'u_helpless', label: '막막한 / 무기력한', category: 'unfulfilled', icon: '🙍' },
  { id: 'u_regret', label: '후회되는 / 미안한', category: 'unfulfilled', icon: '😔' },
  { id: 'u_burdened', label: '부담스러운', category: 'unfulfilled', icon: '😓' },
];

// 비폭력대화(NVC) 욕구 카테고리 및 단어 목록
export const NEED_CATEGORIES: NeedCategory[] = [
  {
    categoryName: '연결과 우정',
    icon: '🤝',
    color: 'from-amber-400 to-orange-400',
    description: '친구들과 따뜻하게 어울리고 마음을 나누고 싶어요',
    items: ['우정', '마음 나누기', '배려', '이해받기', '소속감 (함께하기)', '따뜻함', '공감', '협력']
  },
  {
    categoryName: '존중과 인정',
    icon: '🏆',
    color: 'from-yellow-400 to-amber-500',
    description: '있는 그대로 존중받고 내 노력을 인정받고 싶어요',
    items: ['존중받기', '칭찬과 격려', '공정함 (차별 없음)', '내 의견 들어주기', '약속 지키기', '신뢰']
  },
  {
    categoryName: '쉼과 안전',
    icon: '🛌',
    color: 'from-emerald-400 to-teal-500',
    description: '몸과 마음이 편안하고 안전하게 쉬고 싶어요',
    items: ['충분한 휴식', '꿀잠/잠', '편안함', '안전한 환경', '건강', '서두르지 않는 여유']
  },
  {
    categoryName: '자율성과 선택',
    icon: '🕊️',
    color: 'from-sky-400 to-blue-500',
    description: '스스로 생각하고 결정할 수 있는 자유가 필요해요',
    items: ['스스로 결정하기', '자유', '나만의 시간과 공간', '개성 존중', '선택할 기회']
  },
  {
    categoryName: '재미와 배움',
    icon: '🎨',
    color: 'from-purple-400 to-pink-500',
    description: '새로운 것을 배우고 즐겁게 뛰어놀고 싶어요',
    items: ['신나는 놀이', '재미와 웃음', '호기심', '새로운 배움', '성취감', '도전']
  },
  {
    categoryName: '평화와 조화',
    icon: '🕊️',
    color: 'from-teal-400 to-cyan-500',
    description: '다툼 없이 사이좋고 마음이 차분해지길 바라요',
    items: ['마음의 평화', '사이좋게 지내기', '차분함', '조용한 시간', '질서와 안정']
  }
];

// 기린의 따뜻한 응원 문구 모음
export const GIRAFFE_CHEERS = [
  '“기린은 모든 동물 중 가장 큰 심장을 가지고 있대요. 오늘도 네 큰 마음으로 자신을 안아주렴!”',
  '“있는 그대로의 너의 느낌과 욕구는 언제나 소중하고 괜찮아.”',
  '“높은 목으로 멀리 넓게 바라보는 기린처럼, 우리 함께 마음을 들여다보자!”',
  '“속상했던 일도, 기뻤던 일도 정성스레 적어줘서 고마워요. 🦒💛”',
  '“네 마음속 목소리에 귀 기울인 오늘 하루는 정말 값진 하루였어!”',
  '“솔직하게 마음을 표현한 네가 오늘 가장 용기 있는 어린이야.”'
];

export const TEACHER_STICKERS = [
  { id: 'hug', label: '따뜻한 기린 포옹', icon: '🦒💛', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'heart', label: '마음 관찰 칭찬해', icon: '✨💖', color: 'bg-pink-100 text-pink-800 border-pink-300' },
  { id: 'brave', label: '솔직한 용기 최고!', icon: '🦁👑', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { id: 'cheer', label: '언제나 널 응원해', icon: '🍀🌱', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'peace', label: '평온한 쉼을 보낼게', icon: '☁️🕊️', color: 'bg-sky-100 text-sky-800 border-sky-300' },
];

// 친절한 초기 예시 데이터 (교사 대시보드 및 학생 모아보기에서 바로 확인할 수 있도록)
export const INITIAL_SAMPLE_ENTRIES: JournalEntry[] = [
  {
    id: 'sample-1',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    date: new Date().toISOString().split('T')[0],
    grade: '3',
    classNum: '5',
    studentNumber: '7',
    studentName: '이지우',
    observation: '점심시간에 피구를 할 때 친구들이 내게 공을 세 번이나 양보해주었다.',
    feelings: ['기쁜', '감사한', '따뜻한 / 든든한'],
    feelingType: 'fulfilled',
    needs: ['우정', '배려', '소속감 (함께하기)'],
    request: '내일은 내가 먼저 다른 친구에게 공을 넘겨주며 따뜻한 말을 건네고 싶다.',
    syncedToSheet: true,
    teacherComment: '지우의 따뜻한 배려심이 교실을 더욱 훈훈하게 만드네요! 멋진 다짐 응원해요 🦒✨',
    teacherCommentAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    teacherSticker: '따뜻한 기린 포옹'
  },
  {
    id: 'sample-2',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    date: new Date().toISOString().split('T')[0],
    grade: '3',
    classNum: '5',
    studentNumber: '14',
    studentName: '김민준',
    observation: '수학 모둠 활동 중에 내가 말하려는데 친구가 말을 끊고 자기 생각만 이야기했다.',
    feelings: ['속상한 / 슬픈', '서운한 / 섭섭한', '답답한'],
    feelingType: 'unfulfilled',
    needs: ['존중받기', '내 의견 들어주기', '마음 나누기'],
    request: '다음에는 차분하게 "내 이야기도 끝까지 들어주면 고맙겠어"라고 기린의 언어로 말해봐야겠다.',
    syncedToSheet: true,
    teacherComment: '민준이 마음이 많이 속상했겠구나. 그래도 기린의 언어로 말해보겠다는 다짐이 정말 대단해!',
    teacherCommentAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    teacherSticker: '솔직한 용기 최고!'
  },
  {
    id: 'sample-3',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    date: new Date().toISOString().split('T')[0],
    grade: '3',
    classNum: '5',
    studentNumber: '21',
    studentName: '박하은',
    observation: '미술 시간에 준비물을 안 가져왔는데 짝꿍이 자기 색연필 세트를 같이 쓰자고 빌려주었다.',
    feelings: ['감사한', '안도하는 / 다행인', '따뜻한 / 든든한'],
    feelingType: 'fulfilled',
    needs: ['배려', '우정', '안전한 환경'],
    request: '고마운 짝꿍에게 쉬는 시간에 맛있는 간식을 나눠주고 감사 인사를 전해야지.',
    syncedToSheet: true,
    teacherComment: '서로 돕는 모습이 참 아름답습니다. 고마움을 표현하는 하은이의 마음도 보석 같아요.',
    teacherCommentAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    teacherSticker: '마음 관찰 칭찬해'
  },
  {
    id: 'sample-4',
    timestamp: new Date(Date.now() - 3600000 * 26).toISOString(),
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    grade: '3',
    classNum: '5',
    studentNumber: '3',
    studentName: '강도윤',
    observation: '어제 늦게까지 학원 숙제를 하느라 5시간밖에 못 자서 1교시부터 졸음이 쏟아졌다.',
    feelings: ['피곤한 / 지친', '막막한 / 무기력한'],
    feelingType: 'unfulfilled',
    needs: ['충분한 휴식', '꿀잠/잠', '서두르지 않는 여유'],
    request: '오늘은 스마트폰을 일찍 끄고 밤 9시 30분에 꼭 일찍 자야겠다.',
    syncedToSheet: true,
    teacherComment: '도윤아, 정말 고생 많았어. 오늘은 푹 쉬고 건강 챙기자!',
    teacherCommentAt: new Date(Date.now() - 86400000 + 3600000 * 4).toISOString(),
    teacherSticker: '평온한 쉼을 보낼게'
  }
];

// 구글 앱스 스크립트 Code.gs 기본 템플릿 (양방향 실시간 동기화 지원)
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * [우리반 비폭력대화 하루공책] 구글 스프레드시트 실시간 동기화 스크립트
 * 
 * 📌 특징:
 * - 여러 기기(학생 스마트폰, 태블릿, 교사 컴퓨터) 간 실시간 취합 및 동기화 지원
 * - doGet: 시트에 누적된 학생 기록을 교사 대시보드로 실시간 전달
 * - doPost: 학생 일기 실시간 저장 및 교사 응원 코멘트/스티커 저장
 * 
 * 📌 설치 및 배포 방법:
 * 1. 구글 스프레드시트 생성 (예: '우리반 비폭력대화 하루공책')
 * 2. 상단 메뉴 [확장 프로그램] -> [Apps Script] 클릭
 * 3. 기존 코드를 모두 지우고 이 스크립트 전체를 복사하여 붙여넣기
 * 4. 상단 [저장 (Ctrl+S)] 클릭
 * 5. 우측 상단 파란색 [배포] -> [새 배포] 클릭
 * 6. 유형(톱니바퀴): '웹 앱(Web app)' 선택
 *    - 설명: '우리반 하루공책 v2'
 *    - 다음 사용자 권한으로 실행: '나(본인 계정)'
 *    - 액세스 권한이 있는 사용자: '모든 사용자(Anyone)'  <-- ⚠️ 반드시 '모든 사용자' 필수!
 * 7. [배포] 클릭 후 승인 절차를 거치고 생성된 '웹 앱 URL'을 복사
 * 8. 우리반 하루공책 교사 대시보드의 [구글 시트 연동 설정]에 붙여넣기!
 */

// 컬럼 헤더 정의
var HEADERS = [
  "제출일시",
  "기록일자",
  "학년",
  "반",
  "번호",
  "이름",
  "1단계: 관찰",
  "2단계: 느낌",
  "느낌 유형",
  "3단계: 욕구",
  "4단계: 부탁/다짐",
  "고유ID",
  "선생님 응원말씀",
  "선생님 칭찬스티커"
];

// 시트 초기화 및 헤더 생성
function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    var range = sheet.getRange(1, 1, 1, HEADERS.length);
    range.setBackground("#FEF3C7");
    range.setFontWeight("bold");
    range.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
}

// 1. GET 요청 처리: 시트에 저장된 모든 학생 기록을 교사 대시보드 / 다른 기기로 전달
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    ensureHeaders(sheet);
    
    var lastRow = sheet.getLastRow();
    var entries = [];
    
    if (lastRow > 1) {
      var data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
      
      for (var i = 0; i < data.length; i++) {
        var row = data[i];
        if (!row[5]) continue; // 이름이 없으면 건너뜀
        
        var rawFeelings = String(row[7] || "");
        var feelingsArr = rawFeelings ? rawFeelings.split(",").map(function(s) { return s.trim(); }) : [];
        
        var rawNeeds = String(row[9] || "");
        var needsArr = rawNeeds ? rawNeeds.split(",").map(function(s) { return s.trim(); }) : [];
        
        var entry = {
          id: String(row[11] || ("row-" + (i + 2))),
          timestamp: row[0] instanceof Date ? Utilities.formatDate(row[0], "Asia/Seoul", "yyyy-MM-dd'T'HH:mm:ssXXX") : String(row[0] || ""),
          date: row[1] instanceof Date ? Utilities.formatDate(row[1], "Asia/Seoul", "yyyy-MM-dd") : String(row[1] || ""),
          grade: String(row[2] || ""),
          classNum: String(row[3] || ""),
          studentNumber: String(row[4] || ""),
          studentName: String(row[5] || ""),
          observation: String(row[6] || ""),
          feelings: feelingsArr,
          feelingType: String(row[8] || "fulfilled"),
          needs: needsArr,
          request: String(row[10] || ""),
          teacherComment: String(row[12] || ""),
          teacherSticker: String(row[13] || ""),
          syncedToSheet: true
        };
        entries.push(entry);
      }
    }
    
    var result = {
      status: "success",
      count: entries.length,
      data: entries
    };
    
    var jsonString = JSON.stringify(result);
    
    // JSONP 지원 (학교 방화벽 등 우회용)
    if (e && e.parameter && e.parameter.callback) {
      return ContentService.createTextOutput(e.parameter.callback + "(" + jsonString + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService.createTextOutput(jsonString)
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    var errorResult = JSON.stringify({ status: "error", message: error.toString() });
    return ContentService.createTextOutput(errorResult).setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. POST 요청 처리: 학생 일기 제출 또는 교사 피드백 저장
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    ensureHeaders(sheet);
    
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }
    
    var action = data.action || "add_entry";
    
    // [동작 1] 교사 응원 코멘트 업데이트
    if (action === "update_comment") {
      var targetId = String(data.id || "");
      var lastRow = sheet.getLastRow();
      var updated = false;
      
      if (lastRow > 1 && targetId) {
        var idValues = sheet.getRange(2, 12, lastRow - 1, 1).getValues();
        for (var i = 0; i < idValues.length; i++) {
          if (String(idValues[i][0]) === targetId) {
            var rowIndex = i + 2;
            sheet.getRange(rowIndex, 13).setValue(data.teacherComment || "");
            sheet.getRange(rowIndex, 14).setValue(data.teacherSticker || "");
            updated = true;
            break;
          }
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        status: updated ? "success" : "not_found",
        message: updated ? "코멘트가 시트에 업데이트되었습니다." : "해당 ID를 찾지 못했습니다."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // [동작 2] 학생 새 일기 저장 (기본 동작)
    var feelingsStr = Array.isArray(data.feelings) ? data.feelings.join(", ") : String(data.feelings || "");
    var needsStr = Array.isArray(data.needs) ? data.needs.join(", ") : String(data.needs || "");
    
    var newRow = [
      data.timestamp || Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd'T'HH:mm:ssXXX"),
      data.date || Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd"),
      data.grade || "",
      data.classNum || "",
      data.studentNumber || "",
      data.studentName || "익명",
      data.observation || "",
      feelingsStr,
      data.feelingType || "",
      needsStr,
      data.request || "",
      data.id || ("entry-" + Date.now()),
      data.teacherComment || "",
      data.teacherSticker || ""
    ];
    
    sheet.appendRow(newRow);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "정상적으로 시트에 저장되었습니다.",
      student: data.studentName,
      id: data.id
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
`;
