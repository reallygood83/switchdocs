# 교사용 AI 문서 작성 도구 - 프로젝트 명세서 (SPEC)

## 📋 프로젝트 개요

### 프로젝트 명
**TeacherDoc AI** - AI 기반 교사용 문서 작성 및 변환 도구

### 프로젝트 목적
교사들이 일상적으로 작성하는 다양한 문서(계획서, 보고서, 공문, 교육자료 등)를 AI의 도움을 받아 효율적으로 작성하고 관리할 수 있는 웹 기반 도구 개발

### 기존 프로그램 분석
**MarkItDown Converter**는 Microsoft의 MarkItDown 라이브러리를 기반으로 한 문서 변환 도구로:
- **주요 기능**: URL, PDF, Word, PowerPoint, Excel 등 다양한 형식을 Markdown으로 변환
- **AI 기능**: xAI Grok API를 활용한 콘텐츠 재구성, 요약, 핵심 포인트 추출, 번역, 정리
- **한국어 지원**: 한국어 콘텐츠 자동 감지 및 최적화된 AI 프롬프트 적용
- **기술 스택**: React 18, TypeScript, Tailwind CSS, Vite

### 변경 목표
1. **사용자 타겟 변경**: 일반 사용자 → **교사(선생님)** 특화
2. **AI 모델 교체**: xAI Grok → **Google Gemini 2.5-flash**
3. **BYOK 구현**: 사용자가 자신의 API 키를 가져와서 사용 (Bring Your Own Key)
4. **교육 특화 기능**: 교육 계획서, 보고서, 공문 등 교사 업무에 특화된 템플릿 및 기능 추가
5. **HWP 지원**: 한국 교사의 필수 파일 형식인 HWP(한글) 지원 (DOCX/PDF 경유 방식)

### 핵심 가치 제안
```
"HWP로 시작해서, HWP로 끝나는
 진짜 교사를 위한 AI 도구"
```

**시간 절약**: 주당 10시간 이상 절약 (문서 작성 시간 85-90% 단축)

---

## 🎯 핵심 기능 요구사항

### 0. HWP 파일 지원 전략 ⭐ **최우선 핵심 기능**

#### 문제점
한국 교육 현장에서는 **HWP(한글과컴퓨터)** 파일 형식이 표준입니다:
- 교육부/교육청 공문 → HWP 필수
- 학교 공문서 → HWP 양식
- 보고서 제출 → HWP 파일만 인정
- 계획서 작성 → HWP 템플릿 사용

그러나 웹 브라우저에서는 HWP를 직접 처리할 수 없습니다.

#### 해결 방안: 2단계 변환 전략

**방법 1: DOCX 경유 (서식 보존) - 권장**
```
HWP → DOCX → AI 처리 → DOCX → HWP
```
- 사용자가 한컴오피스에서 DOCX로 저장
- 웹앱에서 DOCX 처리 (mammoth.js)
- AI로 재작성
- DOCX로 다운로드
- 사용자가 다시 HWP로 저장

**방법 2: PDF 경유 (빠른 처리)**
```
HWP → PDF → AI 처리 → Markdown → HWP
```
- 사용자가 한컴오피스에서 PDF로 내보내기
- 웹앱에서 텍스트 추출 (PDF.js - 기존 기능)
- AI로 재작성
- Markdown 제공
- 사용자가 HWP에 복사/붙여넣기

#### 사용자 경험 설계
```typescript
// 파일 업로드 시 HWP 감지
if (file.extension === 'hwp') {
  // 가이드 모달 표시
  showHWPGuideModal({
    message: "HWP 파일은 직접 지원되지 않습니다",
    options: [
      {
        name: "DOCX로 변환 (서식 유지)",
        steps: [
          "한컴오피스에서 '다른 이름으로 저장'",
          "파일 형식에서 'DOCX' 선택",
          "저장된 DOCX 파일을 업로드"
        ],
        video: "/guides/hwp-to-docx.mp4"
      },
      {
        name: "PDF로 변환 (빠른 처리)",
        steps: [
          "한컴오피스에서 '내보내기' → 'PDF'",
          "저장된 PDF 파일을 업로드"
        ],
        video: "/guides/hwp-to-pdf.mp4"
      }
    ]
  });
}
```

