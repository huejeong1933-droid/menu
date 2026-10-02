# Brew & Bean - 스페셜티 커피 메뉴 & 원두 도감

스페셜티 커피 카페의 대표 음료 6종(아메리카노, 에스프레소, 카페라떼, 바닐라라떼, 크림라떼, 초코라떼)의 풍미 특징, 층별 레시피 구조, 그리고 추출에 사용된 원두(산지, 품종, 가공법, 로스팅 포인트, 추출 사양)를 인터랙티브하게 탐색할 수 있는 반응형 웹 애플리케이션입니다.

---

## 🛠 기술 스택

- **Frontend**: React 19, TypeScript
- **Bundler & Tooling**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons & Animation**: Lucide React, Motion
- **Deployment Target**: Vercel (Hobby Free Tier)

---

## 🚀 GitHub 업로드 및 Vercel 무료 배포 가이드

이 프로젝트는 Vite 기반의 정적 SPA(Single Page Application) 구조로 제작되어 있어 **Vercel 무료 티어(Hobby Tier)**에서 1분 만에 배포 및 무료 도메인(`*.vercel.app`)을 발급받을 수 있습니다.

### 1단계: GitHub에 코드 올리기

1. **GitHub 웹사이트 접속 및 새 저장소 생성**:
   - [GitHub.com](https://github.com) 로그인 후 우측 상단의 `+` 버튼 → **`New repository`** 클릭
   - `Repository name` 입력 (예: `brew-and-bean-coffee`)
   - `Public` 또는 `Private` 선택 후 **`Create repository`** 클릭

2. **로컬 터미널에서 코드 푸시**:
   프로젝트 루트 폴더에서 아래 명령어를 차례대로 입력합니다:

   ```bash
   # 1. Git 저장소 초기화 (이미 되어 있는 경우 생략)
   git init

   # 2. 모든 변경사항 스테이징
   git add .

   # 3. 커밋 생성
   git commit -m "feat: complete specialty coffee menu & bean guide app"

   # 4. 기본 브랜치를 main으로 설정
   git branch -M main

   # 5. 방금 생성한 GitHub 원격 저장소 주소 연결
   git remote add origin https://github.com/사용자아이디/저장소이름.git

   # 6. GitHub에 푸시
   git push -u origin main
   ```

---

### 2단계: Vercel 무료 배포 연동

1. **Vercel 접속 및 로그인**:
   - [vercel.com](https://vercel.com)에 접속하여 **GitHub 계정으로 로그인 (Continue with GitHub)**합니다.

2. **새 프로젝트 Import**:
   - Vercel 대시보드에서 **`Add New...`** → **`Project`** 클릭
   - 목록에서 방금 올린 GitHub 저장소(`brew-and-bean-coffee`) 옆의 **`Import`** 버튼 클릭

3. **배포 설정 확인 (자동 감지)**:
   - **Framework Preset**: `Vite` (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `dist` (기본값)
   - 별도의 환경 변수 설정 없이 바로 사용 가능합니다.

4. **배포 실행**:
   - 하단의 파란색 **`Deploy`** 버튼을 클릭합니다.
   - 약 30초~1분 뒤 빌드가 완료되면 폭죽 애니메이션과 함께 전 세계 어디서나 접속 가능한 **무료 라이브 URL**(예: `https://brew-and-bean-coffee.vercel.app`)이 즉시 제공됩니다!

---

### 3단계: 자동 배포(CI/CD) 혜택

- 이후 코드를 수정하고 `git push`를 할 때마다 Vercel이 변경사항을 자동으로 감지하여 **새로운 버전을 몇 초 만에 무중단 자동 재배포**해줍니다.

---

## 💻 로컬 개발 환경 실행

```bash
# 의존성 패키지 설치
npm install

# 로컬 개발 서버 실행 (포트 3000)
npm run dev

# 프로덕션 빌드 테스트
npm run build
```
