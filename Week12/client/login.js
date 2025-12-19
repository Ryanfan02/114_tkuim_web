// client/login.js
const form = document.querySelector('#loginForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;

  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || '登入失敗');
    return;
  }

  // 成功：存 token + user
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  alert('登入成功，快去看報名資料！');
  // 轉去報名頁
  window.location.href = '/signup_form.html';
});
