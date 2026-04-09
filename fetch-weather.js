// scripts/fetch-weather.js
// 每小時由 GitHub Actions 執行，抓取台北天氣並存入 data/

const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_DIR = path.join(__dirname, '..', 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
const LATEST_FILE = path.join(DATA_DIR, 'latest.json');

// Open-Meteo 天氣代碼對應中文
const WEATHER_CODE_MAP = {
  0: '晴天', 1: '晴天', 2: '多雲', 3: '陰天',
  45: '有霧', 48: '有霧',
  51: '毛毛雨', 53: '毛毛雨', 55: '毛毛雨',
  61: '小雨', 63: '中雨', 65: '大雨',
  71: '小雪', 73: '中雪', 75: '大雪',
  80: '陣雨', 81: '陣雨', 82: '大陣雨',
  95: '雷陣雨', 96: '雷陣雨', 99: '雷陣雨'
};

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function toTaipeiISO() {
  return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Taipei' }).replace(' ', 'T');
}

async function main() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  const url = process.env.OPEN_METEO_URL;
  console.log('抓取天氣資料中...');
  const raw = await fetch(url);

  const c = raw.current;
  const record = {
    timestamp: toTaipeiISO(),
    temperature: c.temperature_2m,
    humidity: c.relative_humidity_2m,
    wind_speed: c.wind_speed_10m,
    weather_code: c.weather_code,
    condition: WEATHER_CODE_MAP[c.weather_code] || '未知',
  };

  console.log(`紀錄：${record.timestamp} | ${record.temperature}°C | ${record.condition}`);

  // 寫入 latest.json（只存最新一筆）
  fs.writeFileSync(LATEST_FILE, JSON.stringify(record, null, 2), 'utf8');

  // 讀取舊的 history.json（若不存在就空陣列）
  let history = [];
  if (fs.existsSync(HISTORY_FILE)) {
    try { history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')); }
    catch (e) { console.warn('history.json 讀取失敗，重新建立'); }
  }

  // 加入新紀錄，只保留最近 720 筆（30天 × 24小時）
  history.push(record);
  if (history.length > 720) history = history.slice(-720);

  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
  console.log(`✅ 已儲存，目前共 ${history.length} 筆紀錄`);
}

main().catch(err => {
  console.error('❌ 錯誤：', err);
  process.exit(1);
});
