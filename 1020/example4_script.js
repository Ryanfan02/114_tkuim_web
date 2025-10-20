// example4_script.js
// 判斷輸入數字是否為奇數或偶數

var input = prompt('請輸入一個整數：');
var n = parseInt(input, 10);
var msg = '';

if (isNaN(n)) {
  msg = '輸入不是有效的整數！';
} else if (n % 2 === 0) {
  msg = n + ' 是偶數';
} else {
  msg = n + ' 是奇數';
}

// 額外示範 switch（1、2、3 對應文字）
var choice = prompt('輸入 1/2/3 試試 switch：');
switch (choice) {
  case '1':
    msg += '\n你輸入了 1';
    break;
  case '2':
    msg += '\n你輸入了 2';
    break;
  case '3':
    msg += '\n你輸入了 3';
    break;
  default:
    msg += '\n非 1/2/3';
}

var score =prompt('請輸入成績(0-100):')
switch(parseInt(score / 10)){
  case 10:
  case 9:
    msg += '\n你得到了A';
    break;
  case 8:
    msg += '\n你得到了B';
    break;
  case 7:
    msg += '\n你得到了C';
    break;
  case 6:
    msg += '\n你得到了D';
    break;
  default:
    msg += '\n 你得到了F';
}

document.getElementById('result').textContent = msg;