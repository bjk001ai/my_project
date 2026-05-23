const fs = require('fs');
const path = require('path');

const HUGO_POSTS_DIR = 'd:/workspaces/hugo-blog/content/posts';
const MY_PROJECT_DIR = 'd:/workspaces/my_project';
const POSTS_JSON_PATH = path.join(MY_PROJECT_DIR, 'posts.json');
const TARGET_POSTS_DIR = path.join(MY_PROJECT_DIR, 'posts');

if (!fs.existsSync(TARGET_POSTS_DIR)) {
  fs.mkdirSync(TARGET_POSTS_DIR, { recursive: true });
}

// 20년 차 테크 리드 기준의 프리미엄 카테고리 & 디자인 매핑 딕셔너리
const CATEGORY_MAP = {
  "life": { "id": "life", "name": "일상", "icon": "ti-mood-smile", "badge": null },
  "astro": { "id": "astro", "name": "Astro", "icon": "ti-rocket", "badge": null },
  "devops": { "id": "devops", "name": "DevOps", "icon": "ti-settings", "badge": null },
  "cicd": { "id": "devops", "name": "DevOps", "icon": "ti-settings", "badge": null },
  "web": { "id": "web", "name": "WEB 지식", "icon": "ti-world", "badge": null },
  "docker": { "id": "docker", "name": "Docker", "icon": "ti-container", "badge": null },
  "mlops": { "id": "mlops", "name": "MLOps", "icon": "ti-server", "badge": null },
  "database": { "id": "database", "name": "Database", "icon": "ti-database", "badge": null },
  "db": { "id": "database", "name": "Database", "icon": "ti-database", "badge": null },
  "orm": { "id": "orm", "name": "ORM", "icon": "ti-database", "badge": null },
  "fastapi": { "id": "fastapi", "name": "FastAPI", "icon": "ti-bolt", "badge": null },
  "git": { "id": "git", "name": "Git", "icon": "ti-git-branch", "badge": null },
  "ai": { "id": "ai", "name": "AI & Tools", "icon": "ti-brain", "badge": null },
  "tools": { "id": "ai", "name": "AI & Tools", "icon": "ti-brain", "badge": null },
  "hosting": { "id": "hosting", "name": "Hosting", "icon": "ti-cloud", "badge": null },
  "auth": { "id": "auth", "name": "인증/보안", "icon": "ti-lock", "badge": null },
  "nestjs": { "id": "nestjs", "name": "NestJS", "icon": "ti-server", "badge": null },
  "nest": { "id": "nestjs", "name": "NestJS", "icon": "ti-server", "badge": null },
  "nextjs": { "id": "nextjs", "name": "Next.js", "icon": "ti-brand-nextjs", "badge": null },
  "next": { "id": "nextjs", "name": "Next.js", "icon": "ti-brand-nextjs", "badge": null },
  "react": { "id": "react", "name": "React", "icon": "ti-brand-react", "badge": "hot" },
  "python": { "id": "python", "name": "Python", "icon": "ti-brand-python", "badge": null },
  "design": { "id": "design", "name": "디자인", "icon": "ti-palette", "badge": null },
  "typescript": { "id": "typescript", "name": "TypeScript", "icon": "ti-brand-typescript", "badge": "new" },
  "javascript": { "id": "javascript", "name": "JavaScript", "icon": "ti-brand-javascript", "badge": "hot" },
  "css": { "id": "css", "name": "CSS", "icon": "ti-brand-css3", "badge": "new" },
  "nodejs": { "id": "nodejs", "name": "Node.js", "icon": "ti-server", "badge": null },
  "cs": { "id": "cs", "name": "CS 지식", "icon": "ti-brain", "badge": null }
};

// 카테고리별 매핑 이모지
const CATEGORY_EMOJI = {
  "life": "🧘",
  "astro": "🚀",
  "devops": "🔄",
  "web": "🌐",
  "docker": "🐳",
  "mlops": "🤖",
  "database": "💾",
  "orm": "💾",
  "fastapi": "⚡",
  "git": "🐙",
  "ai": "🧠",
  "hosting": "☁️",
  "auth": "🔑",
  "nestjs": "🦁",
  "nextjs": "⚛️",
  "react": "⚛️",
  "python": "🐍",
  "design": "🎨",
  "typescript": "📘",
  "javascript": "⚙️",
  "css": "🎨",
  "nodejs": "🟢",
  "cs": "🧠"
};

