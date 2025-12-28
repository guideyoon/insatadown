# 외부 접근 설정 가이드

## 방법 1: ngrok 사용 (빠른 테스트)

### 사용 방법
1. 터미널에서 다음 명령어 실행:
   ```bash
   ngrok http 3000
   ```

2. 표시되는 `Forwarding` URL을 복사 (예: `https://xxxx-xx-xx-xxx.ngrok-free.app`)

3. 이 URL을 다른 사람에게 공유하면 외부에서 접근 가능합니다.

### 주의사항
- 무료 플랜은 세션이 2시간마다 종료됩니다
- URL이 매번 변경됩니다
- 개발 서버(`npm run dev`)가 실행 중이어야 합니다

---

## 방법 2: Vercel 배포 (영구적 솔루션)

### 1단계: Vercel 계정 생성
- https://vercel.com 에서 GitHub 계정으로 로그인

### 2단계: 프로젝트 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 배포
vercel

# 프로덕션 배포
vercel --prod
```

또는 Vercel 웹사이트에서:
1. "New Project" 클릭
2. GitHub 저장소 연결
3. 자동으로 배포됨

### 장점
- ✅ 무료 호스팅
- ✅ HTTPS 자동 적용
- ✅ 고정 URL (예: `your-app.vercel.app`)
- ✅ 자동 배포 (Git push 시)
- ✅ 전 세계 CDN

---

## 방법 3: Railway 배포

### 사용 방법
1. https://railway.app 에서 계정 생성
2. "New Project" → "Deploy from GitHub repo"
3. 저장소 선택 후 자동 배포

### 장점
- 무료 크레딧 제공
- 간단한 배포 과정
- 자동 HTTPS

---

## 방법 4: Render 배포

### 사용 방법
1. https://render.com 에서 계정 생성
2. "New Web Service" 선택
3. GitHub 저장소 연결
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`

### 장점
- 무료 플랜 제공
- 자동 배포
- HTTPS 지원

---

## 방법 5: 클라우드 서버 (VPS) 배포

### AWS, Google Cloud, Azure 등
1. 서버 인스턴스 생성
2. Node.js 설치
3. 프로젝트 클론 및 빌드
4. PM2로 프로세스 관리
5. Nginx로 리버스 프록시 설정

### 필요한 명령어
```bash
# 프로젝트 빌드
npm run build

# PM2로 실행
npm install -g pm2
pm2 start npm --name "instagram-downloader" -- start
pm2 save
pm2 startup
```

---

## 추천 순서
1. **테스트용**: ngrok (지금 바로 사용 가능)
2. **프로덕션**: Vercel (가장 간단하고 무료)
3. **커스터마이징 필요**: Railway 또는 Render
4. **완전한 제어**: VPS (AWS, GCP 등)

