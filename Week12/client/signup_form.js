// client/signup_form.js
const form = document.querySelector('#signupForm');
const tableBody = document.querySelector('#signupTableBody');

// 共用：組 header
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// 頁面載入先抓列表
async function loadList() {
  const res = await fetch('/api/signup', {
    headers: getAuthHeaders()
  });

  if (res.status === 401) {
    alert('請先登入');
    window.location.href = '/';
    return;
  }

  const data = await res.json();
  renderTable(data.data || []);
}

function renderTable(list) {
  tableBody.innerHTML = '';
  list.forEach((item) => {
    const tr = document.createElement('tr');
    // ... 建 td，把 item 各欄印出來
    // 刪除按鈕加上 data-id，點擊後呼叫 deleteSignup(id)
    tableBody.appendChild(tr);
  });
}

// 新增
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    // 從 form 取值
  };

  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });

  if (res.status === 401) {
    alert('請重新登入');
    return;
  }

  await loadList();
});

// 刪除
async function deleteSignup(id) {
  if (!confirm('確定要刪除？')) return;

  const res = await fetch(`/api/signup/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || '刪除失敗');
    return;
  }

  await loadList();
}

loadList();