// 인라인 스타일 및 코드 태그 변환기 (Why: 안정적인 정적 HTML 스타일 주입을 위해 구현)
function parseInline(text) {
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold **text**
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Inline code `code`
  escaped = escaped.replace(/`(.*?)`/g, '<code>$1</code>');

  // Link [text](url)
  escaped = escaped.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  return escaped;
}

// 마크다운 파서 본체 (Why: NPM 의존성을 걷어내고 빠른 파일 변환 및 오버헤드 방지를 위해 커스텀 렌더러 설계)
function markdownToHtml(md) {
  const lines = md.split('\n');
  let inList = false;
  let inOrderedList = false;
  let inCodeBlock = false;
  let html = [];
  let codeLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Code block check
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        html.push('<pre><code>' + codeLines.join('\n') + '</code></pre>');
        codeLines = [];
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      const escaped = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      codeLines.push(escaped);
      continue;
    }

    const trimmed = line.trim();
    const isUnordered = trimmed.startsWith('* ') || trimmed.startsWith('- ');
    const isOrdered = /^\d+\.\s/.test(trimmed);

    // 목록 종료 조건 감지 및 자동 마크업 추가
    if (inList && !isUnordered) {
      html.push('</ul>');
      inList = false;
    }
    if (inOrderedList && !isOrdered) {
      html.push('</ol>');
      inOrderedList = false;
    }

    if (trimmed.startsWith('## ')) {
      html.push('<h2>' + parseInline(trimmed.substring(3)) + '</h2>');
    } else if (trimmed.startsWith('### ')) {
      html.push('<h3>' + parseInline(trimmed.substring(4)) + '</h3>');
    } else if (trimmed.startsWith('# ')) {
      html.push('<h1>' + parseInline(trimmed.substring(2)) + '</h1>');
    } else if (isUnordered) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push('<li>' + parseInline(trimmed.substring(2)) + '</li>');
    } else if (isOrdered) {
      if (!inOrderedList) {
        html.push('<ol>');
        inOrderedList = true;
      }
      html.push('<li>' + parseInline(trimmed.replace(/^\d+\.\s/, '')) + '</li>');
    } else if (trimmed.startsWith('> ')) {
      html.push('<blockquote>' + parseInline(trimmed.substring(2)) + '</blockquote>');
    } else if (trimmed === '') {
      continue;
    } else {
      html.push('<p>' + parseInline(trimmed) + '</p>');
    }
  }

  if (inList) html.push('</ul>');
  if (inOrderedList) html.push('</ol>');

  return html.join('\n');
}

// Front Matter 및 본문 분리
function parsePost(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fmMatch = content.match(/^---([\s\S]*?)---/);
  if (!fmMatch) return null;

  const fmText = fmMatch[1];
  const bodyText = content.substring(fmMatch[0].length).trim();

  const fm = {};
  fmText.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length < 2) return;
    const key = parts[0].trim();
    let val = parts.slice(1).join(':').trim();
    
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.substring(1, val.length - 1).split(',').map(x => x.trim().replace(/"/g, ''));
    }
    fm[key] = val;
  });

  return { fm, body: bodyText };
}

// 시각적 미려함을 높이기 위해 최상단 이모지를 스마트하게 파싱하거나 대표 이모지 자동 매핑
function extractEmoji(title, content, categoryId) {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const matchTitle = title.match(emojiRegex);
  if (matchTitle) return matchTitle[0];

  const matchContent = content.substring(0, 200).match(emojiRegex);
  if (matchContent) return matchContent[0];

  if (CATEGORY_EMOJI[categoryId]) return CATEGORY_EMOJI[categoryId];
  return '📝';
}

