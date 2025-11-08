// === DOM 快速存取 ===
const header = document.querySelector("#siteHeader");
const formulaSel = document.querySelector("#formula");
const paramFields = document.querySelector("#paramFields");
const form = document.querySelector("#calcForm");
const resultOut = document.querySelector("#result");
const formulaView = document.querySelector("#formulaView");
const btnReset = document.querySelector("#btnReset");
const themeToggle = document.querySelector("#themeToggle");
const unitSel = document.querySelector("#unit");
const copyBtn = document.querySelector("#copyBtn");
const feedbackForm = document.querySelector("#feedbackForm");
const historyList = document.querySelector("#historyList");
const clearHistoryBtn = document.querySelector("#clearHistory");
const preview = document.querySelector("#preview");
const ctx = preview ? preview.getContext("2d") : null;

// 單位換算（以 m 為內部計算單位）
const Unit = { m: 1, cm: 0.01, in: 0.0254 };

// === 啟動：還原主題/狀態/歷史 ===
(function bootstrapState() {
  const savedTheme = localStorage.getItem("theme");
  applyDark(savedTheme === "dark");
  const saved = JSON.parse(localStorage.getItem("calcState") || "{}");
  if (saved.formula) {
    formulaSel.value = saved.formula;
    renderFields(saved.formula, saved.inputs || {});
  }
  if (saved.unit) {
    unitSel.value = saved.unit;
  }
  renderHistory();
})();

// === 事件 ===
formulaSel?.addEventListener("change", (e) => {
  renderFields(e.target.value, {});
  drawPreview();
});

btnReset?.addEventListener("click", () => {
  form.reset();
  resultOut.value = "—";
  formulaView.textContent = "將即時顯示所用公式。";
  paramFields.innerHTML = "";
  persistState();
  drawPreview(true);
});

form?.addEventListener("submit", onCalcSubmit);

unitSel?.addEventListener("change", () => {
  persistState();
  if (resultOut.value && resultOut.value !== "—") {
    form.dispatchEvent(new Event("submit", { cancelable: true }));
  }
});

copyBtn?.addEventListener("click", onCopyResult);

themeToggle?.addEventListener("click", () => {
  const toDark = !document.body.classList.contains("dark");
  applyDark(toDark);
  drawPreview();
});

// 回饋表單驗證
feedbackForm?.addEventListener("submit", (e) => {
  const usefulChecked = !!feedbackForm.querySelector(
    'input[name="useful"]:checked'
  );
  if (!usefulChecked) {
    feedbackForm.querySelector('[data-for="useful"]').textContent =
      "請選擇一個分數";
  } else {
    feedbackForm.querySelector('[data-for="useful"]').textContent = "";
  }

  if (!feedbackForm.checkValidity() || !usefulChecked) {
    e.preventDefault();
    e.stopPropagation();
    feedbackForm.classList.add("was-validated");
    alert("還有欄位未填寫完整，請檢查後再送出。");
  } else {
    e.preventDefault();
    alert("感謝你的回饋！(Demo)");
    feedbackForm.reset();
    feedbackForm.classList.remove("was-validated");
  }
});

// 歷史清除
clearHistoryBtn?.addEventListener("click", () => {
  localStorage.removeItem("calcHistory");
  renderHistory();
});

