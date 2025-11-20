const form = document.querySelector('#signup-form');
const resultEl = document.querySelector('#result');
const submitBtn = document.querySelector('#submit-btn');
const listBtn = document.querySelector('#list-btn');

const API_BASE = 'http://localhost:3001/api';

let isBusy = false; // 共用旗標：避免重複送出或重複請求

// ===== 送出報名表單（POST /api/signup） =====
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (isBusy) return;

  isBusy = true;
  submitBtn.disabled = true;
  listBtn.disabled = true;
  resultEl.textContent = '送出中...';

  // 組 payload（老師 demo 的固定欄位依舊幫你帶入）
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  payload.password = 'demoPass88';
  payload.confirmPassword = 'demoPass88';
  payload.interests = ['後端入門'];
  payload.terms = true;

  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    // 後端驗證失敗時會回 400，這裡把錯誤訊息顯示出來
    if (!res.ok) {
      throw new Error(data.error || '報名失敗');
    }

    resultEl.textContent =
      '報名成功！\n' + JSON.stringify(data, null, 2);

    form.reset();
  } catch (error) {
    resultEl.textContent = `錯誤：${error.message}`;
  } finally {
    isBusy = false;
    submitBtn.disabled = false;
    listBtn.disabled = false;
  }
});

// ===== 查看報名清單（GET /api/signup） =====
listBtn.addEventListener('click', async () => {
  if (isBusy) return;

  isBusy = true;
  submitBtn.disabled = true;
  listBtn.disabled = true;
  resultEl.textContent = '載入報名清單中...';

  try {
    const res = await fetch(`${API_BASE}/signup`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || '取得報名清單失敗');
    }

    // 假設後端回傳格式類似：{ total, list: [...] }
    const total = data.total != null ? data.total : (data.list ? data.list.length : 0);
    const list = data.list || data;

    resultEl.textContent =
      `目前報名總數：${total}\n` +
      JSON.stringify(list, null, 2);
  } catch (error) {
    resultEl.textContent = `錯誤：${error.message}`;
  } finally {
    isBusy = false;
    submitBtn.disabled = false;
    listBtn.disabled = false;
  }
});
