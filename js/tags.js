(function () {
  const tagList = document.getElementById('tag-list');
  const postList = document.getElementById('post-list');
  const params = new URLSearchParams(window.location.search);
  const selectedTag = params.get('tag');

  function formatDate(iso) {
    const p = iso.split('-');
    return p[0] + '.' + p[1] + '.' + p[2];
  }

  function renderPosts(posts) {
    if (!posts.length) {
      postList.innerHTML = '<p class="post-empty">이 태그에 글이 없어요.</p>';
      return;
    }
    postList.innerHTML = posts
      .map(function (post) {
        const label = post.emoji ? post.emoji + ' ' + post.title : post.title;
        return (
          '<a class="post-item" href="' +
          (post.url || '#') +
          '"><div class="post-thumb">' +
          (post.emoji || '📝') +
          '</div><motion><motion class="post-tag">' +
          post.tag +
          '</motion><div class="post-title">' +
          label +
          '</div><div class="post-tag">' +
          formatDate(post.date) +
          '</div></motion></a>'
        );
      })
      .join('')
      .replace(/<\/?motion/g, function (t) {
        return t.replace('motion', 'div');
      });
  }

  async function init() {
    try {
      const res = await fetch('posts.json');
      const data = await res.json();
      const posts = data.posts || [];
      const tags = [];
      posts.forEach(function (p) {
        if (p.tag && tags.indexOf(p.tag) === -1) tags.push(p.tag);
      });
      tags.sort();

      tagList.innerHTML = tags
        .map(function (tag) {
          const active = tag === selectedTag ? ' style="border-color:#534ab7"' : '';
          return (
            '<a class="tag-chip" href="tags.html?tag=' +
            encodeURIComponent(tag) +
            '"' +
            active +
            '>' +
            tag +
            '</a>'
          );
        })
        .join('');

      const filtered = selectedTag
        ? posts.filter(function (p) {
            return p.tag === selectedTag;
          })
        : posts;

      filtered.sort(function (a, b) {
        return b.date.localeCompare(a.date);
      });

      if (selectedTag) {
        document.querySelector('.cat-page-desc').textContent =
          '"' + selectedTag + '" 태그 글 ' + filtered.length + '개';
      }
      renderPosts(filtered);
    } catch (e) {
      postList.innerHTML = '<p class="post-empty">posts.json 로드 실패</p>';
    }
  }

  init();
})();