// === 計算提交 ===
function onCalcSubmit(e) {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
  const kind = formulaSel.value;
  const valsRaw = collectInputs(); // 使用者當前單位
  const u = Unit[unitSel.value] || 1; // 轉 m
  const vals = Object.fromEntries(
    Object.entries(valsRaw).map(([k, v]) => [k, v * u])
  );

  let ans = NaN,
    formulaText = "";
  switch (kind) {
    case "equilateral": {
      const a = vals.a;
      ans = (Math.sqrt(3) / 4) * a * a;
      formulaText = "A = (√3/4)·a²";
      break;
    }
    case "triangle": {
      const base = vals.base,
        height = vals.height;
      if (base && height) {
        ans = 0.5 * base * height;
        formulaText = "A = 1/2 · b · h";
      } else {
        const a = vals.a,
          b = vals.b,
          c = vals.c;
        const s = (a + b + c) / 2;
        ans = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));
        formulaText = "A = √(s(s-a)(s-b)(s-c)), s=(a+b+c)/2";
      }
      break;
    }
    case "rectangle": {
      ans = vals.w * vals.h;
      formulaText = "A = w · h";
      break;
    }
    case "circle": {
      ans = Math.PI * vals.r * vals.r;
      formulaText = "A = πr²";
      break;
    }
    case "ellipse": {
      ans = Math.PI * vals.a * vals.b;
      formulaText = "A = πab";
      break;
    }
    case "regularPolygon": {
      const n = vals.n,
        s = vals.s;
      ans = (n * s * s) / (4 * Math.tan(Math.PI / n));
      formulaText = "A = n·s² / (4·tan(π/n))";
      break;
    }
    case "distance": {
      const dx = vals.x2 - vals.x1,
        dy = vals.y2 - vals.y1;
      ans = Math.sqrt(dx * dx + dy * dy);
      formulaText = "d = √((x₂−x₁)² + (y₂−y₁)²)";
      break;
    }
    default: {
      ans = NaN;
    }
  }

  let display = "輸入不完整";
  if (Number.isFinite(ans)) {
    if (kind === "distance") {
      display = (ans / u).toFixed(6) + " " + unitSel.value;
    } else {
      display = (ans / (u * u)).toFixed(6) + " " + unitSel.value + "²";
    }
  }
  resultOut.value = display;
  formulaView.textContent = "使用公式：" + formulaText;
  persistState();

  if (Number.isFinite(ans)) {
    saveHistory({
      kind,
      inputs: valsRaw,
      unit: unitSel.value,
      formulaText,
      result: display,
    });
  }
  drawPreview();
}

// === 工具 ===
function onCopyResult() {
  const kind = labelOfKind(formulaSel.value || "");
  const inputs = collectInputs();
  const pairs = Object.entries(inputs).map(
    ([k, v]) =>
      `${k}=${v}${unitSel.value}${formulaSel.value === "distance" ? "" : "^"}`
  );
  const text = `公式: ${kind} | 單位: ${unitSel.value} | 參數: ${pairs.join(
    ", "
  )} | 結果: ${resultOut.value}`;
  navigator.clipboard?.writeText(text).then(() => alert("已複製到剪貼簿"));
}

function applyDark(on) {
  document.body.classList.toggle("dark", on);
  document.documentElement.setAttribute("data-bs-theme", on ? "dark" : "light");
  if (themeToggle) themeToggle.textContent = on ? "淺色" : "深色";
  header?.classList.toggle("navbar-dark", on);
  header?.classList.toggle("navbar-light", !on);
  localStorage.setItem("theme", on ? "dark" : "light");
}

function renderFields(kind, defaults) {
  paramFields.innerHTML = "";
  const addNum = (id, label, min = 0, step = "any") => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6";
    const group = document.createElement("div");
    group.className = "form-floating";
    const input = document.createElement("input");
    input.type = "number";
    input.id = id;
    input.className = "form-control";
    input.required = true;
    input.min = String(min);
    input.step = step;
    if (defaults[id] !== undefined) input.value = defaults[id];

    const lab = document.createElement("label");
    lab.setAttribute("for", id);
    lab.textContent = label + ` (${unitSel.value})`;

    const inv = document.createElement("div");
    inv.className = "invalid-feedback";
    inv.textContent = "請輸入有效數字";

    group.appendChild(input);
    group.appendChild(lab);
    group.appendChild(inv);
    col.appendChild(group);
    paramFields.appendChild(col);

    input.addEventListener("input", () => drawPreview());
  };

  if (kind === "equilateral") {
    addNum("a", "邊長 a");
  } else if (kind === "triangle") {
    addNum("base", "底 b (選填)");
    addNum("height", "高 h (選填)");
    addNum("a", "邊 a");
    addNum("b", "邊 b");
    addNum("c", "邊 c");
    ["base", "height", "a", "b", "c"].forEach((id) => {
      const el = document.querySelector("#" + id);
      el.addEventListener("input", customTriangleValidity);
    });
  } else if (kind === "rectangle") {
    addNum("w", "長 w");
    addNum("h", "寬 h");
  } else if (kind === "circle") {
    addNum("r", "半徑 r");
  } else if (kind === "ellipse") {
    addNum("a", "長軸 a");
    addNum("b", "短軸 b");
  } else if (kind === "regularPolygon") {
    addNum("n", "邊數 n", 3, 1);
    addNum("s", "邊長 s");
    document.querySelector("#n").addEventListener("input", (e) => {
      if (+e.target.value < 3) {
        e.target.setCustomValidity("邊數需 ≥ 3");
      } else {
        e.target.setCustomValidity("");
      }
      drawPreview();
    });
  } else if (kind === "distance") {
    addNum("x1", "x₁", -1e9);
    addNum("y1", "y₁", -1e9);
    addNum("x2", "x₂", -1e9);
    addNum("y2", "y₂", -1e9);
  }

  form.classList.remove("was-validated");
  persistState();
  drawPreview();
}

