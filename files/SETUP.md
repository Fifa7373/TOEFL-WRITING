# TOEFL Writing 工具 — GitHub + Google Sheets 設定

分兩段：**A 放上 GitHub**（網頁本身），**B 接上 Google Sheets**（資料同步）。
A 做完就能在手機開網頁；B 做完電腦手機才會共用同一份資料。

---

## A. 放上 GitHub Pages

1. 到 github.com 建一個新的 repository，名稱例如 `toefl-tracker`，選 **Public**（Pages 免費）。
2. 進入該 repo → **Add file → Upload files** → 把 `index.html` 拖進去 → **Commit changes**。
3. 進 **Settings → Pages**：
   - Source 選 **Deploy from a branch**
   - Branch 選 **main**、資料夾選 **/ (root)** → Save
4. 等 1～2 分鐘，頁面上方會出現網址：
   `https://<你的帳號>.github.io/toefl-tracker/`
5. 手機瀏覽器打開這個網址即可，建議加到主畫面。

> 之後要更新版本：把新的 `index.html` 重新上傳覆蓋（Upload files 會自動 commit），
> 手機重新整理就是新版。這就是你要的版本控制。

---

## B. 接上 Google Sheets（跨裝置同步）

1. 到 sheets.google.com 建一個新的空白試算表，命名例如 `TOEFL Writing Data`。
2. 上方選單 **擴充功能 → Apps Script**。
3. 把預設的 `Code.gs` 內容全部刪掉，貼上本專案的 `Code.gs` 全文，存檔。
4. 右上角 **部署 → 新增部署作業**：
   - 類型選 **網頁應用程式**
   - 「執行身分」選 **我**
   - 「誰可以存取」選 **任何人**（重要，否則手機讀不到）
   - 按「部署」，第一次會要求授權，一路允許
5. 複製產生的 **網頁應用程式網址**（結尾是 `/exec`）。
6. 回到你的 TOEFL 網頁 → **備份** 分頁 → 最上面「跨裝置同步」貼上該網址 → 按 **儲存並同步**。
7. 顯示「同步完成」就成功了。手機打開同一個 GitHub Pages 網址，一樣去備份分頁貼上**同一組網址**，兩邊就共用資料了。

---

## 常見狀況

- **手機顯示連不上**：多半是步驟 B-4 的「誰可以存取」沒選「任何人」。回 Apps Script 重新部署一次。
- **改了 Code.gs 之後沒生效**：Apps Script 每次改完要 **部署 → 管理部署作業 → 編輯（鉛筆）→ 版本選「新版本」→ 部署**。
- **想先確認資料在不在**：直接開那張 Google Sheet，會看到 `key` / `value` 兩欄，那就是你的資料本體。
- **同步網址填錯或想改回只存本機**：把備份分頁的網址欄位清空再按儲存即可。

---

## 資料還原

如果新環境是空的，用備份分頁下方的「還原備份」，貼上你先前匯出的 JSON
（例如 `toefl-writing-backup-2026-08-20.json` 的全文），按還原即可。
