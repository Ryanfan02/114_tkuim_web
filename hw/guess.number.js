
function generateTarget() {
  return (Math.random() * 100 | 0) + 1;
}

function compareGuess(guess, target) {
  if (guess < target) return -1;
  if (guess > target) return 1;
  return 0;
}

function playGame() {
  var target = generateTarget();
  var tries = 0;
  var history = []; 

  alert("遊戲開始！請猜 1~100 的數字。");
  
  while (true) {
    var input = prompt("請輸入 1~100 的整數（取消結束）：");
    if (input === null) {
      alert("遊戲已取消。");
      break;
    }

    var n = parseInt(input, 10);
    if (isNaN(n) || n < 1 || n > 100) {
      alert("請輸入 1~100 的整數！");
      continue; 
    }

    tries++;
    var cmp = compareGuess(n, target);
    var hint = "";

    if (cmp === 0) {
      hint = "猜中！";
      alert("恭喜！第 " + tries + " 次猜中答案 " + target + "！");
      history.push([tries, n, hint]);
      break;
    } else if (cmp < 0) {
      hint = "再大一點";
      alert(hint);
    } else {
      hint = "再小一點";
      alert(hint);
    }

    history.push([tries, n, hint]);
  }

  var log = "【猜數字紀錄】\n";
  log += "答案：" + target + "\n";
  log += "總共嘗試：" + tries + " 次\n\n";
  log += "#  次數  猜測  提示\n";

  for (var i = 0; i < history.length; i++) {
    var r = history[i];
    log += r[0] + "\t" + r[1] + "\t" + r[2] + "\n";
  }

  document.getElementById("log").textContent = log;
}

document.getElementById("startBtn").onclick = playGame;