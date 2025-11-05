# Firebase Cloud Functions 설정 가이드

## 📋 개요
이 문서는 DOCX, PPTX, XLSX 파일을 마크다운으로 변환하기 위한 Firebase Cloud Functions 설정 방법을 안내합니다.

## 🚀 1단계: Firebase CLI 설치

### macOS/Linux
```bash
npm install -g firebase-tools
```

### 설치 확인
```bash
firebase --version
```

## 🔐 2단계: Firebase 로그인

```bash
firebase login
```

브라우저가 열리면 Google 계정으로 로그인합니다.

## 🏗️ 3단계: Firebase 프로젝트 초기화

### 프로젝트 디렉토리로 이동
```bash
cd /Users/moon/Desktop/mark-it-down-converter
```

### Firebase 프로젝트 초기화
```bash
firebase init
```

다음 옵션을 선택합니다:

1. **"Which Firebase features do you want to set up?"**
   - `Functions: Configure a Cloud Functions directory and its files` 선택 (스페이스바)
   - `Storage: Configure a security rules file for Cloud Storage` 선택 (스페이스바)
   - Enter 키

2. **"Please select an option:"**
   - `Use an existing project` 선택
   - Enter 키

3. **"Select a default Firebase project for this directory:"**
   - `teaboarddocs` 선택
   - Enter 키

4. **"What language would you like to use to write Cloud Functions?"**
   - `JavaScript` 선택
   - Enter 키

5. **"Do you want to use ESLint to catch probable bugs and enforce style?"**
   - `Yes` 입력
   - Enter 키

6. **"Do you want to install dependencies with npm now?"**
   - `Yes` 입력
   - Enter 키

7. **"What file should be used for Storage Rules?"**
   - `storage.rules` (기본값) 그대로 Enter

## 📂 4단계: Cloud Functions 구조 설정

초기화가 완료되면 다음 디렉토리 구조가 생성됩니다:

```
mark-it-down-converter/
├── functions/
│   ├── node_modules/
│   ├── index.js          # Cloud Functions 엔트리 포인트
│   ├── package.json      # Functions 의존성
│   └── .eslintrc.js
├── .firebaserc           # Firebase 프로젝트 설정
├── firebase.json         # Firebase 설정 파일
└── storage.rules         # Storage 보안 규칙
```

## 📦 5단계: 필요한 패키지 설치

```bash
cd functions
npm install mammoth xlsx officegen
cd ..
```

### 패키지 설명
- **mammoth**: DOCX → Markdown 변환
- **xlsx**: XLSX → Markdown 변환
- **officegen**: PPTX 파싱용 (향후 사용)

## 📝 6단계: Cloud Functions 코드 작성

### functions/index.js 수정

[functions/index.js](./functions/index.js) 파일을 다음 내용으로 교체합니다:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mammoth = require('mammoth');
const XLSX = require('xlsx');

admin.initializeApp();