function runMigration() {
  console.log('🚀 마이그레이션 스크립트 실행 시작...');

  let db = { meta: { visitors: 0 }, categories: [], posts: [] };
  if (fs.existsSync(POSTS_JSON_PATH)) {
    db = JSON.parse(fs.readFileSync(POSTS_JSON_PATH, 'utf8'));
    fs.writeFileSync(POSTS_JSON_PATH + '.bak', JSON.stringify(db, null, 2), 'utf8');
    console.log('✔ 기존 posts.json 백업 완료 (posts.json.bak)');
  }

  const files = fs.readdirSync(HUGO_POSTS_DIR).filter(f => f.endsWith('.md') && f !== '_index.md');
  console.log(`📁 총 ${files.length}개의 마크다운 파일을 발견했습니다.`);

  let successCount = 0;

  files.forEach(file => {
    const filePath = path.join(HUGO_POSTS_DIR, file);
    const parsed = parsePost(filePath);
    if (!parsed) {
      console.warn(`[SKIP] Front Matter 누락: ${file}`);
      return;
    }

    const { fm, body } = parsed;
    const title = fm.title || file.replace('.md', '');
    const dateStr = fm.date ? new Date(fm.date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10);
    
    let categoryArr = Array.isArray(fm.categories) ? fm.categories : (fm.categories ? [fm.categories] : ['etc']);
    let origCategory = categoryArr[0] || 'etc';
    let catKey = origCategory.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // 카테고리 매핑 설정
    let targetCat = CATEGORY_MAP[catKey];
    if (!targetCat) {
      // 맵에 정의되지 않은 카테고리의 경우 자동 생성
      const formattedName = origCategory.charAt(0).toUpperCase() + origCategory.slice(1);
      targetCat = { id: catKey, name: formattedName, icon: 'ti-folder', badge: null };
    }
    
    // posts.json categories 업데이트
    let catExists = db.categories.some(c => c.id === targetCat.id);
    if (!catExists) {
      db.categories.push(targetCat);
      console.log(`[CATEGORY] 새 카테고리 자동 구성 및 데이터 추가: ${targetCat.name} (${targetCat.id})`);
    }

    let tagArr = Array.isArray(fm.tags) ? fm.tags : (fm.tags ? [fm.tags] : []);
    let tagVal = tagArr[0] || targetCat.name;

    const emojiVal = extractEmoji(title, body, targetCat.id);
    const likesVal = Math.floor(Math.random() * 80) + 10;

    const slug = file.replace('.md', '');
    const htmlFileName = slug + '.html';
    const relativeHtmlPath = 'posts/' + htmlFileName;
    const destHtmlPath = path.join(TARGET_POSTS_DIR, htmlFileName);

    // 중복 체크 및 posts.json 등록
    const postExists = db.posts.some(p => p.url === relativeHtmlPath);
    if (postExists) {
      console.log(`[SKIP] 중복 스킵: ${title}`);
    } else {
      db.posts.push({
        title: title.replace(emojiVal, '').trim(),
        tag: tagVal,
        categoryId: targetCat.id,
        date: dateStr,
        likes: likesVal,
        emoji: emojiVal,
        url: relativeHtmlPath
      });
    }

    // 마크다운 파싱을 통한 HTML 생성
    const htmlBody = markdownToHtml(body);

    const titleClean = title.replace(emojiVal, '').trim();
    const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${titleClean} | Dev.log</title>
  <link rel="stylesheet" href="../css/post.css" />
</head>
<body>
  <nav class="nav">
    <a class="nav-logo" href="../index.html">Dev.log 👨‍💻</a>
    <div class="nav-links"><a href="../index.html">홈</a></div>
  </nav>

  <article class="article">
    <div class="article-tag">${tagVal}</div>
    <h1>${emojiVal} ${titleClean}</h1>
    <p class="article-meta">${dateStr.replace(/-/g, '.')} · Dev.log</p>
    <div class="article-body">
${htmlBody}
    </div>
    <a class="back-link" href="../index.html">← 목록으로</a>
  </article>
</body>
</html>`;

    fs.writeFileSync(destHtmlPath, htmlContent, 'utf8');
    successCount++;
  });

  // 최종 posts.json 데이터 세이빙
  fs.writeFileSync(POSTS_JSON_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log(`✨ 마이그레이션 작업 완수! 총 ${successCount}개의 포스트를 변환하고 데이터베이스를 연동했습니다.`);
}

runMigration();
