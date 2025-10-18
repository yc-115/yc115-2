這是一個整合 React、Gemini API 以及個人靜態網站的專案，旨在提供個性化的 AI 助手體驗。使用者可以選擇不同的情境（如心理輔助、興趣探索、程式開發）與 AI 助手互動，獲得建議、鼓勵或技術支援。

⚙️ 使用的技術與 API

前端框架：React

後端 API：Google Gemini API（用於生成文字回應）

其他技術：HTML、CSS、JavaScript（整合靜態網站）

🛠️ 安裝與執行方式

下載專案
<pre>git clone https://github.com/yc-115/yc115-2
cd yc115-2</pre>

安裝相依套件

<pre>npm install</pre>


啟動開發伺服器

<pre>npm start</pre>

預設會在 http://localhost:3000
 開啟應用程式。

設定 Gemini API 金鑰

前往 Google AI Studio
 申請 API 金鑰。

在專案根目錄下建立 .env 檔案，並加入以下內容：

<pre>REACT_APP_GEMINI_API_KEY=你的_API_金鑰</pre>

🎬 Demo 影片

請參考以下影片，了解專案的功能與操作：

👉 專案說明影片

📸 範例截圖

首頁介面

AI 聊天區

📝 注意事項

請確保已正確設定 Gemini API 金鑰，否則無法正常使用 AI 生成服務。

若遇到任何問題，歡迎在 GitHub 提出 Issues，我會盡快回應。
