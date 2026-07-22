# Hangout 數位課程與互動講義庫

本儲存庫 (Repository) 為一系列數位實戰課程的 HTML 互動講義與實作手冊，支援直接發布至 **GitHub Pages** 成為靜態網頁。

---

## 📚 課程目錄

| 課程名稱 | 資料夾路徑 | 上線網址路徑 | 說明 |
| :--- | :--- | :--- | :--- |
| **產品工作術：建立數位團隊的產品思維** | [`/product-framework`](./product-framework/) | `./product-framework/index.html` | 4 小時 GOAL Framework 實戰課程 |

---

## 🔒 方案 B 內容加密與安全說明

本專案採用 **Web Crypto API (AES-GCM 256-bit + PBKDF2)** 進行前端內容加密保護：
* **程式碼數據保密**：GitHub 上發布的講義數據檔 (`data/course-payload.js`) 均為加密 Base64 亂碼字串，未授權人員無法直接存取講義明文。
* **學員通關體驗**：學員於課堂輸入解密密碼（預設 `pf2026`）後，瀏覽器會在記憶體中自動解密並渲染講義內容與實作畫布。
* **狀態持續**：解密金鑰緩存於 `sessionStorage`，4 小時課程期間切換模組頁面無需重複輸入密碼。

---

## 🛠️ 講師工具：如何加密新講義？

如果您修改了大綱或欲調整上課密碼：
1. 本地直接雙擊開啟 `product-framework/tools/encrypt-tool.html`。
2. 設定您的上課密碼（如 `pf2026`）並輸入講義 JSON 內容。
3. 點擊「🔐 開始加密」，複製產生的程式碼取代 `product-framework/data/course-payload.js` 的內容即可。

---

## 🚀 GitHub Pages 部署步驟

1. 將整個 `hangout` 專案推送到您的 GitHub 儲存庫：
   ```bash
   git add .
   git commit -m "Initial commit for product-framework courseware"
   git push origin main
   ```
2. 在 GitHub 專案頁面點擊 **Settings** ➔ **Pages**。
3. 在 Source 選擇 `Deploy from a branch` ➜ Branch 選擇 `main` ➜ `/ (root)` ➜ 點擊 **Save**。
4. 數分鐘後，您的靜態講義網站即可於 `https://<your-username>.github.io/hangout/` 上線！
