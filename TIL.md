## 2026-5-16
1. 클로드 설치 
    - https://claude.ai/redirect/claudedotcom.v1.db439d14-0a4c-4f77-a473-be2c72bc7ffc/api/desktop/win32/x64/setup/latest/redirect
2. Crome browser설치(클로드가 엣지에서는 안열림)
    - https://www.google.com/chrome/
3. VSCode 설치
    - https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-user
    - 
4. 한글설정
    - Ctrl + Shift + P 누르기
    - Configure Display Language 입력 후 Enter
    - ko (Korean) 선택
    - Restart 버튼
5. Git for Windows설치
    - https://git-scm.com/download/win 
    - git --version
6. VSCode Extensions에서 GitHub Pull Requests, GitLens, Git Graph 설치
7. Git user.name / user.email 설정
    PS D:\project\git\board\my_project> git config --global user.name "bjk001ai"
    PS D:\project\git\board\my_project> git config --global user.email "bjk001ai@gmail.com"
    PS D:\project\git\board\my_project> git config --global --list
    user.name=bjk001ai
    user.email=bjk001ai@gmail.com
8. Index.html 생성
9. GitHub Pages 활성화
    1단계: Branch 선택
    None 버튼 클릭 → main (또는 master) 선택
    2단계: 폴더 선택
    / (root) 선택 (index.html이 최상위 폴더에 있으면 root)
    3단계: Save 클릭 ✅
    잠시 후 (1~3분) 상단 https://bjk001ai.github.io/my_project/ 생성
