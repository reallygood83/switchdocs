# Vercel 환경변수 설정 가이드

## 📋 개요
이 문서는 Mark-it-Down Converter를 Vercel에 배포할 때 필요한 환경변수 설정 방법을 안내합니다.

## 🔐 보안 중요 사항
- ⚠️ 이 환경변수들은 **절대 GitHub에 커밋하지 마세요**
- ✅ `.env.local` 파일은 이미 `.gitignore`에 포함되어 있습니다
- ✅ Vercel 대시보드에서만 설정하면 됩니다

## 🚀 Vercel 환경변수 설정 방법

### 1. Vercel 대시보드 접속
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택 (mark-it-down-converter)
3. **Settings** 탭 클릭
4. 왼쪽 메뉴에서 **Environment Variables** 선택

### 2. 환경변수 입력

다음 7개의 환경변수를 **하나씩** 추가합니다:

#### Firebase API Key
- **Name**: `VITE_FIREBASE_API_KEY`
- **Value**: `your_firebase_api_key_here`
- **Environment**: Production, Preview, Development 모두 체크

#### Firebase Auth Domain
- **Name**: `VITE_FIREBASE_AUTH_DOMAIN`
- **Value**: `your-project.firebaseapp.com`
- **Environment**: Production, Preview, Development 모두 체크

#### Firebase Project ID
- **Name**: `VITE_FIREBASE_PROJECT_ID`
- **Value**: `your-project-id`
- **Environment**: Production, Preview, Development 모두 체크

#### Firebase Storage Bucket
- **Name**: `VITE_FIREBASE_STORAGE_BUCKET`
- **Value**: `your-project.firebasestorage.app`
- **Environment**: Production, Preview, Development 모두 체크

#### Firebase Messaging Sender ID
- **Name**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value**: `your_sender_id`
- **Environment**: Production, Preview, Development 모두 체크

#### Firebase App ID
- **Name**: `VITE_FIREBASE_APP_ID`
- **Value**: `your_app_id`
- **Environment**: Production, Preview, Development 모두 체크

#### Firebase Measurement ID
- **Name**: `VITE_FIREBASE_MEASUREMENT_ID`
- **Value**: `your_measurement_id`
- **Environment**: Production, Preview, Development 모두 체크

### 3. 환경변수 적용

환경변수를 모두 입력한 후:
1. **Save** 버튼 클릭
2. 프로젝트를 **Redeploy** 하여 환경변수 적용

## 📝 환경변수 전체 목록 (복사용)

⚠️ **중요**: 실제 값은 Firebase Console에서 확인하세요!

```
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 🔍 환경변수 확인 방법

### Vercel에서 확인
1. Vercel Dashboard → 프로젝트 → Settings → Environment Variables
2. 7개의 환경변수가 모두 표시되는지 확인

### 로컬에서 확인
```bash
# 로컬 개발 서버 실행
npm run dev

# 브라우저에서 열기
# http://localhost:3000

# 브라우저 콘솔에서 확인 (개발자 도구 F12)
console.log(import.meta.env.VITE_FIREBASE_API_KEY)
```

## ⚠️ 주의사항

### VITE_ 접두사
- `VITE_` 접두사가 붙은 환경변수만 **브라우저에서 접근 가능**합니다
- Firebase는 클라이언트 사이드에서 사용되므로 반드시 `VITE_` 접두사 필요
- 접두사 없이 입력하면 환경변수가 작동하지 않습니다

### Production vs Preview vs Development
- **Production**: 실제 배포 환경 (main 브랜치)
- **Preview**: PR 미리보기 환경
- **Development**: 로컬 개발 환경

→ 모든 환경에 동일한 값을 설정하는 것을 권장합니다

### 환경변수 변경 시
- 환경변수를 변경한 후에는 반드시 **Redeploy** 필요
- Git push만으로는 환경변수 변경이 반영되지 않습니다

## 🐛 문제 해결

### 환경변수가 undefined로 나올 때
1. 환경변수 이름이 정확한지 확인 (`VITE_` 접두사 포함)
2. Vercel에서 Redeploy 했는지 확인
3. 브라우저 캐시 삭제 후 재시도

### Firebase 연결이 안 될 때
1. 모든 7개 환경변수가 입력되었는지 확인
2. 값에 따옴표나 공백이 없는지 확인
3. Firebase 콘솔에서 프로젝트가 활성화되어 있는지 확인

## 📞 추가 도움

문제가 지속되면:
- Vercel 로그 확인: Dashboard → Deployments → 최신 배포 → Function Logs
- Firebase 콘솔 확인: [Firebase Console](https://console.firebase.google.com/)
- 브라우저 개발자 도구 Network 탭에서 Firebase API 호출 확인

---

**마지막 업데이트**: 2025년 1월
**프로젝트**: Mark-it-Down Converter
**Firebase 프로젝트**: teaboarddocs
