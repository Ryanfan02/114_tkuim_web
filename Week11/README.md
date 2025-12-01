

| 變數名稱             | 範例值                                                                  | 說明                               |
| ---------------- | -------------------------------------------------------------------- | -------------------------------- |
| `PORT`           | `3001`                                                               | 後端 API Server 監聽 Port。           |
| `MONGODB_URI`    | `mongodb://root:password123@localhost:27017/week11?authSource=admin` | MongoDB 連線字串，包含帳號、密碼、資料庫名稱與驗證來源。 |
| `ALLOWED_ORIGIN` | `http://localhost:5173`                                              | 允許跨域呼叫的前端來源（本次前端可不做，但仍需設置）。      |

# REST Client + Mongo Shell 測試

## REST Client 測試檔：`test/api.http`

```http
### 建立報名（Create）
POST http://localhost:3001/api/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test1@example.com",
  "phone": "0911-111-111"
}

### 取得報名清單（Read + 分頁）
GET http://localhost:3001/api/signup?page=1&limit=10

### 測試 email 重複（unique index）
POST http://localhost:3001/api/signup
Content-Type: application/json

{
  "name": "Another User",
  "email": "test1@example.com",
  "phone": "0922-222-222"
}

### 更新報名（Update）
PATCH http://localhost:3001/api/signup/{{yourObjectId}}
Content-Type: application/json

{
  "phone": "0933-333-333",
  "status": "confirmed"
}

### 刪除報名（Delete）
DELETE http://localhost:3001/api/signup/{{yourObjectId}}
```

---

#  Mongo Shell 測試指令

```bash
docker exec -it week11-mongo bash
mongosh
```

## 登入 root

```js
use admin
db.auth("root", "password123")
use week11
```

## 查看資料

```js
db.participants.find().pretty()
```

## 查看唯一索引

```js
db.participants.getIndexes()
```

## 分頁測試

```js
db.participants.find().sort({ createdAt: -1 }).skip(5).limit(5)
```

---

#  Docker 啟動方式

```bash
cd docker
docker compose up -d
```

---

#  啟動後端伺服器

```bash
cd server
npm install
npm run dev
```

伺服器會啟動在：

http://localhost:3001

---