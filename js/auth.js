// 로그인 처리
async function handleLogin(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        alert('로그인 성공!');
        window.location.href = 'board.html';
    } catch (error) {
        alert('로그인 실패: ' + error.message);
    }
}

// 회원가입 처리
async function handleSignup(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (error) throw error;

        alert('회원가입 성공! 이메일을 확인해주세요.');
    } catch (error) {
        alert('회원가입 실패: ' + error.message);
    }
}

// 로그아웃 처리
async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        alert('로그아웃되었습니다.');
        window.location.href = 'index.html';
    } catch (error) {
        alert('로그아웃 실패: ' + error.message);
    }
}

// 페이지 로드 시 로그인 상태 확인
window.addEventListener('DOMContentLoaded', async () => {
    const user = await getCurrentUser();
    
    // 로그인 상태 표시
    const authStatus = document.getElementById('auth-status');
    if (authStatus) {
        if (user) {
            authStatus.innerHTML = `
                <span>${user.email}</span>
                <button onclick="handleLogout()" class="btn-logout">로그아웃</button>
            `;
        } else {
            authStatus.innerHTML = `
                <a href="login.html" class="btn-login">로그인</a>
            `;
        }
    }
});