#### 필요 라이브러리
```bash
# DOCX 처리
npm install mammoth
npm install docx file-saver

# PDF 처리 (이미 있음)
# pdfjs-dist (기존 사용 중)
```

#### 구현 우선순위
1. **Phase 1** (MVP): PDF 경유 방식 (기존 PDF.js 활용)
2. **Phase 2**: DOCX 경유 방식 추가 (mammoth.js + docx)
3. **Phase 3** (미래): 서버 기반 HWP 직접 처리 (Python hwp5 라이브러리)

> 📖 **상세 내용**: [TEACHER_SCENARIOS.md](./TEACHER_SCENARIOS.md) 참고

---

### 1. AI 모델 전환 (xAI → Google Gemini)

#### 변경 내용
- **현재**: xAI Grok API (`grok-4-fast` 모델)
- **변경 후**: Google Gemini 2.5-flash API

#### 구현 요구사항
```typescript
// 기존: src/lib/xai-client.ts
export class XAIClient {
  private apiKey: string;
  private model: string = 'grok-4-fast';
  // ...
}

// 변경: src/lib/gemini-client.ts
export class GeminiClient {
  private apiKey: string;
  private model: string = 'gemini-2.5-flash';
  // ...
}
```

#### API 엔드포인트 변경
- **xAI API Base**: `https://api.x.ai/v1`
- **Gemini API Base**: `https://generativelanguage.googleapis.com/v1beta`

#### API 요청 형식 변경
```typescript
// xAI 형식
{
  model: 'grok-4-fast',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt }
  ],
  temperature: 0.3,
  stream: true
}

// Gemini 형식
{
  contents: [{
    parts: [{ text: prompt }]
  }],
  systemInstruction: {
    parts: [{ text: systemPrompt }]
  },
  generationConfig: {
    temperature: 0.3
  }
}
```

### 2. BYOK (Bring Your Own Key) 구현

#### 기능 설명
- 사용자가 자신의 Google Gemini API 키를 입력하여 사용
- 브라우저 로컬 스토리지에 안전하게 저장
- API 키 검증 기능 제공

#### UI 컴포넌트
```typescript
// src/components/SettingsModal.tsx 수정
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// API 키 입력 필드
<Input
  type="password"
  placeholder="Google Gemini API 키를 입력하세요"
  value={apiKey}
  onChange={(e) => setApiKey(e.target.value)}
/>

// 검증 버튼
<Button onClick={validateApiKey}>
  API 키 검증
</Button>
```

#### 저장소 관리
```typescript
// src/lib/gemini-client.ts
export function getStoredApiKey(): string | null {
  return localStorage.getItem('gemini_api_key');
}

export function setStoredApiKey(apiKey: string): void {
  localStorage.setItem('gemini_api_key', apiKey);
}

export function clearStoredApiKey(): void {
  localStorage.removeItem('gemini_api_key');
}
```

#### API 키 가이드 제공
- Google AI Studio 링크: `https://aistudio.google.com/apikey`
- API 키 발급 방법 안내 문서
- 무료 할당량 안내 (분당 15 요청, 일일 1500 요청)

### 3. 교사 특화 기능

#### 3.1 교육 문서 템플릿

**계획서 템플릿**
- 교육과정 운영 계획서
- 수업 계획서 (주간/일일)
- 프로젝트 학습 계획서
- 평가 계획서

**보고서 템플릿**
- 학급 운영 보고서
- 학생 관찰 기록부
- 학부모 상담 기록
- 교육활동 결과 보고서

**공문 템플릭**
- 공문서 작성 (발신/수신)
- 협조 요청 공문
- 시행 공문
- 회신 공문

#### 3.2 AI 조직화 모드 변경

**기존 모드**
1. Restructure (재구성)
2. Summarize (요약)
3. Extract Key Points (핵심 포인트 추출)
4. Translate & Organize (번역 및 구조화)
5. Clean & Format (정리 및 형식화)

