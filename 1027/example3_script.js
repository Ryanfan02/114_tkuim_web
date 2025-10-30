// example3_script.js
// 透過 input/blur 事件實作即時錯誤，僅在使用者操作後顯示訊息

const form = document.getElementById('signup-form');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm');
const passwordError = document.getElementById('password-error');
const confirmError = document.getElementById('confirm-error');

const touched = new Set();

function validatePassword() {
  const value = password.value.trim();
  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value); // ✅ 至少一個特殊符號
  let message = '';

  if (!value) {
    message = '請輸入密碼。';
  } else if (value.length < 8) {
    message = '密碼至少需 8 碼。';
  } else if (!hasLetter || !hasNumber) {
    message = '請同時包含英文字母與數字。';
  } else if (!hasSpecial) {
    message = '請至少包含一個特殊符號（如 !@#$%^&* 等）。';
  }

  password.setCustomValidity(message);
  passwordError.textContent = message;
  return !message;
}

function validateConfirm() {
  const passwordValue = password.value.trim();
  const confirmValue = confirmPassword.value.trim();
  let message = '';

  if (!confirmValue) {
    message = '請再次輸入密碼。';
  } else if (passwordValue !== confirmValue) {
    message = '兩次輸入的密碼不一致。';
  }

  confirmPassword.setCustomValidity(message);
  confirmError.textContent = message;
  return !message;
}

function handleBlur(event) {
  touched.add(event.target.id);
  runValidation(event.target.id);
}

function handleInput(event) {
  if (!touched.has(event.target.id)) return;
  runValidation(event.target.id);
}

function runValidation(fieldId) {
  if (fieldId === 'password') {
    validatePassword();
    if (touched.has('confirm')) validateConfirm();
  }
  if (fieldId === 'confirm') {
    validateConfirm();
  }
}

[password, confirmPassword].forEach((input) => {
  input.addEventListener('blur', handleBlur);
  input.addEventListener('input', handleInput);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  touched.add('password');
  touched.add('confirm');
  const passwordOk = validatePassword();
  const confirmOk = validateConfirm();
  if (passwordOk && confirmOk) {
    alert('註冊成功');
    form.reset();
    passwordError.textContent = '';
    confirmError.textContent = '';
    touched.clear();
  }
});
