(function () {
  const params = new URLSearchParams(window.location.search);
  const catId = params.get('cat');
  const titleEl = document.getElementById('cat-title');
  const descEl = document.getElementById('cat-desc');
  const listEl = document.getElementById('post-list');

  function formatDate(iso) {
    const parts = iso.split('-');
    return parts[0] + '.' + parts[1] + '.' + parts[2];
  }

  function renderPosts(posts, categoryName) {
    if (!posts.length) {
      listEl.innerHTML =
        '<p class="post-empty">' +
        categoryName +
        ' 카테고리에 아직 글이 없어요.</p>';
      return;
    }

    listEl.innerHTML = posts
      .map(function (post) {
        const href = post.url || '#';
        const label = post.emoji ? post.emoji + ' ' + post.title : post.title;
        return (
          '<a class="post-item" href="' +
          href +
          '">' +
          '<div class="post-thumb">' +
          (post.emoji || '📝') +
          '</div>' +
          '<div>' +
          '<div class="post-tag">' +
          post.tag +
          '</div>' +
          '<div class="post-title">' +
          label +
          '</div>' +
          '<div class="post-tag">' +
          formatDate(post.date) +
          '</div></div></a>'
        );
      })
      .join('');
  }

  async function init() {
    if (!catId) {
      titleEl.textContent = '카테고리를 선택해 주세요';
      descEl.textContent = '홈에서 카테고리 카드를 클릭하세요.';
      listEl.innerHTML = '';
      return;
    }

    try {
      const res = await fetch('posts.json');
      if (!res.ok) throw new Error('load failed');
      const data = await res.json();
      const categories = data.categories || [];
      const cat = categories.find(function (c) {
        return c.id === catId;
      });
      const allPosts = data.posts || [];
      const filtered = allPosts.filter(function (p) {
        return p.categoryId === catId;
      });

      filtered.sort(function (a, b) {
        return b.date.localeCompare(a.date);
      });

      const name = cat ? cat.name : catId;
      titleEl.textContent = name;
      document.title = name + ' | Dev.log';
      descEl.textContent = filtered.length + '개의 글';
      renderPosts(filtered, name);
    } catch (e) {
      console.error(e);
      listEl.innerHTML =
        '<p class="post-empty">posts.json을 불러오지 못했어요.</p>';
    }
  }

  init();
})();
