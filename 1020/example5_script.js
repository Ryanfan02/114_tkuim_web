// example5_script.js
// 以巢狀 for 產生 1~9 的乘法表

var input=prompt('輸入要顯示的乘法範圍:')
var input1=prompt('輸入要顯示的乘法範圍:')

var output = '';
for (var i = parseInt(input); i <= parseInt(input1); i++) {
  for (var j = 1; j <= 9; j++) {
    output += i + 'x' + j + '=' + (i * j) + '\t';
  }
  output += '\n';
}


document.getElementById('result').textContent = output;