function customTriangleValidity() {
  const base = valueNum("#base");
  const height = valueNum("#height");
  const a = valueNum("#a");
  const b = valueNum("#b");
  const c = valueNum("#c");
  const usingBH = base !== null && height !== null;
  const usingABC = a !== null && b !== null && c !== null;
  ["#base", "#height", "#a", "#b", "#c"].forEach((sel) => {
    const el = document.querySelector(sel);
    if (!(usingBH || usingABC))
      el.setCustomValidity("請輸入 (底與高) 或 (a,b,c)");
    else el.setCustomValidity("");
  });
}

function valueNum(sel) {
  const el = document.querySelector(sel);
  if (!el) return null;
  const v = el.value.trim();
  if (v === "") return null;
  const num = Number(v);
  return Number.isFinite(num) ? num : null;
}

function collectInputs() {
  const inputs = paramFields.querySelectorAll('input[type="number"]');
  const o = {};
  inputs.forEach((i) => {
    if (i.value !== "") o[i.id] = Number(i.value);
  });
  return o;
}

function persistState() {
  const state = {
    formula: formulaSel.value || "",
    unit: unitSel?.value || "m",
    inputs: Object.fromEntries(
      [...paramFields.querySelectorAll("input")].map((i) => [i.id, i.value])
    ),
  };
  localStorage.setItem("calcState", JSON.stringify(state));
}

// === 歷史 ===
function saveHistory(entry) {
  const list = JSON.parse(localStorage.getItem("calcHistory") || "[]");
  const withTime = { ...entry, time: new Date().toISOString() };
  list.unshift(withTime);
  while (list.length > 10) list.pop();
  localStorage.setItem("calcHistory", JSON.stringify(list));
  renderHistory();
}

function renderHistory() {
  if (!historyList) return;
  const list = JSON.parse(localStorage.getItem("calcHistory") || "[]");
  historyList.innerHTML = list.length
    ? ""
    : '<div class="list-group-item">目前沒有歷史紀錄</div>';

  list.forEach((it, idx) => {
    const item = document.createElement("div");
    item.className = "list-group-item";
    const meta = document.createElement("div");
    meta.className = "meta";
    const t = new Date(it.time);
    const ts = t.toLocaleString();

    meta.textContent = `[${idx + 1}] ${ts} ｜ ${labelOfKind(it.kind)} → ${
      it.result
    }`;

    const btns = document.createElement("div");
    const back = document.createElement("button");
    back.className = "btn btn-sm btn-outline-primary";
    back.textContent = "帶回";
    back.addEventListener("click", () => loadHistory(it));
    btns.appendChild(back);

    item.appendChild(meta);
    item.appendChild(btns);
    historyList.appendChild(item);
  });
}

function loadHistory(it) {
  formulaSel.value = it.kind;
  unitSel.value = it.unit || "m";
  renderFields(it.kind, it.inputs || {});
  Object.entries(it.inputs || {}).forEach(([k, v]) => {
    const el = document.querySelector("#" + k);
    if (el) el.value = v;
  });
  form.dispatchEvent(new Event("submit", { cancelable: true }));
}

function labelOfKind(k) {
  return (
    {
      equilateral: "正三角形面積",
      triangle: "三角形面積",
      rectangle: "長方形面積",
      circle: "圓形面積",
      ellipse: "橢圓面積",
      regularPolygon: "正多邊形面積",
      distance: "兩點距離",
    }[k] || k
  );
}