// DOCX 변환 함수
exports.convertDocx = functions.https.onCall(async (data, context) => {
  try {
    const { fileUrl } = data;

    // Storage에서 파일 다운로드
    const bucket = admin.storage().bucket();
    const file = bucket.file(fileUrl);
    const [buffer] = await file.download();

    // DOCX → Markdown 변환
    const result = await mammoth.convertToMarkdown({ buffer });

    // 임시 파일 삭제 (5분 후)
    setTimeout(async () => {
      await file.delete();
    }, 5 * 60 * 1000);

    return {
      success: true,
      markdown: result.value,
      messages: result.messages
    };
  } catch (error) {
    console.error('DOCX conversion error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// XLSX 변환 함수
exports.convertXlsx = functions.https.onCall(async (data, context) => {
  try {
    const { fileUrl } = data;

    // Storage에서 파일 다운로드
    const bucket = admin.storage().bucket();
    const file = bucket.file(fileUrl);
    const [buffer] = await file.download();

    // XLSX → Markdown 변환
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    let markdown = '';

    workbook.SheetNames.forEach((sheetName, index) => {
      markdown += `## Sheet ${index + 1}: ${sheetName}\n\n`;

      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      const rows = csv.split('\n');

      if (rows.length > 0) {
        // 헤더 행
        const headers = rows[0].split(',');
        markdown += '| ' + headers.join(' | ') + ' |\n';
        markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';

        // 데이터 행 (최대 100개)
        for (let i = 1; i < Math.min(rows.length, 101); i++) {
          markdown += '| ' + rows[i].split(',').join(' | ') + ' |\n';
        }

        if (rows.length > 101) {
          markdown += `\n*Note: Only first 100 rows shown. Total rows: ${rows.length - 1}*\n`;
        }
      }

      markdown += '\n\n';
    });

    // 임시 파일 삭제 (5분 후)
    setTimeout(async () => {
      await file.delete();
    }, 5 * 60 * 1000);

    return {
      success: true,
      markdown: markdown
    };
  } catch (error) {
    console.error('XLSX conversion error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// PPTX 변환 함수 (향후 구현)
exports.convertPptx = functions.https.onCall(async (data, context) => {
  try {
    const { fileUrl } = data;

    // 현재는 기본 정보만 반환
    return {
      success: true,
      markdown: '# PowerPoint Document\n\n*Note: PPTX full conversion is under development.*'
    };
  } catch (error) {
    console.error('PPTX conversion error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

### storage.rules 보안 규칙 설정

[storage.rules](./storage.rules) 파일을 다음 내용으로 교체합니다:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 임시 파일 업로드 허용 (10MB 제한)
    match /temp/{filename} {
      allow write: if request.resource.size < 10 * 1024 * 1024;
      allow read: if true;
      allow delete: if true;
    }
  }
}
```

## 🚀 7단계: Cloud Functions 배포

### 배포 실행
```bash
firebase deploy --only functions
```

배포가 완료되면 다음과 같은 URL이 표시됩니다:
```
✔  functions[convertDocx(us-central1)] Successful create operation.
Function URL: https://us-central1-teaboarddocs.cloudfunctions.net/convertDocx
✔  functions[convertXlsx(us-central1)] Successful create operation.
Function URL: https://us-central1-teaboarddocs.cloudfunctions.net/convertXlsx
✔  functions[convertPptx(us-central1)] Successful create operation.
Function URL: https://us-central1-teaboarddocs.cloudfunctions.net/convertPptx
```

### Storage 규칙 배포
```bash
firebase deploy --only storage
```

## 🔧 8단계: 프론트엔드 연동

### src/lib/firebase.ts 생성

```typescript
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const storage = getStorage(app);

// DOCX 변환 함수
export async function convertDocxToMarkdown(file: File): Promise<string> {
  // 1. Storage에 임시 업로드
  const storageRef = ref(storage, `temp/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const fileUrl = await getDownloadURL(storageRef);

  // 2. Cloud Function 호출
  const convertDocx = httpsCallable(functions, 'convertDocx');
  const result = await convertDocx({ fileUrl });

  return (result.data as { markdown: string }).markdown;
}

// XLSX 변환 함수
export async function convertXlsxToMarkdown(file: File): Promise<string> {
  const storageRef = ref(storage, `temp/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const fileUrl = await getDownloadURL(storageRef);

  const convertXlsx = httpsCallable(functions, 'convertXlsx');
  const result = await convertXlsx({ fileUrl });

  return (result.data as { markdown: string }).markdown;
}

// PPTX 변환 함수
export async function convertPptxToMarkdown(file: File): Promise<string> {
  const storageRef = ref(storage, `temp/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const fileUrl = await getDownloadURL(storageRef);

  const convertPptx = httpsCallable(functions, 'convertPptx');
  const result = await convertPptx({ fileUrl });

  return (result.data as { markdown: string }).markdown;
}
```

### src/lib/markitdown.ts 업데이트

```typescript
// 기존 코드에서 DOCX, PPTX, XLSX 부분을 Firebase 함수로 교체

import { convertDocxToMarkdown, convertXlsxToMarkdown, convertPptxToMarkdown } from './firebase';

async function convertFileToMarkdown(file: File, sourceType: FileType): Promise<string> {
  // ... 기존 코드 ...

  if (sourceType === 'docx') {
    return await convertDocxToMarkdown(file);
  } else if (sourceType === 'pptx') {
    return await convertPptxToMarkdown(file);
  } else if (sourceType === 'xlsx') {
    return await convertXlsxToMarkdown(file);
  }

  // ... 나머지 코드 ...
}
```

## ✅ 9단계: 테스트

### 로컬 테스트
```bash
npm run dev
```

1. http://localhost:3000 접속
2. DOCX, XLSX 파일 업로드 테스트
3. 브라우저 개발자 도구 콘솔에서 에러 확인

### Firebase 함수 로그 확인
```bash
firebase functions:log
```

## 📊 비용 모니터링

### Firebase 콘솔에서 확인
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. `teaboarddocs` 프로젝트 선택
3. **Usage and billing** → **Details & settings** 클릭
4. Cloud Functions 호출 횟수 및 실행 시간 확인

### 무료 티어 한도
- **Cloud Functions**: 2,000,000회 호출/월
- **Cloud Storage**: 5GB 저장공간
- **Network**: 5GB 다운로드/월

## 🐛 문제 해결

### "Function not found" 에러
```bash
# 함수 재배포
firebase deploy --only functions
```

### "Permission denied" 에러
```bash
# Storage 규칙 재배포
firebase deploy --only storage
```

### 로컬 에뮬레이터 실행
```bash
firebase emulators:start
```

## 📞 추가 도움

- Firebase 공식 문서: https://firebase.google.com/docs/functions
- Firebase CLI 참조: https://firebase.google.com/docs/cli
- Cloud Functions 가격: https://firebase.google.com/pricing

---

**마지막 업데이트**: 2025년 1월
**프로젝트**: Mark-it-Down Converter
**Firebase 프로젝트**: teaboarddocs
