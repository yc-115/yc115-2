// ... (其他 require 模組)
const express = require('express');
const path = require('path'); // 新增 path 模組來處理路徑

const app = express();
const port = process.env.PORT || 10000; 
// ...

// *** 關鍵修改：設定靜態檔案路徑到 React 的建置資料夾 (build) ***
// 確保 Express 服務在專案根目錄下的 'build' 資料夾
app.use(express.static(path.join(__dirname, '..', 'build'))); 

// ... (API 2: /api/weather 和 API 3: /api/github 的程式碼保持不變) ...

// *** 新增：處理所有其他請求 (除了 API) 導向 React app ***
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Serving React static files from the build folder.`);
});