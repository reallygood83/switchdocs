# 백엔드 구현 Spec: Word, PowerPoint, Excel 파일 변환

## 📋 개요

현재 프론트엔드에서 지원하지 못하는 바이너리 파일 형식(DOCX, PPTX, XLSX)의 마크다운 변환을 위한 백엔드 API 구현 가이드입니다.

### 지원 대상 파일 형식
- **DOCX** (Microsoft Word 문서)
- **PPTX** (Microsoft PowerPoint 프레젠테이션)
- **XLSX** (Microsoft Excel 스프레드시트)

---

## 🎯 구현 방식 비교

### 옵션 1: Firebase Cloud Functions (추천)
**장점:**
- 이미 Firebase를 활용 중이므로 통합이 쉬움
- 서버 관리 불필요 (Serverless)
- 자동 스케일링
- Firebase Storage와 연동 용이

**단점:**
- Cold start 지연 가능성
- 실행 시간 제한 (최대 9분)

### 옵션 2: Vercel Serverless Functions
**장점:**
- 프론트엔드와 동일 플랫폼에서 관리
- 빠른 배포 및 CI/CD 통합
- Edge Functions 지원

**단점:**
- 실행 시간 제한 (10초 - Hobby plan, 60초 - Pro plan)
- 메모리 제한 (1024MB)
- 대용량 파일 처리에 제한적

### 권장사항
**Firebase Cloud Functions 사용을 추천**합니다:
1. 사용자가 Firebase에 익숙함
2. 파일 변환은 시간이 걸릴 수 있어 Vercel의 시간 제한이 문제될 수 있음
3. Firebase Storage를 활용한 파일 업로드/다운로드 관리가 편리함

---

## 🏗️ 아키텍처 설계

### 전체 플로우
```
[클라이언트]
    ↓ 1. 파일 업로드
[Firebase Storage]
    ↓ 2. 업로드 완료 트리거
[Cloud Function]
    ↓ 3. 파일 다운로드 & 변환
    ↓ 4. 마크다운 생성
[Cloud Function]
    ↓ 5. 결과 반환
[클라이언트]
```

### API 엔드포인트 설계

#### 1. 파일 업로드 API
```
POST /api/upload
Content-Type: multipart/form-data

Request Body:
- file: File (DOCX/PPTX/XLSX)
- fileType: string ('docx' | 'pptx' | 'xlsx')

Response:
{
  "success": true,
  "fileId": "unique-file-id",
  "uploadUrl": "gs://bucket/path/to/file"
}
```

#### 2. 변환 실행 API
```
POST /api/convert
Content-Type: application/json

Request Body:
{
  "fileId": "unique-file-id",
  "fileType": "docx"
}

Response:
{
  "success": true,
  "markdown": "# 변환된 마크다운 내용...",
  "metadata": {
    "fileName": "document.docx",
    "fileSize": 12345,
    "pageCount": 10
  }
}
```

---

## 🔧 기술 스택 및 라이브러리

### Firebase Cloud Functions (Node.js)

#### 1. DOCX 변환
**라이브러리:** `mammoth`
```bash
npm install mammoth
```

**사용 예시:**
```javascript
const mammoth = require('mammoth');

async function convertDocxToMarkdown(buffer) {
  const result = await mammoth.convertToMarkdown(buffer);
  return result.value; // 마크다운 텍스트
}
```

**특징:**
- Microsoft Word 문서를 HTML/마크다운으로 변환
- 텍스트, 제목, 리스트, 표 지원
- 이미지는 base64 인코딩 또는 별도 저장 필요

#### 2. PPTX 변환
**라이브러리:** `pptx-to-json` 또는 `officegen`
```bash
npm install pptx-to-json
```

**사용 예시:**
```javascript
const pptxToJson = require('pptx-to-json');

async function convertPptxToMarkdown(filePath) {
  const data = await pptxToJson(filePath);

  let markdown = `# ${data.title}\n\n`;

  data.slides.forEach((slide, index) => {
    markdown += `## 슬라이드 ${index + 1}\n\n`;

    slide.content.forEach(item => {
      if (item.type === 'text') {
        markdown += `${item.value}\n\n`;
      }
    });
  });

  return markdown;
}
```

**특징:**
- 슬라이드별 텍스트 추출
- 제목, 본문, 노트 구분 가능
- 이미지는 별도 처리 필요

#### 3. XLSX 변환
**라이브러리:** `xlsx` (SheetJS)
```bash
npm install xlsx
```

**사용 예시:**
```javascript
const XLSX = require('xlsx');