10. GitHub 계정 2개 동시에 사용(SSH Key 2개 생성)
    # 1. .ssh 폴더 생성
    mkdir C:\Users\$env:USERNAME\.ssh
    # 첫 번째 계정 (개인용)
    ssh-keygen -t ed25519 -C "bongjk220@gmail.com" -f "C:\Users\$env:USERNAME\.ssh\id_ed25519_bongjk220"
    # 두 번째 계정 (회사/다른용)
    ssh-keygen -t ed25519 -C "bjk001ai@gmail.com" -f "C:\Users\$env:USERNAME\.ssh\id_ed25519_bjk001ai"
    # SSH Config 파일 설정
    code "C:\Users\봉대현\.ssh\config"
        # 계정 1 (개인)
        Host github-account1
        HostName ssh.github.com
        User git
        Port 443
        IdentityFile C:\Users\봉대현\.ssh\id_ed25519_bongjk220

        # 계정 2 (회사/다른용)
        Host github-account2
        HostName ssh.github.com
        User git
        Port 443
        IdentityFile C:\Users\봉대현\.ssh\id_ed25519_bjk001ai

    # 계정1 키복사 후 Setting
    - cat C:\Users\봉대현\.ssh\id_ed25519_bongjk220.pub
        - ssh-ed25519 AAAA... 로 시작하는 텍스트 전체 복사!
    - GitHub 로그인해서 Settings > SSH and GPG keys에서 New SSH key > 텍스트 붙여넣기
    - ssh -T git@github-account1 (Hi bongjk220! You've successfully authenticated 라고 나오면 성공)
    # 계정2 키복사 후 Setting
    - cat C:\Users\봉대현\.ssh\id_ed25519_bjk001ai.pub
        - ssh-ed25519 AAAA... 로 시작하는 텍스트 전체 복사!
    - GitHub 로그인해서 Settings > SSH and GPG keys에서 New SSH key > 텍스트 붙여넣기
    - ssh -T git@github-account2 (Hi bjk001ai! You've successfully authenticated 라고 나오면 성공)

    # 계정1 프로젝트 clone할 때
    git -c core.sshCommand="ssh -i ~/.ssh/id_ed25519_bongjk220 -p 443" clone git@ssh.github.com:bongjk220/fs.git
    # 계정2 프로젝트 clone할 때
    git -c core.sshCommand="ssh -i ~/.ssh/id_ed25519_bjk001ai -p 443" clone git@ssh.github.com:bjk001ai/my_project.git

    # 프로젝트안에서 계정 설정 
    PS D:\project\git> cd fs
    PS D:\project\git\fs> git config --local user.name "bongjk220"
    PS D:\project\git\fs> git config --local user.email "bongjk220@gmail.com" 

    # 기존 프로젝트는 remote URL 변경
    PS D:\project\git\fs> git remote -v
    PS D:\project\git\fs> git remote set-url origin ssh://git@ssh.github.com:443/bongjk220/fs.git
    PS D:\project\git\fs> git pull

    # 기존 프로젝트는 remote URL 변경
    PS D:\project\git\my_project> git remote -v
    PS D:\project\git\my_project> git remote set-url origin ssh://git@ssh.github.com:443/bjk001ai/my_project.git
    PS D:\project\git\my_project> git pull

## 2026-5-17
# Jekyll+ GitHub Pages 만들어보기
1. Ruby 설치
    - rubyinstaller.org/downloads 접속
    - Ruby+Devkit (With Devkit) 다운 (예: Ruby+Devkit 3.2.X (x64))
    - 설치 중 마지막에 ridk install 창이 뜨면 Enter 누르기
    - 설치 완료 후 터미널(cmd)에서 확인(ruby -v)
2. Jekyll 설치
    - gem install jekyll bundler
    - 설치 확인(jekyll -v)
3. 블로그 생성 & 로컬 실행
    # 블로그 폴더 생성
    jekyll new my-blog
    # 폴더로 이동
    cd my-blog
    # 로컬에서 미리보기
    bundle exec jekyll serve
    - 확인 (http://localhost:4000)
4. GitHub에 올리기
    - GitHub에서 새 Repository만들기
    - cd D:/project/git/my_project/my-blog
    - git init
    - git remote add origin https://github.com/bjk001ai/bjk001ai.github.io.git
    - git add .
    - git commit -m "첫 블로그 시작"
    - git push -u origin master
5. GitHub Repository 설정
    - github.com/bjk001ai/bjk001ai.github.io 접속
    - 상단 Settings 탭 클릭
    - 왼쪽 메뉴에서 Pages 클릭
    - Branch 를 master 로 선택 → Save
    - https://bjk001ai.github.io 확인
6. 블로그 수정
    - _config.yml를 수정해서 사용
    - _posts 폴더안에 _posts YYYY-MM-DD-제목.markdown 파일로 공부 유형별로 생성

## 2026-5-17
# Hugo + GitHub Pages 만들어보기
1. Hugo 설치
    - winget install Hugo.Hugo.Extended
    - hugo version
    - cd D:/project/git
    - hugo new site hugo-blog
2. PaperMod 테마 설치
    - cd hugo-blog
    - git init
    - git submodule add https://github.com/adityatelange/hugo-PaperMod themes/PaperMod
    - hugo.toml 열어서 수정
    - hugo server
    - http://localhost:1313
3. GitHub Actions 설정
    - GitHub에 새 Repository 만들기
    - hugo-blog/.github/workflows/deploy.yml 만들기
    - push 후 GitHub Repository → Settings → Pages 로 가서 Source: GitHub Actions 선택
4. 글작성
    - content/posts/ 폴더 아래 .md 로 생성
    - hugo.toml 첫화면에서 메뉴부분 추가

## 2026-5-18
# React + GitHub Pages 만들어보기
1. React 기초(무료 학습 ko.react.dev)
    - 컴포넌트 : 레고 블록처럼 UI를 조각으로 나누는 것
    - props : 컴포넌트에 데이터 전달하는 방법
    - useState : 버튼 클릭 등 상태 변화 관리
    - JSX : HTML처럼 생긴 React 문법
    - 유투브 공부 : "드림코딩 React"
2. Node.js 설치
    - nodejs.org 접속 > LTS > Node.js 24.15.0 다운받아서 설치(Windows Installer (.msi))
    - 버전확인(node -v)
    - npm권한 설정(powershell 을 관리자 권한으로)
        - Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
    - npm -v
3. Gatsby CLI 설치
    - npm install -g gatsby-cli
    - gatsby --version
4. Gatsby 블로그 생성
    - gatsby new gatsby-blog https://github.com/gatsbyjs/gatsby-starter-blog
    - cd gatsby-blog
    - gatsby develop
    - http://localhost:8000 확인
5. GitHub에 올리기
    - GitHub에 새 Repository 만들기(gatsby-blog)
    - Gatsby GitHub Pages 플러그인 설치
        - npm install gh-pages --save-dev
    - gatsby-config.js에 pathPrefix 추가
        - pathPrefix: `/gatsby-blog`,
    - package.json 에 배포 스크립트 추가
        - VSCode에서 package.json 열고 "scripts" 부분에 "deploy" 한 줄 추가
        - "deploy": "gatsby build --prefix-paths && gh-pages -d public -b gh-pages",
    - GitHub 연결 후 배포
        - git init
        - git remote add origin https://github.com/bjk001ai/gatsby-blog.git
        - git add .
        - git commit -m "Gatsby 블로그 시작"
        - git push -u origin main
        - npm run deploy
    - GitHub Pages 설정
        - Repository → Settings → Pages → Branch를 gh-pages 로 변경 → Save!
6. 접속확인 및 글 올리기
    - https://bjk001ai.github.io/gatsby-blog/
    - content/blog 아래 폴더 만든후 index.md 만든어서 작성
    - 로컬확인(gatsby develop 명령어 입력후 localhost:8000 확인)
    - 글 수정후 npm run deploy

## 2026-5-18
1. 훈련과정
    - 훈련명 : 심화_생성형 AI와 AWS 클라우드를 활용한 풀스택 & 자동화 실무 개발
    - 2026-04-06 ~ 2026-06-10 / 44일 /348시간
    - 수업시간 : 09:20~18:00
    - 주요 수업 스킬 : 파이썬, Github, AI활용, RPA, 배포(Lender, EC2)
2. URL
    - 로그인 : https://fs.free.nf/ (봉재근/5910)
    - 교육자료 : https://codingand.notion.site/348h-31c2620edc19803a92ebf32b25a3e921
    - 포트폴리오 : https://bongjk220.github.io/fs/
    - 파이썬 : 
    - semi 프로젝트 피그마 : https://www.figma.com/design/XvnmqAsFxyv0a343COhrU3/%EC%84%B8%EB%AF%B8-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=0-1&t=Sxk1ONKK6YseL9x6-0
    - final 프로젝트 피그마 : https://www.figma.com/design/IcdlOvKdCXGfgdci1n9H0V/%ED%8C%8C%EC%9D%B4%EB%84%90-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=12-3&p=f&t=opn7GtEYQl7KAPVF-0
3. 활용AI
    - 윈드서프 : https://windsurf.com/
    - 클로드 : https://claude.ai/
    - codex : https://openai.com/ko-KR/codex/
    - notion : https://www.notion.so/
    - Antigravity : https://antigravity.google/
    - cursor : https://cursor.com/ko
    - 마누스 : https://manus.im
    - 코파일럿 : https://github.com/copilot
    - 제미나이 : https://gemini.google.com
    - lovable : https://lovable.de
4. 주요 AI MD 파일 표준 및 종류
    - CLAUDE.md: 클로드(Claude) 코드 환경에서 실행 시 자동으로 읽히는 텍스트 파일로, 프로젝트 규칙이나 AI의 역할을 명시하여 근본적인 기억 상실 문제를 해결합니다.
    - AGENTS.md: AI 코딩 에이전트를 위해 설계된 오픈 포맷 표준입니다. 개발 환경 설치 명령어, 코딩 컨벤션, 테스트 방법 등을 포함합니다.
    - DESIGN.md: UI/UX 디자인 시스템의 규칙을 담은 문서입니다. AI가 이를 참고해 브랜드의 일관된 디자인을 유지하도록 돕습니다.
    - SKILL.md: AI가 특정 업무를 수행할 때 따라야 할 지식과 실행 절차를 담은 작업 지침서입니다.
5. 기타
    - 랜더 : render.com
    - EC2 : https://aws.amazon.com/ko/pm/ec2
    - Inpa : https://inpa.tistory.com/
    - RPA참조 : https://wikidocs.net/book/18237


# Notion 배우기