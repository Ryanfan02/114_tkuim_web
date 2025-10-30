
const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const pwInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm');
const interestGroup = document.getElementById('interest-group');
const agreeCheckbox = document.getElementById('agree');
const successMsg = document.getElementById('successMsg');

const pwStrengthBar = document.getElementById('passwordStrengthBar');
const pwStrengthText = document.getElementById('passwordStrengthText');

const otherInterestCheck = document.getElementById('otherInterestCheck');
const otherInterestText = document.getElementById('otherInterestText');

function setError(inputEl, msg, errorId) {
  const errorEl = document.getElementById(errorId);
  inputEl.classList.add('error');
  inputEl.setCustomValidity(msg);
  errorEl.textContent = msg;
}

function clearError(inputEl, errorId) {
  const errorEl = document.getElementById(errorId);
  inputEl.classList.remove('error');
  inputEl.setCustomValidity('');
  errorEl.textContent = '';
}

function validateName() {
  const val = nameInput.value.trim();
  if (val === '') {
    setError(nameInput, '請輸入姓名', 'nameError');
    return false;
  }
  clearError(nameInput, 'nameError');
  return true;
}

function validateEmail() {
  const val = emailInput.value.trim();
  const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
  if (!ok) {
    setError(emailInput, '請輸入有效的 Email', 'emailError');
    return false;
  }
  clearError(emailInput, 'emailError');
  return true;
}

function validatePhone() {
  const val = phoneInput.value.trim();
  const ok = /^[0-9]{10}$/.test(val);
  if (!ok) {
    setError(phoneInput, '手機需為 10 碼數字', 'phoneError');
    return false;
  }
  clearError(phoneInput, 'phoneError');
  return true;
}

function validatePassword() {
  const val = pwInput.value;
  const longEnough = val.length >= 8;
  const hasLetter = /[A-Za-z]/.test(val);
  const hasNumber = /[0-9]/.test(val);
  if (!longEnough || !hasLetter || !hasNumber) {
    setError(pwInput, '密碼至少8碼，且需包含英文字母與數字', 'passwordError');
    return false;
  }
  clearError(pwInput, 'passwordError');
  return true;
}

function validateConfirmPassword() {
  const val = confirmInput.value;
  if (val !== pwInput.value || val === '') {
    setError(confirmInput, '密碼不一致', 'confirmError');
    return false;
  }
  clearError(confirmInput, 'confirmError');
  return true;
}

function validateInterest() {
  const checked = interestGroup.querySelectorAll('input[type="checkbox"]:checked');

  if (checked.length === 0) {
    const firstBox = interestGroup.querySelector('input[type="checkbox"]');
    firstBox.classList.add('error');
    document.getElementById('interestError').textContent = '請至少選擇一個興趣';
    return false;
  }

  if (otherInterestCheck.checked) {
    const text = otherInterestText.value.trim();
    if (text === '') {
      otherInterestText.classList.add('error');
      document.getElementById('interestError').textContent = '請輸入其他興趣內容';
      return false;
    }
  }

  interestGroup.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.classList.remove('error'));
  otherInterestText.classList.remove('error');
  document.getElementById('interestError').textContent = '';
  return true;
}

function validateAgree() {
  if (!agreeCheckbox.checked) {
    agreeCheckbox.classList.add('error');
    setError(agreeCheckbox, '您必須同意服務條款', 'agreeError');
    return false;
  }
  agreeCheckbox.classList.remove('error');
  clearError(agreeCheckbox, 'agreeError');
  return true;
}

function updatePasswordStrength() {
  const val = pwInput.value;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
  if (/[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;

  if (score === 0) {
    pwStrengthBar.style.width = '0%';
    pwStrengthText.textContent = '強度：';
  } else if (score === 1) {
    pwStrengthBar.style.width = '33%';
    pwStrengthBar.style.background = '#d93025';
    pwStrengthText.textContent = '強度：弱';
  } else if (score === 2) {
    pwStrengthBar.style.width = '66%';
    pwStrengthBar.style.background = '#f6c343';
    pwStrengthText.textContent = '強度：中';
  } else {
    pwStrengthBar.style.width = '100%';
    pwStrengthBar.style.background = '#0a7a2a';
    pwStrengthText.textContent = '強度：強';
  }
}

function attachLiveValidation(inputEl, validateFn, errorId) {
  let touched = false;
  inputEl.addEventListener('blur', () => {
    touched = true;
    validateFn();
  });
  inputEl.addEventListener('input', () => {
    if (touched) validateFn();
    if (inputEl === pwInput) updatePasswordStrength();
    if (inputEl === confirmInput) validateConfirmPassword();
  });
}

attachLiveValidation(nameInput, validateName, 'nameError');
attachLiveValidation(emailInput, validateEmail, 'emailError');
attachLiveValidation(phoneInput, validatePhone, 'phoneError');
attachLiveValidation(pwInput, validatePassword, 'passwordError');
attachLiveValidation(confirmInput, validateConfirmPassword, 'confirmError');


interestGroup.addEventListener('click', (e) => {
  if (e.target.matches('input[type="checkbox"]')) {
    if (e.target.id === 'otherInterestCheck') {
      otherInterestText.disabled = !e.target.checked;
      if (!e.target.checked) {
        otherInterestText.value = '';
        otherInterestText.classList.remove('error');
      }
    }
    validateInterest();
  }
});

otherInterestText.addEventListener('input', () => {
  validateInterest();
});

agreeCheckbox.addEventListener('click', (event) => {
  if (agreeCheckbox.checked === true) {
    const ok = confirm('您確認已閱讀並同意服務條款嗎？');
    if (!ok) {
      event.preventDefault();
      agreeCheckbox.checked = false;
    }
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  successMsg.textContent = '';

  const okAll = [
    validateName(),
    validateEmail(),
    validatePhone(),
    validatePassword(),
    validateConfirmPassword(),
    validateInterest(),
    validateAgree()
  ].every(v => v === true);

  if (!okAll) {   
    const firstError = form.querySelector('.error');
    if (firstError) firstError.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';

  await new Promise((resolve) => setTimeout(resolve, 1000));
  successMsg.textContent = '送出成功！感謝您的註冊';

  form.reset();
  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
  pwStrengthBar.style.width = '0%';
  pwStrengthText.textContent = '強度：';
  otherInterestText.disabled = true;
  document.querySelectorAll('.error-text').forEach(el => el.textContent = '');
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
});

resetBtn.addEventListener('click', () => {
  form.reset();
  successMsg.textContent = '';
  pwStrengthBar.style.width = '0%';
  pwStrengthText.textContent = '強度：';
  otherInterestText.disabled = true;
  document.querySelectorAll('.error-text').forEach(el => el.textContent = '');
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
});