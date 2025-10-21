
function toC(F) { return (F - 32) * 5 / 9; }
function toF(C) { return C * 9 / 5 + 32; }

function normalizeUnit(u) {
  if (!u) return '';
  var s = String(u).trim().toUpperCase();
  return (s === 'C' || s === 'F') ? s : '';
}

function convertOnce() {
  var rawVal  = prompt('請輸入溫度數值：');
  if (rawVal === null) return null;

  var rawUnit = prompt('請輸入單位（C 或 F）：');
  if (rawUnit === null) return null;

  var val = parseFloat(rawVal);
  var unit = normalizeUnit(rawUnit);

  if (isNaN(val) || !unit) {
    alert('輸入不正確（需要數字與單位 C/F）。');
    return { ok:false, text:'輸入不正確（需要數字與單位 C/F）。' };
  }

  if (unit === 'C') {
    var F = toF(val);
    alert(val + ' °C = ' + F.toFixed(2) + ' °F');
    return { ok:true, text: val + ' °C → ' + F.toFixed(2) + ' °F' };
  } else {
    var C = toC(val);
    alert(val + ' °F = ' + C.toFixed(2) + ' °C');
    return { ok:true, text: val + ' °F → ' + C.toFixed(2) + ' °C' };
  }
}

function runConverter() {
  var lines = ['【溫度轉換紀錄】'];
  while (true) {
    var res = convertOnce();
    if (res === null) { lines.push('（已取消）'); break; }
    lines.push(res.text);
    var again = confirm('要再轉換一次嗎？');
    if (!again) break;
  }
  document.getElementById('result').textContent = lines.join('\n');
}

runConverter();