**교사용 추가/변경 모드**
1. **교육 계획서 작성**: 학습 목표, 활동, 평가 중심 구조화
2. **보고서 정리**: 관찰 내용을 체계적으로 정리 및 분석
3. **공문 작성**: 공식 문서 형식 준수 및 문체 교정
4. **학생 평가 기록**: 관찰 내용을 평가 기록으로 변환
5. **학부모 소통문**: 전문 용어를 쉬운 말로 변환
6. 요약 및 핵심 정리 (기존 유지)

#### 3.3 UI/UX 개선

**교사 친화적 인터페이스**
```typescript
// 메인 화면 레이아웃
<Header>
  <Title>TeacherDoc AI - 교사용 AI 문서 도구</Title>
  <Description>계획서, 보고서, 공문을 쉽고 빠르게 작성하세요</Description>
</Header>

<MainContent>
  <DocumentTypeSelector>
    <Option>�� 계획서</Option>
    <Option>📊 보고서</Option>
    <Option>📋 공문</Option>
    <Option>📚 교육자료</Option>
    <Option>💬 학부모 소통문</Option>
  </DocumentTypeSelector>

  <TemplateSelector>
    {/* 선택한 문서 타입에 따른 템플릿 표시 */}
  </TemplateSelector>
</MainContent>
```

**색상 및 테마**
- 기본 색상: 교육적이고 차분한 파랑-녹색 계열
- 버튼: 명확하고 큰 크기 (터치 친화적)
- 폰트: 가독성 높은 본고딕/나눔고딕

---

## 🏗️ 기술 아키텍처

### 프론트엔드
- **프레임워크**: React 18 with TypeScript
- **빌드 도구**: Vite
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: Custom components (shadcn-ui 스타일)
- **아이콘**: Lucide React
- **PDF 처리**: PDF.js

### AI 통합
- **AI 제공자**: Google Gemini API
- **모델**: gemini-2.5-flash
- **인증**: BYOK (Bring Your Own Key)
- **스트리밍**: 실시간 응답 스트리밍 지원

### 배포
- **호스팅**: Vercel
- **버전 관리**: GitHub
- **빌드**: 자동 CI/CD via Vercel

---

## 📁 파일 구조 변경

### 변경/추가 파일
```
src/
├── lib/
│   ├── gemini-client.ts          # NEW: Gemini API 클라이언트
│   ├── ai-config.ts               # MODIFIED: Gemini 설정
│   ├── content-organizer.ts       # MODIFIED: 교사용 프롬프트
│   └── teacher-templates.ts       # NEW: 교사용 템플릿
├── components/
│   ├── SettingsModal.tsx          # MODIFIED: Gemini API 설정
│   ├── AIOrganizationPanel.tsx    # MODIFIED: 교사용 모드
│   ├── TemplateSelector.tsx       # NEW: 템플릿 선택기
│   └── DocumentTypeSelector.tsx   # NEW: 문서 타입 선택기
├── types/
│   ├── gemini.ts                  # NEW: Gemini 타입 정의
│   └── teacher.ts                 # NEW: 교사용 타입 정의
└── App.tsx                        # MODIFIED: 교사용 UI
```

### 삭제 파일
```
src/
├── lib/
│   └── xai-client.ts              # DELETE: xAI 클라이언트
└── types/
    └── xai.ts                     # DELETE: xAI 타입
```

---

## 🔄 마이그레이션 가이드

### 1단계: Gemini Client 생성
```bash
# 새 파일 생성
touch src/lib/gemini-client.ts
touch src/types/gemini.ts
```

### 2단계: API 클라이언트 구현
```typescript
// src/lib/gemini-client.ts
export class GeminiClient {
  private apiKey: string;
  private model: string = 'gemini-2.5-flash';

  async generateText(prompt: string, systemPrompt: string): Promise<string> {
    // Gemini API 호출 로직
  }

  async streamText(
    prompt: string,
    systemPrompt: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    // Gemini 스트리밍 로직
  }
}
```

### 3단계: 컴포넌트 업데이트
```typescript
// src/components/SettingsModal.tsx
- import { XAIClient } from '../lib/xai-client';
+ import { GeminiClient } from '../lib/gemini-client';

// API 키 레이블 변경
- <Label>xAI API Key</Label>
+ <Label>Google Gemini API Key</Label>
```

