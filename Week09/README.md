# Week09 Signup Demo — README

## 專案介紹
這是一個前後端分離的小專案，包含：
- 使用者報名表單（前端 HTML + JS）
- Express 後端 API：`POST /api/signup`、`GET /api/signup`
- 基礎欄位驗證、錯誤處理與清單查詢

---

# 啟動方式

## 後端啟動方式（Node.js + Express）

### 安裝套件
```bash
npm install
```

### 啟動開發模式
```bash
npm run dev
```

後端預設會在：

```
http://localhost:3001
```

> 若後端有使用 `.env`，需包含：
```
PORT=3001
ALLOWED_ORIGIN=http://127.0.0.1:5500
```

---

## 前端啟動方式

### 方法 A：使用 VS Code Live Server
1. 安裝 Live Server 擴充功能  
2. 右鍵 `client/signup_form.html` → **Open with Live Server**
3. Live Server 預設網址：
```
http://127.0.0.1:5500/client/signup_form.html
```

---

### 方法 B：使用 Vite 開發伺服器
若你想用 Vite：

```bash
npm create vite@latest
npm install
npm run dev
```

並將 `client/` 靜態檔案放到 `vite` 專案的 `public/` 或 `src/`。

---

# API 說明文件

## POST /api/signup  
送出報名資料。

### Request Body（JSON）
```json
{
  "name": "王小明",
  "email": "test@example.com",
  "phone": "0912345678",
  "password": "demoPass88",
  "confirmPassword": "demoPass88",
  "interests": ["後端入門"],
  "terms": true
}
```

### 成功回應
```json
{
  "message": "ok",
  "data": {
    "name": "王小明",
    "email": "test@example.com"
  }
}
```

### 可能錯誤
| 狀態碼 | 內容 |
|-------|------|
| 400 | 欄位驗證失敗（格式不符、欄位缺漏） |
| 500 | 伺服器錯誤 |

---

## GET /api/signup  
取得所有報名清單與總數。

### 成功回應
```json
{
  "total": 3,
  "list": [
    { "name": "王小明", "email": "a@gmail.com" },
    { "name": "陳小華", "email": "b@gmail.com" }
  ]
}
```

---

# 測試方式（Postman / VS Code REST / curl）

## Postman 測試

### 1. 測試 POST 報名
Method：POST  
URL：
```
http://localhost:3001/api/signup
```

Body → raw → JSON：
```json
{
  "name": "Test",
  "email": "abc@xyz.com",
  "phone": "0912345678",
  "password": "demoPass88",
  "confirmPassword": "demoPass88",
  "interests": ["後端入門"],
  "terms": true
}
```

---

### 2. 測試 GET 清單
Method：GET  
URL：
```
http://localhost:3001/api/signup
```

---

## VS Code REST Client 測試

建立 `test.http`：

```http
### POST signup
POST http://localhost:3001/api/signup
Content-Type: application/json

{
  "name": "Test",
  "email": "aaa@bbb.com",
  "phone": "0911222333",
  "password": "demoPass88",
  "confirmPassword": "demoPass88",
  "interests": ["後端入門"],
  "terms": true
}

### GET signup list
GET http://localhost:3001/api/signup
```

---

## curl 測試

### POST  
```bash
curl -X POST http://localhost:3001/api/signup -H "Content-Type: application/json" -d "{"name":"Test","email":"a@b.com","phone":"0912345678","password":"demoPass88","confirmPassword":"demoPass88","interests":["後端入門"],"terms":true}"
```

### GET  
```bash
curl http://localhost:3001/api/signup
```

---
