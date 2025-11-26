// server/server.js

const express = require('express');
const path = require('path');
const app = express();

// 從環境變數中取得 Port，如果沒有則使用 10000
const port = process.env.PORT || 10000; 

// 從 Render 環境變數中取得 API Key (部署時會使用 Render 設定)
const WEATHER_API_KEY = process.env.OPENWEATHER_KEY || 'YOUR_OPENWEATHER_API_KEY_FOR_LOCAL_TEST'; 
const CITY_NAME = 'Taipei'; 
const UNITS = 'metric'; // 攝氏溫度
const GITHUB_USERNAME = 'yc-115'; // 您的 GitHub 帳號

// =========================================================
// 1. 靜態檔案服務 (讓 Express 知道哪裡是您的 HTML/CSS/JS)
// =========================================================
app.use(express.static(path.join(__dirname, '..', 'build'))); 


// =========================================================
// 2. 所有 API 路由 (確保這在萬用路由之前)
// =========================================================

// API 2: 天氣 API 
app.get('/api/weather', async (req, res) => { 
    // 檢查 API 金鑰是否已設定
    if (WEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY_FOR_LOCAL_TEST' || !WEATHER_API_KEY) {
        return res.status(500).json({ error: '請設定 OpenWeather API 金鑰。' });
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&units=${UNITS}&appid=${WEATHER_API_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            // 如果 OpenWeather 回傳錯誤，將錯誤訊息回傳
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }
        const data = await response.json();
        
        // 只回傳前端需要的資料
        res.json({
            city: data.name,
            temp: data.main.temp,
            icon: data.weather[0].icon,
            description: data.weather[0].description
        });
    } catch (error) {
        console.error('呼叫 OpenWeather 失敗:', error);
        res.status(500).json({ error: '伺服器內部錯誤，無法取得天氣資料。' });
    }
});

// API 3: GitHub API 
app.get('/api/github', async (req, res) => { 
    const url = `https://api.github.com/users/${GITHUB_USERNAME}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({ error: '無法取得 GitHub 使用者資訊。' });
        }
        const data = await response.json();
        
        // 只回傳前端需要的資料
        res.json({
            avatar_url: data.avatar_url,
            public_repos: data.public_repos,
            followers: data.followers,
            bio: data.bio
        });
    } catch (error) {
        console.error('呼叫 GitHub API 失敗:', error);
        res.status(500).json({ error: '伺服器內部錯誤，無法取得 GitHub 資料。' });
    }
});


// =========================================================
// 3. 萬用路由 (必須在所有 API 之後，最後才寫它)
// =========================================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});


// 啟動伺服器
app.listen(port, () => { 
  console.log(`Server is running on port ${port}`);
});