// === DOM 快速存取 ===
const formulaSel = document.querySelector('#formula');
const paramFields = document.querySelector('#paramFields');
const form = document.querySelector('#calcForm');
const resultOut = document.querySelector('#result');
const formulaView = document.querySelector('#formulaView');
const btnReset = document.querySelector('#btnReset');
const themeToggle = document.querySelector('#themeToggle');


// === 啟動：載入先前狀態 (localStorage) ===
(function bootstrapState(){
const savedTheme = localStorage.getItem('theme');
if(savedTheme === 'dark') applyDark(true);
const saved = JSON.parse(localStorage.getItem('calcState')||'{}');
if(saved.formula){
formulaSel.value = saved.formula;
renderFields(saved.formula, saved.inputs||{});
}
})();

// === 事件 ===
formulaSel.addEventListener('change', e => { renderFields(e.target.value, {}); });


btnReset.addEventListener('click', () => {
form.reset(); resultOut.value = '—';
formulaView.textContent = '將即時顯示所用公式。';
paramFields.innerHTML = ''; persistState();
});


form.addEventListener('submit', e => {
e.preventDefault();
if(!form.checkValidity()){ form.classList.add('was-validated'); return; }
const kind = formulaSel.value; const vals = collectInputs();
let ans = NaN, formulaText = '';
switch(kind){
case 'equilateral':{ const a = vals.a; ans = Math.sqrt(3)/4 * a * a; formulaText = 'A = (√3/4)·a²'; break; }
case 'triangle':{
const base = vals.base, height = vals.height;
if(base && height){ ans = 0.5 * base * height; formulaText = 'A = 1/2 · b · h'; }
else { const a=vals.a,b=vals.b,c=vals.c; const s=(a+b+c)/2; ans = Math.sqrt(Math.max(0,s*(s-a)*(s-b)*(s-c))); formulaText='A = √(s(s-a)(s-b)(s-c)), s=(a+b+c)/2'; }
break;
}
case 'rectangle':{ ans = vals.w * vals.h; formulaText='A = w · h'; break; }
case 'circle':{ ans = Math.PI * vals.r * vals.r; formulaText='A = πr²'; break; }
case 'ellipse':{ ans = Math.PI * vals.a * vals.b; formulaText='A = πab'; break; }
case 'regularPolygon':{ const n=vals.n,s=vals.s; ans=(n*s*s)/(4*Math.tan(Math.PI/n)); formulaText='A = n·s² / (4·tan(π/n))'; break; }
case 'distance':{ const dx=vals.x2-vals.x1, dy=vals.y2-vals.y1; ans=Math.sqrt(dx*dx+dy*dy); formulaText='d = √((x₂−x₁)² + (y₂−y₁)²)'; break; }
}
resultOut.value = Number.isFinite(ans) ? ans.toFixed(6) : '輸入不完整';
formulaView.textContent = '使用公式：' + formulaText;
persistState();
});


// 深色模式切換：整站變暗且提高對比
themeToggle.addEventListener('click', () => { const toDark = !document.body.classList.contains('dark'); applyDark(toDark); });


function applyDark(on){
document.body.classList.toggle('dark', on);
document.documentElement.setAttribute('data-bs-theme', on ? 'dark' : 'light');
themeToggle.textContent = on? '☀️ 淺色' : '🌙 深色';
localStorage.setItem('theme', on? 'dark' : 'light');
}

// === 依選單渲染輸入欄位：使用 createElement 動態生成 ===
function renderFields(kind, defaults){
paramFields.innerHTML = '';
const addNum = (id, label, min=0, step='any') => {
const col = document.createElement('div'); col.className = 'col-12 col-md-6';
const group = document.createElement('div'); group.className = 'form-floating';
const input = document.createElement('input'); input.type = 'number'; input.id = id; input.className = 'form-control'; input.required = true; input.min = String(min); input.step = step; if(defaults[id] !== undefined) input.value = defaults[id];
const lab = document.createElement('label'); lab.setAttribute('for', id); lab.textContent = label;
const inv = document.createElement('div'); inv.className = 'invalid-feedback'; inv.textContent = '請輸入有效數字';
group.appendChild(input); group.appendChild(lab); group.appendChild(inv); col.appendChild(group); paramFields.appendChild(col);
};


if(kind === 'equilateral'){ addNum('a','邊長 a'); }
else if(kind === 'triangle'){
addNum('base','底 b (選填)'); addNum('height','高 h (選填)');
addNum('a','邊 a'); addNum('b','邊 b'); addNum('c','邊 c');
['base','height','a','b','c'].forEach(id=>{ const el=document.querySelector('#'+id); el.addEventListener('input', customTriangleValidity); });
}
else if(kind === 'rectangle'){ addNum('w','長 w'); addNum('h','寬 h'); }
else if(kind === 'circle'){ addNum('r','半徑 r'); }
else if(kind === 'ellipse'){ addNum('a','長軸 a'); addNum('b','短軸 b'); }
else if(kind === 'regularPolygon'){
addNum('n','邊數 n',3,1); addNum('s','邊長 s');
document.querySelector('#n').addEventListener('input', e=>{ if(+e.target.value < 3){ e.target.setCustomValidity('邊數需 ≥ 3'); } else { e.target.setCustomValidity(''); } });
}
else if(kind === 'distance'){ addNum('x1','x₁',-1e9); addNum('y1','y₁',-1e9); addNum('x2','x₂',-1e9); addNum('y2','y₂',-1e9); }


form.classList.remove('was-validated');
persistState();
}


function customTriangleValidity(){
const base = valueNum('#base'); const height = valueNum('#height');
const a = valueNum('#a'); const b = valueNum('#b'); const c = valueNum('#c');
const usingBH = base!==null && height!==null; const usingABC = a!==null && b!==null && c!==null;
['#base','#height','#a','#b','#c'].forEach(sel=>{ const el=document.querySelector(sel); if(!(usingBH||usingABC)) el.setCustomValidity('請輸入 (底與高) 或 (a,b,c)'); else el.setCustomValidity(''); });
}


function valueNum(sel){ const el = document.querySelector(sel); if(!el) return null; const v = el.value.trim(); if(v==='') return null; const num = Number(v); return Number.isFinite(num) ? num : null; }


function collectInputs(){ const inputs = paramFields.querySelectorAll('input[type="number"]'); const o = {}; inputs.forEach(i => { o[i.id] = Number(i.value); }); return o; }


function persistState(){ const state = { formula: formulaSel.value || '', inputs: Object.fromEntries([...paramFields.querySelectorAll('input')].map(i=>[i.id, i.value])) }; localStorage.setItem('calcState', JSON.stringify(state)); }