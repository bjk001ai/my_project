(function () {
  const statVisitors = document.getElementById('stat-visitors');
  const statPosts = document.getElementById('stat-posts');
  const statCategories = document.getElementById('stat-categories');
  const catGrid = document.getElementById('cat-grid');
  const postList = document.getElementById('post-list');

  function formatDate(iso) {
    const [y, m, d] = iso.split('-');
    return y + '.' + m + '.' + d;
  }

  function articleLabel(n) {
    return n === 1 ? '1 article' : n + ' articles';
  }

  function renderBadge(badge) {
    if (badge === 'hot') return '<div class="badge badge-hot">인기</div>';
    if (badge === 'new') return '<div class="badge badge-new">new</div>';
    return '<div class="badge-empty"></div>';
  }

  function countByCategory(posts) {
    const counts = {};
    posts.forEach(function (post) {
      if (!post.categoryId) return;
      counts[post.categoryId] = (counts[post.categoryId] || 0) + 1;
    });
    return counts;
  }

  function renderCategories(categories, counts) {
    catGrid.innerHTML = categories
      .map(function (cat) {
        const n = counts[cat.id] || 0;
        const href = 'category.html?cat=' + encodeURIComponent(cat.id);
        return (
          '<a class="cat-card" href="' +
          href +
          '">' +
          renderBadge(cat.badge) +
          '<div class="cat-icon"><i class="ti ' +
          cat.icon +
          '" aria-hidden="true"></i></div>' +
          '<div class="cat-name">' +
          cat.name +
          '</div>' +
          '<div class="cat-count">' +
          articleLabel(n) +
          '</div></a>'
        );
      })
      .join('');
  }

  function renderPosts(posts) {
    if (!posts.length) {
      postList.innerHTML =
        '<p class="post-empty">아직 글이 없어요. posts.json에 항목을 추가해 보세요.</p>';
      return;
    }

    const sorted = posts.slice().sort(function (a, b) {
      return b.date.localeCompare(a.date);
    });

    postList.innerHTML = sorted
      .map(function (post) {
        const href = post.url || '#';
        const title = post.emoji ? post.emoji + ' ' + post.title : post.title;
        return (
          '<a class="post-item" href="' +
          href +
          '">' +
          '<div class="post-thumb">' +
          (post.emoji || '📝') +
          '</div>' +
          '<div class="post-meta">' +
          '<div class="post-tag">' +
          post.tag +
          '</div>' +
          '<div class="post-title">' +
          title +
          '</div>' +
          '<div class="post-info">' +
          '<span class="post-date">' +
          formatDate(post.date) +
          '</span>' +
          '<span class="post-likes"><i class="ti ti-heart" aria-hidden="true"></i> ' +
          post.likes +
          '</span>' +
          '</div></div></a>'
        );
      })
      .join('');
  }

  function updateStats(meta, posts, categories, counts) {
    const usedCategories = categories.filter(function (c) {
      return (counts[c.id] || 0) > 0;
    }).length;

    statVisitors.textContent = meta.visitors != null ? meta.visitors : 0;
    statPosts.textContent = posts.length;
    statCategories.textContent = usedCategories;
  }

  async function init() {
    try {
      const res = await fetch('posts.json');
      if (!res.ok) throw new Error('posts.json load failed');
      const data = await res.json();
      const posts = data.posts || [];
      const categories = data.categories || [];
      const meta = data.meta || {};
      const counts = countByCategory(posts);

      updateStats(meta, posts, categories, counts);
      renderCategories(categories, counts);
      renderPosts(posts);
    } catch (err) {
      console.error(err);
      postList.innerHTML =
        '<p class="post-empty">posts.json을 불러오지 못했어요. GitHub Pages로 열거나 로컬 서버를 사용해 주세요.</p>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