### 4단계: 프롬프트 최적화
```typescript
// src/lib/content-organizer.ts
// 교사용 프롬프트 추가
export const TEACHER_PROMPTS = {
  lessonPlan: '학습 목표, 활동, 평가를 포함한 수업 계획서로 재구성...',
  report: '관찰 내용을 체계적으로 분석하고 정리...',
  officialDocument: '공문서 형식에 맞게 작성...',
  // ...
};
```

---

## 🧪 테스트 계획

### 단위 테스트
- [ ] Gemini API 클라이언트 테스트
- [ ] API 키 검증 테스트
- [ ] 스트리밍 기능 테스트
- [ ] 템플릿 선택 기능 테스트

### 통합 테스트
- [ ] 문서 변환 → AI 조직화 전체 플로우
- [ ] 교사용 템플릿 적용 테스트
- [ ] BYOK 기능 전체 플로우

### UI/UX 테스트
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)
- [ ] 브라우저 호환성 (Chrome, Safari, Firefox, Edge)
- [ ] 접근성 (WCAG 2.1 AA 준수)

---

## 📦 배포 계획

### GitHub 저장소 설정
```bash
# 저장소 초기화
git init
git add .
git commit -m "Initial commit: TeacherDoc AI v1.0"

# GitHub 원격 저장소 연결
git remote add origin https://github.com/[username]/teacherdoc-ai.git
git branch -M main
git push -u origin main
```

### Vercel 배포
1. **Vercel 프로젝트 생성**
   - Vercel 대시보드에서 "Import Project" 선택
   - GitHub 저장소 연결

2. **빌드 설정**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install"
   }
   ```

3. **환경 변수 설정**
   - 환경 변수 없음 (BYOK 사용)

4. **도메인 설정**
   - Vercel 제공 도메인: `teacherdoc-ai.vercel.app`
   - 커스텀 도메인 (선택사항)

---

## 🎨 브랜딩 및 UI 디자인

### 디자인 컨셉
**TEABOARD FORMS 스타일**: 블랙&화이트 미니멀 디자인
- 깔끔하고 전문적인 블랙&화이트 기반
- 직관적이고 명확한 인터페이스
- shadcn/ui 컴포넌트 활용
- 교사들이 쉽게 사용할 수 있는 단순한 구조

### 컬러 팔레트 (블랙&화이트 테마)
```css
:root {
  /* 메인 컬러 */
  --primary: #000000;        /* 순수 블랙 - 메인 액션 */
  --secondary: #ffffff;      /* 순수 화이트 - 배경 */

  /* 강조 컬러 */
  --accent-green: #10b981;   /* 녹색 - 성공, 활용 신청 */
  --accent-yellow: #fbbf24;  /* 노랑 - 경고, 개발자 연락 */
  --accent-red: #ef4444;     /* 빨강 - 에러, 베출의 달인 */

  /* 그레이스케일 */
  --gray-50: #f9fafb;        /* 매우 밝은 회색 - 배경 */
  --gray-100: #f3f4f6;       /* 밝은 회색 - 카드 배경 */
  --gray-200: #e5e7eb;       /* 연한 회색 - 테두리 */
  --gray-300: #d1d5db;       /* 회색 - 비활성 */
  --gray-600: #4b5563;       /* 진한 회색 - 보조 텍스트 */
  --gray-900: #111827;       /* 거의 블랙 - 메인 텍스트 */

  /* 기능별 색상 */
  --background: #ffffff;     /* 메인 배경 */
  --foreground: #000000;     /* 메인 텍스트 */
  --muted: #f3f4f6;          /* 뮤트 배경 */
  --muted-foreground: #6b7280; /* 뮤트 텍스트 */
  --border: #e5e7eb;         /* 테두리 */
  --input: #e5e7eb;          /* 입력 필드 테두리 */
  --ring: #000000;           /* 포커스 링 */
}
```

### 타이포그래피
```css
/* 폰트 패밀리 */
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* 크기 및 두께 */
--text-xs: 12px;           /* 작은 레이블 */
--text-sm: 14px;           /* 보조 텍스트 */
--text-base: 16px;         /* 기본 본문 */
--text-lg: 18px;           /* 큰 본문 */
--text-xl: 20px;           /* 소제목 */
--text-2xl: 24px;          /* 제목 */
--text-3xl: 30px;          /* 큰 제목 */
--text-4xl: 36px;          /* 메인 헤더 */