// === Canvas 繪圖 ===
function drawPreview(clearOnly = false) {
  if (!ctx) return;
  const W = preview.width,
    H = preview.height;
  ctx.clearRect(0, 0, W, H);

  // 背景格線
  const dark = document.body.classList.contains("dark");
  ctx.save();
  ctx.strokeStyle = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  ctx.lineWidth = 1;
  for (let x = 20; x < W; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 20; y < H; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();
  if (clearOnly) return;

  const kind = formulaSel.value;
  const c = {
    stroke: dark ? "#9ec5ff" : "#0d6efd",
    fill: dark ? "rgba(116,176,255,.15)" : "rgba(13,110,253,.12)",
  };
  ctx.lineWidth = 2;
  ctx.strokeStyle = c.stroke;
  ctx.fillStyle = c.fill;

  const vals = collectInputs();
  const margin = 30;
  const boxW = W - 2 * margin,
    boxH = H - 2 * margin;
  const fitScale = (maxDim) => Math.min(boxW, boxH) / (maxDim || 1);

  if (kind === "equilateral" && vals.a) {
    const a = vals.a;
    const s = fitScale(a);
    const h = (Math.sqrt(3) / 2) * a;
    const cx = W / 2,
      cy = H / 2 + (h * s) / 6;
    const p1 = [cx, cy - (2 / 3) * h * s],
      p2 = [cx - (a * s) / 2, cy + (h * s) / 3],
      p3 = [cx + (a * s) / 2, cy + (h * s) / 3];
    poly([p1, p2, p3]);
  } else if (kind === "rectangle" && vals.w && vals.h) {
    const s = fitScale(Math.max(vals.w, vals.h));
    const rw = vals.w * s,
      rh = vals.h * s;
    const x = (W - rw) / 2,
      y = (H - rh) / 2;
    rect(x, y, rw, rh);
  } else if (kind === "circle" && vals.r) {
    const r = vals.r;
    const s = fitScale(2 * r) / 2;
    circle(W / 2, H / 2, r * s);
  } else if (kind === "ellipse" && vals.a && vals.b) {
    const s = fitScale(Math.max(vals.a, vals.b));
    ellipse(W / 2, H / 2, vals.a * s, vals.b * s);
  } else if (kind === "regularPolygon" && vals.n && vals.s) {
    const n = +vals.n;
    if (n >= 3) {
      const R = vals.s / (2 * Math.sin(Math.PI / n));
      const s = fitScale(2 * R) / 2;
      regPolygon(W / 2, H / 2, n, R * s);
    }
  } else if (kind === "triangle") {
    if (vals.base && vals.height) {
      const b = vals.base,
        h = vals.height;
      const s = fitScale(Math.max(b, h));
      const rw = b * s,
        rh = h * s;
      const x = (W - rw) / 2,
        y = (H + rh) / 2;
      poly([
        [x, y],
        [x + rw, y],
        [x, y - rh],
      ]);
    } else if (vals.a && vals.b && vals.c) {
      const a = vals.a,
        b = vals.b,
        c = vals.c;
      const s = fitScale(Math.max(a, b, c));
      const x3 = (b * b + a * a - c * c) / (2 * a);
      const y3 = Math.sqrt(Math.max(0, b * b - x3 * x3));
      const tx = (W - a * s) / 2,
        ty = (H + y3 * s) / 2;
      poly([
        [tx, ty],
        [tx + a * s, ty],
        [tx + x3 * s, ty - y3 * s],
      ]);
    }
  } else if (
    kind === "distance" &&
    vals.x1 != null &&
    vals.y1 != null &&
    vals.x2 != null &&
    vals.y2 != null
  ) {
    const maxDim = Math.max(
      Math.abs(vals.x1),
      Math.abs(vals.y1),
      Math.abs(vals.x2),
      Math.abs(vals.y2),
      1
    );
    const s = fitScale(2 * maxDim);
    const cx = W / 2,
      cy = H / 2;
    const x1 = cx + vals.x1 * s,
      y1 = cy - vals.y1 * s,
      x2 = cx + vals.x2 * s,
      y2 = cy - vals.y2 * s;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    dot(x1, y1);
    dot(x2, y2);
  }

  function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
  }
  function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  function ellipse(x, y, rx, ry) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  function poly(points) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  function regPolygon(x, y, n, R) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      pts.push([x + R * Math.cos(a), y + R * Math.sin(a)]);
    }
    poly(pts);
  }
  function dot(x, y) {
    ctx.save();
    ctx.fillStyle = dark ? "#ffd166" : "#e67e22";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
