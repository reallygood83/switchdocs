# 교사용 AI 문서 도구 - 사용 시나리오 및 HWP 지원 전략

## 📚 목차
1. [교사 업무 환경 분석](#교사-업무-환경-분석)
2. [주요 사용 시나리오](#주요-사용-시나리오)
3. [HWP 지원 전략](#hwp-지원-전략)
4. [워크플로우 설계](#워크플로우-설계)
5. [기술 구현 방안](#기술-구현-방안)

---

## 🏫 교사 업무 환경 분석

### 현실적인 문제점

#### 1. **HWP 중심의 업무 환경**
```
교육부/교육청 공문 → HWP 형식 (.hwp)
학교 공문서 → HWP 양식 필수
보고서 제출 → HWP 파일만 인정
계획서 작성 → HWP 템플릿 사용
```

#### 2. **문서 작성의 어려움**
- 공문서 형식 복잡함 (발신/수신 번호, 결재란 등)
- 보고서 분량 부담 (A4 5-10페이지 이상)
- 계획서 작성 시간 부족
- 반복적인 내용 작성 (학생 관찰 기록 등)

#### 3. **기존 AI 도구의 한계**
- ChatGPT/Claude → 복사/붙여넣기 불편
- HWP 직접 지원 부족
- 교육 용어/맥락 이해 부족
- 공문서 형식 미준수

### 교사가 원하는 이상적인 도구

```
1. HWP 파일을 직접 업로드하면
2. AI가 내용을 이해하고
3. 교육 맥락에 맞게 재작성하고
4. 다시 HWP로 다운로드할 수 있는 도구
```

---

## 🎯 주요 사용 시나리오

### 시나리오 1: 수업 계획서 작성 (가장 빈번)

#### 배경
**김선생님**은 매주 월요일마다 다음 주 수업 계획서를 작성해야 합니다.

#### 기존 방식 (불편함)
```
1. 빈 HWP 템플릿 열기 (30분)
2. 교육과정 문서 참고하며 작성
3. 학습 목표, 활동, 평가 내용 정리
4. 형식 맞추기 (표, 글머리 기호 등)
5. 검토 및 수정

총 소요 시간: 2-3시간
```

#### TeacherDoc AI 활용 (개선)
```
1. 이전 주 계획서 HWP 파일 업로드 ⬆️
2. "다음 주 계획서 작성" 모드 선택
3. 수정할 내용만 간단히 입력:
   "3학년 수학, 분수 단원, 피자 나누기 활동"
4. AI가 자동 생성 (30초) 🤖
5. 미리보기 확인 후 HWP 다운로드 ⬇️

총 소요 시간: 10-15분 (90% 시간 절약!)
```

#### 워크플로우 다이어그램
```
┌─────────────────┐
│ 이전 계획서.hwp │
│   (업로드)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AI 분석       │
│ - 기존 구조 파악│
│ - 교육과정 맥락 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 사용자 입력     │
│ "다음 주 주제"  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AI 생성         │
│ - 학습 목표     │
│ - 활동 구성     │
│ - 평가 계획     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  미리보기       │
│  (수정 가능)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 새 계획서.hwp   │
│   (다운로드)    │
└─────────────────┘
```

---

### 시나리오 2: 학생 관찰 기록 작성

#### 배경
**박선생님**은 25명 학생의 학기말 관찰 기록을 작성해야 합니다.

#### 문제점
- 학생당 200-300자 작성 필요
- 각 학생의 특성을 기억하고 문장으로 표현하기 어려움
- 유사한 표현이 반복됨

#### TeacherDoc AI 활용
```
1. 학생별 메모 정리 (키워드 중심)
   "김철수: 적극적, 발표 잘함, 수학 우수, 친구들과 협력적"

2. 메모를 텍스트 파일로 정리하여 업로드

3. "학생 관찰 기록 작성" 모드 선택

4. AI가 교육적 표현으로 문장 생성:
   "김철수 학생은 수업 시간에 적극적으로 참여하며,
   특히 수학 교과에서 뛰어난 이해력을 보입니다.
   발표 활동에 자신감 있게 임하며, 모둠 활동 시
   친구들과 협력하여 과제를 완수하는 모습이 인상적입니다."

5. 전체 학생 기록을 HWP 표 형식으로 다운로드
```

---

### 시나리오 3: 공문서 작성 (긴급)

#### 배경
**최선생님**은 갑자기 상급 기관에 보낼 공문을 작성해야 합니다.

#### 기존 방식의 어려움
- 공문 형식 기억 안남 (수신, 발신, 제목, 내용)
- 공식적인 문체 작성 어려움
- 결재란, 번호 등 형식 맞추기 복잡

#### TeacherDoc AI 활용
```
1. 빠른 메모로 내용 정리:
   "도서관 도서 추가 구입 요청,
   예산 300만원,
   학생 독서 활동 활성화 목적"

2. "공문서 작성" 모드 선택

3. 문서 종류 선택: "예산 요청 공문"

4. AI가 공문 형식에 맞게 생성:
   - 수신: ○○교육청 교육과장
   - 발신: ○○초등학교장
   - 제목: 도서관 도서 구입 예산 지원 요청
   - 내용: 공식 문체로 작성된 본문
   - 붙임: 필요 서류 목록

5. HWP 형식으로 다운로드 → 결재란만 추가하면 완성
```

---

### 시나리오 4: 기존 보고서 정리 및 요약

#### 배경
**이선생님**은 작년에 작성한 20페이지 보고서를 3페이지로 요약해야 합니다.

#### TeacherDoc AI 활용
```
1. 기존 보고서 HWP 파일 업로드

2. "보고서 요약" 모드 선택

3. 요약 옵션 설정:
   - 목표 분량: 3페이지 (A4)
   - 유지할 내용: 핵심 데이터, 결론
   - 삭제할 내용: 과정 설명, 부록

4. AI가 핵심만 추출하여 재구성

5. 요약된 HWP 파일 다운로드
```

---

### 시나리오 5: 학부모 소통문 작성

#### 배경
**정선생님**은 다음 주 현장학습 안내문을 학부모에게 보내야 합니다.

#### TeacherDoc AI 활용
```
1. 현장학습 계획서 HWP 업로드 (교육청 제출용 공식 문서)

2. "학부모 소통문 작성" 모드 선택

3. 자동 변환:
   - 전문 용어 → 쉬운 말로 변경
   - 형식적 문장 → 친근한 표현
   - 중요 안내사항 강조 (날짜, 준비물 등)
   - 불필요한 행정 내용 제거

4. 학부모가 읽기 쉬운 안내문 완성
```

---

## 📎 HWP 지원 전략

### 문제: 웹 브라우저에서 HWP 직접 처리 불가

HWP(한글과컴퓨터)는 독점 파일 형식으로, 공식 JavaScript 라이브러리가 없습니다.

### 해결 방안: 3단계 변환 전략

```
HWP → 중간 형식 → AI 처리 → 중간 형식 → HWP
```

#### 방안 1: HWP → DOCX → Markdown → AI → Markdown → DOCX → HWP

**장점**
- DOCX는 웹에서 처리 가능 (mammoth.js 라이브러리)
- DOCX ↔ HWP 변환은 한컴오피스에서 지원
- 사용자가 이미 한컴오피스 보유

**단점**
- 사용자가 수동으로 DOCX 변환 필요 (불편)
- 복잡한 HWP 서식 손실 가능

**구현**
```typescript
// 1단계: 사용자 가이드 제공
"HWP 파일을 DOCX로 저장 후 업로드해주세요"

// 2단계: DOCX 처리
import mammoth from 'mammoth';
const docxToMarkdown = await mammoth.convertToMarkdown(file);

// 3단계: AI 처리
const enhanced = await gemini.organize(markdown);

// 4단계: DOCX 생성
const docx = await markdownToDocx(enhanced);

// 5단계: 사용자 안내
"다운로드한 DOCX를 한컴오피스에서 HWP로 저장하세요"
```

#### 방안 2: HWP → PDF → Text → AI → Markdown → 사용자 HWP 완성

**장점**
- PDF 변환은 한컴오피스에서 쉽게 가능
- PDF 텍스트 추출은 브라우저에서 가능 (PDF.js)
- 기존 프로그램에 이미 PDF 처리 기능 있음

**단점**
- 서식 정보 완전 손실
- 최종 HWP는 사용자가 직접 작성

**구현**
```typescript
// 1단계: 사용자 가이드
"HWP 파일을 PDF로 저장 후 업로드해주세요"

// 2단계: PDF 텍스트 추출 (기존 기능 활용)
const text = await pdfToText(file);

// 3단계: AI 처리
const organized = await gemini.organize(text);

// 4단계: Markdown 제공
download('organized.md', organized);

// 5단계: 사용자 작업
"생성된 내용을 복사하여 HWP에 붙여넣으세요"
```

#### 방안 3: HWP 서버 변환 서비스 (미래 확장)

**장점**
- 완전 자동화 가능
- 서식 정보 보존

**단점**
- 백엔드 서버 필요 (비용 발생)
- 파일 업로드로 인한 보안/프라이버시 우려

**구현 (참고용)**
```typescript
// Python 백엔드 + hwp5 라이브러리 사용
import { uploadToServer } from './api';

// 1단계: HWP 업로드
const response = await uploadToServer(hwpFile);

// 2단계: 서버에서 변환
const markdown = response.markdown;

// 3단계: AI 처리
const enhanced = await gemini.organize(markdown);

// 4단계: 서버에서 HWP 생성
const hwpFile = await convertToHWP(enhanced);
```

### 권장 방안: **방안 1 (DOCX 경유) + 방안 2 (PDF 경유) 병행**

#### 이유
1. **DOCX 경유**: 서식 보존이 중요한 경우 (계획서, 공문)
2. **PDF 경유**: 빠른 내용 추출이 필요한 경우 (보고서 요약, 학생 기록)

#### 사용자 경험 최적화
```
┌─────────────────────────────────────┐
│    파일 업로드                      │
│                                     │
│  [ HWP 파일 선택 ]                 │
│                                     │
│  ⚠️ HWP 파일은 직접 지원되지 않습니다 │
│                                     │
│  📝 권장 방법 선택:                 │
│                                     │
│  ○ DOCX로 변환 (서식 유지)         │
│     1. 한컴오피스에서 "다른 이름으로│
│        저장" → DOCX 선택           │
│     2. DOCX 파일 업로드             │
│                                     │
│  ○ PDF로 변환 (빠른 처리)          │
│     1. 한컴오피스에서 "내보내기"   │
│        → PDF 선택                  │
│     2. PDF 파일 업로드              │
│                                     │
│  [ 변환 가이드 보기 (동영상) ]      │
└─────────────────────────────────────┘
```

---

## 🔄 워크플로우 설계

### 통합 워크플로우

```
                  ┌───────────┐
                  │ HWP 파일  │
                  │ (교사보유) │
                  └─────┬─────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────┐             ┌───────────────┐
│ DOCX 변환     │             │ PDF 변환      │
│ (서식 유지)   │             │ (빠른 처리)   │
└───────┬───────┘             └───────┬───────┘
        │                             │
        │                             │
        └──────────┬──────────────────┘
                   │
                   ▼
          ┌────────────────┐
          │ TeacherDoc AI  │
          │   (웹 앱)      │
          └────────┬───────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌───────────────┐     ┌───────────────┐
│ Markdown 변환 │     │ Text 추출     │
│ (DOCX 입력)   │     │ (PDF 입력)    │
└───────┬───────┘     └───────┬───────┘
        │                     │
        └──────────┬──────────┘
                   │
                   ▼
          ┌────────────────┐
          │  Gemini AI     │
          │  처리 (BYOK)   │
          └────────┬───────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌───────────────┐     ┌───────────────┐
│ DOCX 생성     │     │ Markdown 제공 │
│ (다운로드)    │     │ (복사/다운로드)│
└───────┬───────┘     └───────┬───────┘
        │                     │
        │ 사용자 작업          │ 사용자 작업
        ▼                     ▼
┌───────────────┐     ┌───────────────┐
│ HWP 저장      │     │ HWP 붙여넣기  │
│ (한컴오피스)  │     │ (한컴오피스)  │
└───────────────┘     └───────────────┘
```

---

## 🛠️ 기술 구현 방안

### 1. DOCX 처리 (mammoth.js)

#### 설치
```bash
npm install mammoth
npm install --save-dev @types/mammoth
```

#### 구현
```typescript
// src/lib/docx-converter.ts
import mammoth from 'mammoth';

export async function docxToMarkdown(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToMarkdown({ arrayBuffer });

  if (result.messages.length > 0) {
    console.warn('DOCX conversion warnings:', result.messages);
  }

  return result.value;
}

export async function docxToText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
```

### 2. Markdown → DOCX 변환

#### 옵션 1: docx 라이브러리 사용
```bash
npm install docx
npm install file-saver
```

```typescript
// src/lib/markdown-to-docx.ts
import { Document, Paragraph, TextRun, Packer } from 'docx';
import { saveAs } from 'file-saver';

export async function markdownToDocx(
  markdown: string,
  filename: string
): Promise<void> {
  // Markdown 파싱 (간단한 구현)
  const paragraphs = markdown.split('\n\n').map(text =>
    new Paragraph({
      children: [new TextRun(text)]
    })
  );

  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
```

#### 옵션 2: 외부 변환 서비스 (Pandoc API)
```typescript
// src/lib/pandoc-service.ts
export async function convertMarkdownToDocx(
  markdown: string
): Promise<Blob> {
  const response = await fetch('https://api.pandoc.org/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'markdown',
      to: 'docx',
      text: markdown
    })
  });

  return await response.blob();
}
```

### 3. PDF 처리 (기존 기능 활용)

```typescript
// src/lib/pdf-converter.ts (이미 존재)
import * as pdfjsLib from 'pdfjs-dist';

export async function pdfToText(file: File): Promise<string> {
  // 기존 구현 활용
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText;
}
```

### 4. 파일 타입 감지 및 자동 처리

```typescript
// src/lib/file-handler.ts
export async function processTeacherDocument(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'hwp':
      throw new Error('HWP_NEEDS_CONVERSION');

    case 'docx':
      return await docxToMarkdown(file);

    case 'pdf':
      return await pdfToText(file);

    case 'doc':
      throw new Error('LEGACY_DOC_NOT_SUPPORTED');

    default:
      throw new Error('UNSUPPORTED_FILE_TYPE');
  }
}
```

### 5. 사용자 가이드 컴포넌트

```typescript
// src/components/HWPGuideModal.tsx
export function HWPGuideModal({ isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>HWP 파일 사용 가이드</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="docx">
          <TabsList>
            <TabsTrigger value="docx">
              📝 DOCX 변환 (권장)
            </TabsTrigger>
            <TabsTrigger value="pdf">
              📄 PDF 변환 (빠름)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="docx">
            <div className="space-y-4">
              <h3 className="font-semibold">서식을 유지하려면 DOCX로 변환하세요</h3>

              <ol className="list-decimal list-inside space-y-2">
                <li>한컴오피스에서 HWP 파일 열기</li>
                <li>[파일] → [다른 이름으로 저장] 선택</li>
                <li>파일 형식에서 "DOCX (*.docx)" 선택</li>
                <li>저장된 DOCX 파일을 업로드</li>
              </ol>

              <video controls className="w-full rounded-lg">
                <source src="/guides/hwp-to-docx.mp4" />
              </video>
            </div>
          </TabsContent>

          <TabsContent value="pdf">
            <div className="space-y-4">
              <h3 className="font-semibold">빠르게 내용만 추출하려면 PDF로 변환하세요</h3>

              <ol className="list-decimal list-inside space-y-2">
                <li>한컴오피스에서 HWP 파일 열기</li>
                <li>[파일] → [내보내기] → [PDF] 선택</li>
                <li>저장된 PDF 파일을 업로드</li>
              </ol>

              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  PDF는 서식이 제거되고 텍스트만 추출됩니다.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 📊 사용성 비교

### AS-IS (현재 교사의 문서 작성)

| 작업 | 소요 시간 | 어려움 |
|------|----------|--------|
| 수업 계획서 | 2-3시간 | ⭐⭐⭐⭐⭐ |
| 학생 관찰 기록 (25명) | 4-5시간 | ⭐⭐⭐⭐ |
| 공문 작성 | 1-2시간 | ⭐⭐⭐⭐⭐ |
| 보고서 요약 | 1시간 | ⭐⭐⭐ |
| 학부모 소통문 | 30분 | ⭐⭐ |

### TO-BE (TeacherDoc AI 활용)

| 작업 | 소요 시간 | 시간 절감 | 어려움 |
|------|----------|----------|--------|
| 수업 계획서 | 10-15분 | 90% | ⭐ |
| 학생 관찰 기록 (25명) | 30-40분 | 85% | ⭐ |
| 공문 작성 | 10분 | 90% | ⭐ |
| 보고서 요약 | 5-10분 | 85% | ⭐ |
| 학부모 소통문 | 5분 | 85% | ⭐ |

---

## 🎯 핵심 가치 제안

### 교사에게

```
"매일 2시간씩 행정 업무에 쓰던 시간을
아이들을 위해 쓸 수 있습니다"
```

### 구체적 혜택
1. **시간 절약**: 주당 10시간 이상 절약
2. **품질 향상**: 전문적이고 체계적인 문서
3. **스트레스 감소**: 문서 형식 걱정 없음
4. **교육 집중**: 본연의 교육 활동에 전념

### 무료 사용 가능
- Gemini API 무료 할당량: 일 1,500 요청
- 일평균 20개 문서 처리 가능
- 개인 API 키로 프라이버시 보장

---

## 📱 모바일 사용 시나리오

### 급한 상황 대응

```
출퇴근 버스에서 → 스마트폰으로 접속
이전 보고서 PDF 업로드 → AI 요약 →
카카오톡으로 공유 → 학교 도착 후 HWP 완성
```

### 언제 어디서나
- 반응형 웹 디자인
- 모바일 최적화된 UI
- 터치 친화적 인터페이스

---

## 🔮 미래 확장 가능성

### Phase 2: 한컴오피스 연동 (희망사항)
```
TeacherDoc AI 한컴오피스 플러그인
→ HWP 파일 직접 처리
→ 변환 과정 생략
→ 완전 자동화
```

### Phase 3: 학교 시스템 연동
```
나이스(NEIS) 연동
→ 학생 정보 자동 입력
→ 생활기록부 자동 작성
→ 공문 자동 발송
```

---

## 💡 마케팅 메시지

### 캐치프레이즈
```
"HWP로 시작해서, HWP로 끝나는
 진짜 교사를 위한 AI 도구"
```

### 주요 메시지
1. **HWP 친화적**: "DOCX나 PDF로 쉽게 변환"
2. **교육 특화**: "교사 업무를 이해하는 AI"
3. **무료 사용**: "일 1,500건까지 무료"
4. **프라이버시**: "내 API 키로 안전하게"
5. **시간 절약**: "주당 10시간 이상 절약"

---

**문서 버전**: 1.0
**최종 수정일**: 2025-01-XX
**작성자**: Claude & Moon
**피드백**: 환영합니다!
