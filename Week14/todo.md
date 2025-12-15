# Week 14 - Dcard Clone Specification & Todo List

根據使用者提供的參考圖片 (Dcard 深色模式)，本專案將使用純 **HTML**、**CSS** 與 **JavaScript** 實作一個 Dcard 網頁複刻版。

## 🎯 專案目標
實作一個具備 **文章列表 (Feed)**、**文章詳情 (Post Detail)** 以及 **看板切換 (Forum Navigation)** 功能的單頁式應用 (或多頁連接)。

## 📸 頁面分析與需求

### 1. 全域導覽列 (Navbar)
- [ ] **左側**：Dcard Logo。
- [ ] **中間**：搜尋欄 (Search input)，含放大鏡圖標。
- [ ] **右側**：
    - 發文按鈕 (+)。
    - 通知鈴鐺 (含未讀紅點)。
    - 收藏/書籤圖標。
    - 信箱/訊息圖標。
    - 個人頭像 (Avatar)。
    - 下載 App 按鈕。

### 2. 左側側邊欄 (Sidebar)
- [ ] **功能選單**：
    - 所有看板 (All forums)。
    - 即時熱門看板 (Trending forums)。
- [ ] **最近瀏覽 (Recently viewed)**：列出最近看過的看板 (範例：淡江大學、感情、研究所)。
- [ ] **追蹤看板 (Following Forums)**：列出使用者追蹤的看板。
- [ ] **Dcard 精選 (Dcard featured)**。
- [ ] **互動功能**：點擊看板名稱可切換中間區域的文章列表內容。

### 3. 中間主要內容區 (Main Content)
需支援兩種主要視圖：列表視圖 (List View) 與 詳情視圖 (Detail View)。

#### A. 文章列表視圖 (Feed View)
- [ ] **分頁籤 (Tabs)**：
    - **全部 (All)**：顯示這兩種類別的混合文章或熱門文章。
    - **追蹤 (Following)**：僅顯示使用者追蹤看板的文章。
- [ ] **文章卡片 (Post Card)**：
    - 點擊卡片任何區域需能進入「文章詳情頁」。
    - **Header**：看板名稱 (Icon + Name)、追蹤按鈕、發文者 (匿名/校系)、時間 (e.g., 16h)。
    - **Body**：文章標題、文章摘要 (兩行省略)、預覽圖片 (如有，顯示在右側或中間網格)。
    - **Footer**：愛心數 (Likes)、留言數 (Comments)、收藏數 (Bookmarks)。

#### B. 文章詳情視圖 (Post Detail View)
- [ ] **頂部導覽**：返回按鈕 (Back arrow)、看板資訊 (Icon, Name, Followers)。
- [ ] **文章本體**：
    - 作者資訊 (Avatar, Name, Timestamp)。
    - 完整標題與內文 (支援多段落)。
    - 圖片展示區。
- [ ] **底部互動**：
    - 留言區 (Comments Section)：列出留言 (頭像、內容、愛心/回覆)。
    - 輸入框："Comment..."。

## 🛠️ 技術實作規劃 (Todo List)

### Phase 1: 基礎架構 (Infrastructure)
- [ ] 建立 `index.html` (單頁架構 SPA 或是多頁)。
- [ ] 建立 `styles.css` (設定 CSS Variables：深色背景 `#00324e` / `#002b42`，文字顏色 `#ffffff` 等)。
- [ ] 建立 `script.js` (處理資料模擬與渲染)。
- [ ] 引入圖標庫 (FontAwesome 或類似)。

### Phase 2: 版面切版 (Layout)
- [ ] **Navbar 實作**：Flexbox 排版，固定置頂 (Sticky/Fixed)。
- [ ] **Grid 佈局**：兩欄式 (左側 Sidebar 250px | 右側 Main Content 自適應) 或三欄式 (右側可能還有廣告或推薦，但在截圖中主要為深藍色背景空間)。
- [ ] **Sidebar 實作**：條列式選單，Hover 效果。

### Phase 3: 核心功能開發 (Features)
- [ ] **資料模擬 (Mock Data)**：
    - 在 JS 中建立 `posts` 陣列，包含不同看板 (感情、淡江大學、研究所) 的文章資料。
    - 建立 `forums` 陣列，定義追蹤的看板。
- [ ] **文章列表渲染**：
    - 預設顯示 "All" 分頁，渲染所有文章。
    - 實作 "Following" 分頁切換邏輯，僅篩選追蹤看板的文章。
    - 實作 Sidebar 看板過濾：點擊 "淡江大學" 僅顯示該看板文章。
- [ ] **文章詳情互動**：
    - 點擊列表中的文章卡片 -> 隱藏列表，顯示詳情視圖 (或跳轉頁面)。
    - 詳情視圖動態填入該篇文章內容 (標題、內文、留言)。
    - 實作 "返回" 按鈕回到列表。

### Phase 4: CSS 樣式優化 (Styling)
- [ ] **深色模式配色**：依照截圖調整精確的 Dcard 深藍色系。
    - Background: `#00324e` (類似)
    - Card Background: `#ffffff` (亮色卡片? 截圖中列表是白底，背景是深藍) -> *更正：截圖中最新版 Dcard 列表卡片在深色模式下通常是亮底或微灰底，需仔細觀察截圖2、3，卡片是白色的，背景是深藍色。*
- [ ] **卡片細節**：圓角、陰影、字體大小。

## 📅 預計檔案結構
```text
Week14/
  ├── index.html
  ├── styles.css
  └── script.js
```
