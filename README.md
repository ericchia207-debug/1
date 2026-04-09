# 🌤 台北 24 小時天氣紀錄

GitHub Actions 自動每小時抓取台北即時天氣，存入 repo，並透過 GitHub Pages 展示。

**資料來源：** [Open-Meteo](https://open-meteo.com/)（完全免費，不需要 API Key）

---

## 📁 專案結構

```
taipei-weather/
├── .github/
│   └── workflows/
│       └── fetch-weather.yml   ← GitHub Actions 排程
├── scripts/
│   └── fetch-weather.js        ← 抓取天氣的腳本
├── data/
│   ├── history.json            ← 歷史紀錄（最多 720 筆 / 30 天）
│   └── latest.json             ← 最新一筆紀錄
└── docs/
    └── index.html              ← 天氣展示網頁（GitHub Pages）
```

---

## 🚀 設定步驟

### 1. 建立 GitHub Repository

1. 到 [github.com](https://github.com) 建立新的 **public** repository
2. 把這個專案的所有檔案上傳（或 `git push`）

### 2. 開啟 GitHub Pages

1. 進入 repo → **Settings** → **Pages**
2. Source 選擇 **Deploy from a branch**
3. Branch 選 `main`，資料夾選 `/docs`
4. 按 **Save**

幾分鐘後網頁就會在 `https://你的帳號.github.io/台北天氣` 上線。

### 3. 給 Actions 寫入權限

1. 進入 repo → **Settings** → **Actions** → **General**
2. 往下找到 **Workflow permissions**
3. 選擇 **Read and write permissions**
4. 按 **Save**

### 4. 手動執行一次測試

1. 進入 repo → **Actions** → **每小時抓取台北天氣**
2. 點 **Run workflow** → **Run workflow**
3. 等約 30 秒，確認執行成功
4. 回到 repo 應該可以看到 `data/history.json` 出現了

之後就會**每小時自動執行**，完全不需要你動手！

---

## 📊 紀錄的資料欄位

| 欄位 | 說明 |
|------|------|
| `timestamp` | 台北時間（ISO 格式） |
| `temperature` | 氣溫（°C） |
| `humidity` | 相對濕度（%） |
| `wind_speed` | 風速（km/h） |
| `weather_code` | Open-Meteo WMO 天氣代碼 |
| `condition` | 天氣狀況（中文） |

---

## ❓ 常見問題

**Q: Actions 沒有執行？**
確認 repo 是 public，且 Workflow permissions 已設為 read and write。

**Q: 網頁顯示「無法讀取 history.json」？**
先手動觸發一次 Actions，讓 `data/history.json` 建立起來。

**Q: 超過免費額度嗎？**
GitHub Actions 免費方案每月有 2,000 分鐘，每次執行約 20 秒，
每小時一次 × 24 × 30 = 720 次 × 20秒 ≈ 240 分鐘，遠低於限制。