async function convertXlsxToMarkdown(buffer) {
  const workbook = XLSX.read(buffer);
  let markdown = '';

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    markdown += `# ${sheetName}\n\n`;

    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // 마크다운 테이블 생성
    if (data.length > 0) {
      const headers = data[0];
      markdown += '| ' + headers.join(' | ') + ' |\n';
      markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';

      for (let i = 1; i < data.length; i++) {
        markdown += '| ' + data[i].join(' | ') + ' |\n';
      }
      markdown += '\n';
    }
  });

  return markdown;
}
```

**특징:**
- 여러 시트 지원
- 셀 데이터를 마크다운 테이블로 변환
- 수식 결과값 추출

---

## 📝 Firebase Cloud Functions 구현 예시

### 프로젝트 구조
```
functions/
├── package.json
├── index.js
├── converters/
│   ├── docx.js
│   ├── pptx.js
│   └── xlsx.js
└── utils/
    └── storage.js
```

### index.js (메인 Cloud Function)
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { convertDocx } = require('./converters/docx');
const { convertPptx } = require('./converters/pptx');
const { convertXlsx } = require('./converters/xlsx');

admin.initializeApp();

exports.convertFile = functions.https.onRequest(async (req, res) => {
  // CORS 설정
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  try {
    const { fileId, fileType } = req.body;

    // Firebase Storage에서 파일 다운로드
    const bucket = admin.storage().bucket();
    const file = bucket.file(`uploads/${fileId}`);
    const [buffer] = await file.download();

    let markdown;

    switch (fileType) {
      case 'docx':
        markdown = await convertDocx(buffer);
        break;
      case 'pptx':
        markdown = await convertPptx(buffer);
        break;
      case 'xlsx':
        markdown = await convertXlsx(buffer);
        break;
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }

    // 변환 완료 후 원본 파일 삭제 (선택사항)
    await file.delete();

    res.status(200).json({
      success: true,
      markdown: markdown,
      metadata: {
        fileType,
        convertedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

### converters/docx.js
```javascript
const mammoth = require('mammoth');

exports.convertDocx = async (buffer) => {
  try {
    const result = await mammoth.convertToMarkdown(buffer);

    if (result.messages.length > 0) {
      console.warn('Conversion warnings:', result.messages);
    }

    return result.value;
  } catch (error) {
    throw new Error(`DOCX conversion failed: ${error.message}`);
  }
};
```

### converters/xlsx.js
```javascript
const XLSX = require('xlsx');

exports.convertXlsx = async (buffer) => {
  try {
    const workbook = XLSX.read(buffer);
    let markdown = '';

    workbook.SheetNames.forEach((sheetName, index) => {
      const sheet = workbook.Sheets[sheetName];

      markdown += `${index > 0 ? '\n---\n\n' : ''}# ${sheetName}\n\n`;

      const data = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: ''
      });

      if (data.length === 0) {
        markdown += '*이 시트는 비어있습니다.*\n\n';
        return;
      }

      // 헤더 행
      const headers = data[0];
      markdown += '| ' + headers.join(' | ') + ' |\n';
      markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';

      // 데이터 행 (최대 100행)
      const maxRows = Math.min(data.length, 101);
      for (let i = 1; i < maxRows; i++) {
        const row = data[i];
        markdown += '| ' + row.join(' | ') + ' |\n';
      }

      if (data.length > 101) {
        markdown += `\n*참고: 처음 100개 행만 표시됩니다. 전체 ${data.length - 1}개 행*\n`;
      }

      markdown += '\n';
    });

    return markdown;
  } catch (error) {
    throw new Error(`XLSX conversion failed: ${error.message}`);
  }
};
```

### converters/pptx.js
```javascript
const pptxToJson = require('pptx-to-json');
const fs = require('fs');
const os = require('os');
const path = require('path');

