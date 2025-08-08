export async function logout() {
  try {
    const res = await fetch('/api/logout', {
      method:'POST',
    });

    if(res.ok) {
      // ログアウト成功でログイン画面へリダイレクト
      window.location.href = '/login';
    } else {
      console.error('Logout failed');
    }
  } catch (err) {
    console.error('Logout error', err);
  }
}