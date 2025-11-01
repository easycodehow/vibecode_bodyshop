// Supabase 설정
const SUPABASE_URL = 'https://kuhpangzvgvifadztkgv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1aHBhbmd6dmd2aWZhZHp0a2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjExNDcsImV4cCI6MjA3NzUzNzE0N30.rKwkVJuUzfD_yeCPFZhhaAl7RLXtgtwBFjxPHcNfQGg';

// Supabase 클라이언트 생성
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 현재 로그인 사용자 확인
async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// 로그인 상태 체크
async function checkAuth() {
    const user = await getCurrentUser();
    return user !== null;
}