/* 두께 */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### UI 컴포넌트 스타일

#### 버튼 스타일
```tsx
// Primary (Black) 버튼
<Button className="bg-black text-white hover:bg-gray-800">
  퀴즈/설문 생성하기
</Button>

// Secondary (White) 버튼
<Button variant="outline" className="border-black text-black hover:bg-gray-50">
  대시보드
</Button>

// Accent (Green) 버튼
<Button className="bg-green-500 text-white hover:bg-green-600">
  활용 신청
</Button>

// Accent (Yellow) 버튼
<Button className="bg-yellow-400 text-black hover:bg-yellow-500">
  개발자 연락하기
</Button>

// Accent (Red) 버튼
<Button className="bg-red-500 text-white hover:bg-red-600">
  베출의 달인
</Button>
```

#### 카드 스타일
```tsx
<Card className="border-2 border-gray-200 hover:border-black transition-colors">
  <CardHeader>
    <CardTitle className="text-xl font-semibold">빠른 생성</CardTitle>
    <CardDescription className="text-gray-600">
      AI가 자동으로 퀴즈와 설문을 생성합니다
    </CardDescription>
  </CardHeader>
</Card>
```

### 아이콘 세트 (Lucide React)
```tsx
import {
  FileText,      // 📝 계획서
  BarChart3,     // 📊 보고서
  FileCheck,     // 📋 공문
  BookOpen,      // 📚 교육자료
  MessageSquare, // 💬 학부모 소통문
  Settings,      // ⚙️ 설정
  Sparkles,      // ✨ AI
  LayoutGrid,    // 🎯 대시보드
  Zap,           // ⚡ 빠른 생성
  Target,        // 🎯 정확한 분석
  PieChart       // 📈 즉시 배포
} from 'lucide-react';
```

### 레이아웃 구조
```tsx
// 메인 헤더
<header className="border-b border-gray-200 bg-white">
  <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    <h1 className="text-2xl font-bold">TEACHERDOC AI</h1>
    <nav className="flex gap-4">
      <Button variant="outline">대시보드</Button>
      <Button variant="outline">생성하기</Button>
      <Button className="bg-green-500">활용 신청</Button>
      <Button variant="ghost">검문정</Button>
    </nav>
  </div>
</header>

// 메인 컨텐츠
<main className="min-h-screen bg-gray-50">
  <section className="container mx-auto px-4 py-16 text-center">
    <h1 className="text-5xl font-bold mb-4">TEACHERDOC AI</h1>
    <p className="text-xl text-gray-600 mb-8">
      HWP로 시작해서, HWP로 끝나는 진짜 교사를 위한 AI 도구
    </p>
  </section>
</main>

// 푸터
<footer className="border-t border-gray-200 bg-white py-8">
  <div className="container mx-auto px-4 text-center text-sm text-gray-600">
    © 2025 Moon-Jung Kim. All rights reserved.
  </div>
</footer>
```

