# 🚀 GitHub 연동 및 Vercel 풀스택 배포 가이드

본 프로젝트는 오프라인 작동용 로컬 구성 뿐만 아니라, **GitHub에 동기화하여 Vercel(버셀)에 즉시 무료 배포하기 위한 모든 구성**(`vercel.json` 및 `/api` 서버리스 핸들러)이 기완비되어 있습니다.

아래 가이드에 맞춰 깃허브 리포지토리에 올리고 원격 서비스를 출시해 보세요!

---

## 📌 1단계: GitHub에 소스코드 동기화하기

AI Studio 우측 상단의 관리/설정 메뉴를 이용하면 클릭 몇 번으로 GitHub에 편리하게 동기화가 가능합니다. 또는 로컬 터미널에서 작업하는 다음과 같은 방법 중 선택할 수 있습니다.

### 방법 A: AI Studio 설정에서 GitHub 연동하기 (가장 권장)
1. 화면 우측 상단의 **톱니바퀴 아이콘(Settings)** 또는 **Export** 메뉴를 찾습니다.
2. **Export to GitHub** 버튼을 선택합니다.
3. GitHub 계정을 연동(Authorize)한 후 신규 리포지토리(Repository) 이름을 정해 전송하면, 소스코드가 자동으로 푸시됩니다!

### 방법 B: ZIP 내보내기 후 직접 GitHub 업로드
1. **GitHub 홈페이지**([github.com](https://github.com))에서 새 리포지토리를 생성합니다 (`Create a new repository`).
2. AI Studio 설정에서 **Export as ZIP**을 눌러 완성본 압축 파일을 내려받습니다.
3. 압축을 풀고 해당 리포지토리에 푸쉬 또는 업로드를 완료합니다.

---

## 📌 2단계: Vercel(버셀)에 무료 배포하기

1. **Vercel 홈페이지**([vercel.com](https://vercel.com))에 가입한 후 로그인합니다. *(소셜 로그인 연결 시, 소스 코드가 들어있는 GitHub 계정으로 가입하는 것이 가장 편리합니다.)*
2. 대시보드 우측 상단에서 **`Add New...`** -> **`Project`**를 누릅니다.
3. 연동된 GitHub 목록에서 방금 생성하고 푸쉬한 이 **프로젝트 리포지토리를 선택**하고 **`Import`** 버튼을 누릅니다.
4. **Vercel 프로젝트 구성 설정**:
   - **Framework Preset**: 자동으로 `Vite`가 감지됩니다. (Vite 그대로 두시면 됩니다.)
   - **Root Directory**: `./` (기본값)
   - **Build & Development Settings**: 기본값 그대로 둡니다. (내장된 `vercel.json`이 빌드 세팅을 제어하므로 건드릴 필요가 없습니다!)
5. 🔑 **[중요] 환경 변수 입력 (Environment Variables)**:
   - 전개 목록 하단에 있는 **`Environment Variables`** 섹션을 확장합니다.
   - **Name**: `GEMINI_API_KEY`
   - **Value**: 발급받으신 실제 구글 제미나이 API 키 값을 붙여 넣습니다.
   - 우측 단에 있는 **`Add`** 버튼을 눌러 목록에 추가합니다.
6. 하단의 🔵 **`Deploy`** 버튼을 힘차게 누르고 1~2분 정도 대기합니다.

---

## 🎉 배포 완료!

빌드가 성공하면 우주선 애니메이션과 함께 **고유 퍼블릭 도메인 주소(예: `https://my-app.vercel.app`)**가 무상으로 부여됩니다!
- 사용자는 해당 주소를 이용해 모바일/태블릿 등 실생활 기기에서 즉시 해당 백워드 설계 시뮬레이터를 가동하게 됩니다.
- 추후 깃허브에 코드를 업데이트(Git Push)할 때마다, Vercel이 눈치껏 **100% 자동 무중단 재배포**를 진행합니다.
