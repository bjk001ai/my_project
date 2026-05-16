2026-5-16
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

2026-5-17
    # Notion 배우기