### 반응형 디자인
```css
/* 모바일 우선 */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### shadcn/ui 컴포넌트 사용
- Button, Card, Input, Select
- Dialog, Sheet, Tabs
- Toast, Alert
- Form, Label
- Separator, Badge

---

## 📚 사용자 가이드

### API 키 발급 방법
1. **Google AI Studio 접속**
   - URL: https://aistudio.google.com/apikey

2. **API 키 생성**
   - "Create API Key" 버튼 클릭
   - 프로젝트 선택 또는 새로 생성
   - API 키 복사

3. **TeacherDoc AI에 등록**
   - 설정(⚙️) 버튼 클릭
   - API 키 입력 후 "검증" 버튼 클릭
   - "저장" 버튼으로 완료

### 무료 할당량
- **분당**: 15 요청
- **일일**: 1,500 요청
- **월간**: 무제한 (무료 티어)

### 사용 예시

**계획서 작성**
1. "계획서" 선택
2. "수업 계획서" 템플릿 선택
3. 기본 내용 입력 또는 문서 업로드
4. "AI로 계획서 작성" 클릭
5. 생성된 계획서 검토 및 수정
6. 다운로드 또는 복사

**보고서 작성**
1. "보고서" 선택
2. "학생 관찰 기록" 템플릿 선택
3. 관찰 내용 입력
4. "AI로 보고서 작성" 클릭
5. 체계적으로 정리된 보고서 확인
6. 다운로드

---

## 🔒 보안 및 프라이버시

### API 키 보안
- 브라우저 로컬 스토리지에만 저장
- 서버로 전송되지 않음
- HTTPS 통신만 허용

### 데이터 프라이버시
- 모든 처리는 클라이언트 사이드에서 수행
- 서버에 데이터 저장하지 않음
- 사용자 문서는 Google Gemini API로만 전송
- Google의 프라이버시 정책 준수

### GDPR 준수
- 개인정보 수집 없음
- 쿠키 사용 최소화
- 사용자 동의 없이 데이터 전송 금지

---

## 📊 성공 지표 (KPI)

### 사용자 메트릭
- 월간 활성 사용자 (MAU): 목표 1,000명
- 일일 활성 사용자 (DAU): 목표 200명
- 사용자 유지율: 목표 60% (30일 기준)

### 기능 메트릭
- 문서 변환 성공률: 목표 95%
- AI 조직화 만족도: 목표 4.5/5.0
- 평균 처리 시간: 목표 10초 이내

### 비즈니스 메트릭
- GitHub Stars: 목표 100개
- Vercel 방문자: 목표 월 5,000명
- 추천율 (NPS): 목표 40 이상

---

## 🗺️ 로드맵

### Phase 1: MVP (1-2주)
- [x] 프로젝트 분석 및 SPEC 작성
- [ ] xAI → Gemini 마이그레이션
- [ ] BYOK 기능 구현
- [ ] 기본 교사용 템플릿 추가 (3종)
- [ ] GitHub 저장소 설정
- [ ] Vercel 배포

### Phase 2: 핵심 기능 (3-4주)
- [ ] 전체 교사용 템플릿 완성 (10종)
- [ ] UI/UX 개선 (교사 친화적)
- [ ] 사용자 가이드 작성
- [ ] 베타 테스트 시작

### Phase 3: 확장 (5-8주)
- [ ] 문서 내보내기 형식 다양화 (PDF, DOCX)
- [ ] 문서 이력 관리 기능
- [ ] 즐겨찾기 템플릿 기능
- [ ] 협업 기능 (공유 링크)

### Phase 4: 고급 기능 (9-12주)
- [ ] 맞춤형 템플릿 생성 기능
- [ ] 문서 일괄 처리 (Batch Processing)
- [ ] API 엔드포인트 제공
- [ ] 모바일 앱 개발 검토

---

## 📞 지원 및 문의

### 문서
- README.md: 기본 사용 가이드
- TEACHER_GUIDE.md: 교사용 상세 가이드
- API_MIGRATION.md: xAI → Gemini 마이그레이션 가이드

### 커뮤니티
- GitHub Issues: 버그 리포트 및 기능 요청
- GitHub Discussions: 일반 토론 및 질문

### 연락처
- GitHub: @[username]
- Email: [email]

---

## 📝 라이선스

MIT License - 교육 목적으로 자유롭게 사용 가능

---

## 🙏 감사의 말

이 프로젝트는 다음을 기반으로 개발되었습니다:
- **Microsoft MarkItDown**: 문서 변환 라이브러리
- **Google Gemini API**: AI 콘텐츠 생성
- **React & TypeScript**: 프론트엔드 프레임워크
- **Tailwind CSS**: UI 스타일링

---

**문서 버전**: 1.0
**최종 수정일**: 2025-01-XX
**작성자**: Claude & Moon
**상태**: 초안 (Draft)
