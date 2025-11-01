// 게시글 목록 가져오기
async function loadPosts() {
    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        displayPosts(posts);
    } catch (error) {
        console.error('게시글 로딩 실패:', error);
        alert('게시글을 불러오는데 실패했습니다.');
    }
}

// 게시글 목록 표시
function displayPosts(posts) {
    const postList = document.getElementById('post-list');
    if (!postList) return;

    if (posts.length === 0) {
        postList.innerHTML = '<p class="no-posts">작성된 게시글이 없습니다.</p>';
        return;
    }

    postList.innerHTML = posts.map(post => `
        <div class="post-item" onclick="window.location.href='board-view.html?id=${post.id}'">
            <h3>${escapeHtml(post.title)}</h3>
            <div class="post-meta">
                <span class="author">${escapeHtml(post.author_email || '익명')}</span>
                <span class="date">${formatDate(post.created_at)}</span>
            </div>
        </div>
    `).join('');
}

// 게시글 작성
async function createPost(title, content) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            alert('로그인이 필요합니다.');
            window.location.href = 'login.html';
            return;
        }

        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    title: title,
                    content: content,
                    author_id: user.id,
                    author_email: user.email
                }
            ])
            .select();

        if (error) throw error;

        alert('게시글이 작성되었습니다!');
        window.location.href = 'board.html';
    } catch (error) {
        console.error('게시글 작성 실패:', error);
        alert('게시글 작성에 실패했습니다.');
    }
}

// 게시글 상세보기
async function loadPost(postId) {
    try {
        const { data: post, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (error) throw error;

        displayPost(post);
    } catch (error) {
        console.error('게시글 로딩 실패:', error);
        alert('게시글을 불러오는데 실패했습니다.');
    }
}

// 게시글 상세 표시
async function displayPost(post) {
    const postDetail = document.getElementById('post-detail');
    if (!postDetail) return;

    const user = await getCurrentUser();
    const isAuthor = user && user.id === post.author_id;

    postDetail.innerHTML = `
        <div class="post-header">
            <h1>${escapeHtml(post.title)}</h1>
            <div class="post-meta">
                <span class="author">${escapeHtml(post.author_email || '익명')}</span>
                <span class="date">${formatDate(post.created_at)}</span>
            </div>
        </div>
        <div class="post-content">
            ${escapeHtml(post.content).replace(/\n/g, '<br>')}
        </div>
        <div class="post-actions">
            <button onclick="window.location.href='board.html'" class="btn-secondary">목록으로</button>
            ${isAuthor ? `
                <button onclick="editPost(${post.id})" class="btn-primary">수정</button>
                <button onclick="deletePost(${post.id})" class="btn-danger">삭제</button>
            ` : ''}
        </div>
    `;
}

// 게시글 수정
async function updatePost(postId, title, content) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        const { data, error } = await supabase
            .from('posts')
            .update({
                title: title,
                content: content
            })
            .eq('id', postId)
            .eq('author_id', user.id);

        if (error) throw error;

        alert('게시글이 수정되었습니다!');
        window.location.href = `board-view.html?id=${postId}`;
    } catch (error) {
        console.error('게시글 수정 실패:', error);
        alert('게시글 수정에 실패했습니다.');
    }
}

// 게시글 삭제
async function deletePost(postId) {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
        const user = await getCurrentUser();
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)
            .eq('author_id', user.id);

        if (error) throw error;

        alert('게시글이 삭제되었습니다.');
        window.location.href = 'board.html';
    } catch (error) {
        console.error('게시글 삭제 실패:', error);
        alert('게시글 삭제에 실패했습니다.');
    }
}

// 수정 페이지로 이동
function editPost(postId) {
    window.location.href = `board-write.html?id=${postId}`;
}

// HTML 이스케이프 (XSS 방지)
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