exports.convertPptx = async (buffer) => {
  // PPTX는 파일 경로가 필요하므로 임시 파일 생성
  const tempPath = path.join(os.tmpdir(), `temp-${Date.now()}.pptx`);

  try {
    fs.writeFileSync(tempPath, buffer);

    const data = await pptxToJson(tempPath);
    let markdown = `# ${data.title || 'PowerPoint 프레젠테이션'}\n\n`;

    if (data.slides && data.slides.length > 0) {
      data.slides.forEach((slide, index) => {
        markdown += `## 슬라이드 ${index + 1}\n\n`;

        if (slide.title) {
          markdown += `### ${slide.title}\n\n`;
        }

        if (slide.content) {
          slide.content.forEach(item => {
            if (item.type === 'text') {
              markdown += `${item.value}\n\n`;
            } else if (item.type === 'list') {
              item.items.forEach(listItem => {
                markdown += `- ${listItem}\n`;
              });
              markdown += '\n';
            }
          });
        }

        markdown += '---\n\n';
      });
    }

    return markdown;
  } catch (error) {
    throw new Error(`PPTX conversion failed: ${error.message}`);
  } finally {
    // 임시 파일 삭제
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
};
```

---

## 🔐 보안 고려사항

### 1. 파일 크기 제한
```javascript
// Cloud Function에서
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

if (buffer.length > MAX_FILE_SIZE) {
  throw new Error('File size exceeds 10MB limit');
}
```

### 2. 파일 형식 검증
```javascript
const fileType = require('file-type');

async function validateFileType(buffer, expectedType) {
  const type = await fileType.fromBuffer(buffer);

  const validTypes = {
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };

  if (type.mime !== validTypes[expectedType]) {
    throw new Error('Invalid file type');
  }
}
```

### 3. 임시 파일 정리
```javascript
// 변환 후 자동 삭제
const cleanup = async (fileId) => {
  const bucket = admin.storage().bucket();
  await bucket.file(`uploads/${fileId}`).delete();
};
```

### 4. Rate Limiting
```javascript
// Firebase Security Rules 또는 Cloud Function 내에서
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5 // 최대 5회 요청
});
```

---

## 🚀 배포 방법

### Firebase Cloud Functions 배포

1. **Firebase CLI 설치**
```bash
npm install -g firebase-tools
```

2. **Firebase 로그인**
```bash
firebase login
```

3. **프로젝트 초기화**
```bash
firebase init functions
```

4. **의존성 설치**
```bash
cd functions
npm install mammoth xlsx pptx-to-json file-type
```

5. **배포**
```bash
firebase deploy --only functions
```

6. **환경 변수 설정** (필요한 경우)
```bash
firebase functions:config:set service.key="YOUR_KEY"
```

---

## 💰 비용 예상

### Firebase Cloud Functions 비용 (2024년 기준)

**무료 할당량:**
- 호출: 2,000,000회/월
- GB-초: 400,000 GB-초/월
- CPU-초: 200,000 GHz-초/월
- 아웃바운드 네트워킹: 5GB/월

**예상 비용 (유료 사용 시):**
- 메모리 512MB, 실행 시간 10초 기준
- 파일 1개 변환당 약 5GB-초 소비
- 월 1,000개 파일 변환 시: 약 $0.5~$1 정도

**Firebase Storage 비용:**
- 저장: $0.026/GB/월
- 다운로드: $0.12/GB
- 업로드: 무료

**결론:** 중소규모 사용에는 무료 할당량으로 충분하며, 대규모 사용 시에도 저렴한 비용

---

## 🔗 프론트엔드 통합

### API 호출 예시

#### 1. 파일 업로드
```typescript
// src/lib/api.ts
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileType', detectFileType(file.name));

  const response = await fetch('YOUR_FIREBASE_FUNCTION_URL/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data.fileId;
}
```

#### 2. 변환 요청
```typescript
export async function convertFile(fileId: string, fileType: FileType): Promise<string> {
  const response = await fetch('YOUR_FIREBASE_FUNCTION_URL/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fileId, fileType })
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.markdown;
}
```

#### 3. markitdown.ts 수정
```typescript
async function convertFileToMarkdown(file: File, sourceType: FileType): Promise<string> {
  if (sourceType === 'pdf') {
    return await convertPdfToMarkdown(file);
  } else if (sourceType === 'csv') {
    return await convertCsvToMarkdown(file);
  } else if (sourceType === 'json') {
    return await convertJsonToMarkdown(file);
  } else if (sourceType === 'xml') {
    return await convertXmlToMarkdown(file);
  }

  // DOCX, PPTX, XLSX는 백엔드로 전송
  else if (['docx', 'pptx', 'xlsx'].includes(sourceType)) {
    try {
      const fileId = await uploadFile(file);
      const markdown = await convertFile(fileId, sourceType);
      return markdown;
    } catch (error) {
      throw new Error(`백엔드 변환 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  throw new Error(`Unsupported file type: ${sourceType}`);
}
```

---

## 📊 테스트 계획

### 단위 테스트
```javascript
// functions/test/converters.test.js
const { convertDocx } = require('../converters/docx');
const fs = require('fs');

describe('DOCX Converter', () => {
  it('should convert simple DOCX to markdown', async () => {
    const buffer = fs.readFileSync('./test-files/simple.docx');
    const markdown = await convertDocx(buffer);

    expect(markdown).toContain('# ');
    expect(markdown.length).toBeGreaterThan(0);
  });

  it('should handle tables in DOCX', async () => {
    const buffer = fs.readFileSync('./test-files/with-table.docx');
    const markdown = await convertDocx(buffer);

    expect(markdown).toContain('|');
  });
});
```

### 통합 테스트
```javascript
describe('Full Conversion Flow', () => {
  it('should upload and convert DOCX file', async () => {
    // 1. 파일 업로드
    const file = fs.readFileSync('./test-files/test.docx');
    const fileId = await uploadToStorage(file);

    // 2. 변환 요청
    const result = await callConvertFunction(fileId, 'docx');

    // 3. 검증
    expect(result.success).toBe(true);
    expect(result.markdown).toBeDefined();
  });
});
```

---

## 🎯 개발 우선순위

### Phase 1: XLSX 지원 (가장 쉬움)
- 라이브러리가 안정적이고 사용이 간단함
- 변환 결과가 명확함 (테이블)
- 예상 개발 시간: 2-3일

### Phase 2: DOCX 지원 (중간)
- Mammoth 라이브러리 활용
- 텍스트, 제목, 리스트 변환
- 예상 개발 시간: 3-4일

### Phase 3: PPTX 지원 (가장 복잡)
- 슬라이드 구조 파싱 필요
- 레이아웃 정보 손실 가능성
- 예상 개발 시간: 4-5일

**총 예상 개발 기간: 2-3주**

---

## 📚 참고 자료

### 라이브러리 문서
- **Mammoth.js**: https://github.com/mwilliamson/mammoth.js
- **SheetJS (xlsx)**: https://docs.sheetjs.com
- **pptx-to-json**: https://github.com/ncihtan/pptx-to-json

### Firebase 문서
- **Cloud Functions**: https://firebase.google.com/docs/functions
- **Firebase Storage**: https://firebase.google.com/docs/storage

### 대안 라이브러리 (참고용)
- **docx-to-pdf**: Python 기반 (더 강력하지만 Node.js 환경에서 사용 어려움)
- **libreoffice-convert**: LibreOffice 기반 (서버에 LibreOffice 설치 필요)

---

## ✅ 체크리스트

### 개발 전 준비
- [ ] Firebase 프로젝트 생성
- [ ] Firebase CLI 설치
- [ ] Storage 버킷 설정
- [ ] 테스트용 샘플 파일 준비 (DOCX, PPTX, XLSX)

### 개발 단계
- [ ] Cloud Functions 프로젝트 초기화
- [ ] XLSX 변환 구현
- [ ] DOCX 변환 구현
- [ ] PPTX 변환 구현
- [ ] 에러 핸들링 추가
- [ ] 보안 검증 로직 추가

### 테스트 단계
- [ ] 단위 테스트 작성 및 실행
- [ ] 통합 테스트 실행
- [ ] 대용량 파일 테스트
- [ ] 다양한 형식의 파일 테스트

### 배포 및 통합
- [ ] Cloud Functions 배포
- [ ] 프론트엔드 API 통합
- [ ] CORS 설정 확인
- [ ] 프로덕션 환경 테스트

---

## 🆘 문제 해결 가이드

### 문제 1: "Memory limit exceeded"
**해결책:**
```javascript
// firebase.json
{
  "functions": {
    "memory": "1GB",
    "timeout": "60s"
  }
}
```

### 문제 2: PPTX 변환 시 이미지 누락
**해결책:**
- 이미지를 Firebase Storage에 별도 저장
- 마크다운에 이미지 URL 링크 포함

### 문제 3: 한글 인코딩 문제
**해결책:**
```javascript
const result = await mammoth.convertToMarkdown(buffer, {
  convertImage: mammoth.images.inline(function(element) {
    return element.read("base64").then(function(imageBuffer) {
      return {
        src: "data:" + element.contentType + ";base64," + imageBuffer
      };
    });
  })
});
```

---

## 📝 다음 단계

1. **Firebase 프로젝트 설정**: Firebase Console에서 새 프로젝트 생성 또는 기존 프로젝트 선택
2. **Cloud Functions 초기화**: `firebase init functions` 실행
3. **XLSX 변환부터 시작**: 가장 간단한 구현부터 시작
4. **점진적 기능 추가**: DOCX → PPTX 순서로 구현
5. **프론트엔드 통합**: API 호출 로직 추가

---

**작성일**: 2025년 1월
**작성자**: Claude (Anthropic)
**문서 버전**: 1.0
