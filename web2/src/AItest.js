import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useEffect, useMemo, useRef, useState } from "react";

const systemPromptMap = {
  psychology: "我是心理輔助小幫手，能傾聽你的心情、給予鼓勵與建議，但不取代專業心理醫師。",
  hobby: "我是個人興趣助理，能給你音樂推薦、鉤織技巧或K-POP討論。",
  coding: "我是程式開發小能手，可以幫你寫程式、除錯、解釋程式邏輯。",
};

const quickExamplesMap = {
  psychology: [
    "我今天心情不好，該怎麼調整？",
    "最近壓力很大，有什麼紓壓方法嗎？",
    "我需要一些鼓勵，請給我正能量。",
  ],
  hobby: [
    "幫我推薦一些最近好聽的K-POP歌曲。",
    "有哪些簡單的鉤織技巧可以學？",
    "你知道哪個韓團最近出新專輯嗎？",
  ],
  coding: [
    "請用 React 寫一個簡單計算器",
    "這段 Python 程式為什麼會報錯？",
    "如何使用 JavaScript 做表單驗證？",
  ],
};

export default function AItest({
  defaultModel = "gemini-2.0-flash",
  starter = "嗨！請在這裡輸入問題～",
}) {
  const [model, setModel] = useState(defaultModel);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [rememberKey, setRememberKey] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);
  const [scenario, setScenario] = useState("cloth");

  // 讀取 localStorage 的 API Key
  useEffect(() => {
    const saved = localStorage.getItem("gemini_api_key");
    if (saved) setApiKey(saved);
  }, []);

  // 初始訊息
  useEffect(() => {
    setHistory([
      {
        role: "model",
        parts: [{ text: "這裡是AI小助手，有什麼想聊的？" }],
        time: new Date().toLocaleTimeString(),
      },
    ]);
    if (starter) setInput(starter);
  }, [starter]);

  // 自動滾動
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [history, loading]);

  // 初始化 Gemini
  const ai = useMemo(() => {
    try {
      return apiKey ? new GoogleGenerativeAI(apiKey) : null;
    } catch {
      return null;
    }
  }, [apiKey]);

  // 新增 system 訊息
  function addSystemMessage(scenarioName) {
    const prompt = systemPromptMap[scenarioName];
    const msg = {
      role: "system",
      parts: [{ text: prompt }],
      time: new Date().toLocaleTimeString(),
    };
    setHistory((h) => [...h, msg]);
  }

  // 🧠 傳送訊息給 Gemini
  async function sendMessage(message) {
    const content = (message ?? input).trim();
    if (!content || loading) return;
    if (!ai) {
      setError("請先輸入有效的 Gemini API Key");
      return;
    }

    console.log("✅ Gemini API Key:", apiKey);

    setError("");
    setLoading(true);

    const userMsg = {
      role: "user",
      parts: [{ text: content }],
      time: new Date().toLocaleTimeString(),
    };

    setHistory((h) => [...h, userMsg]);
    setInput("");

try {
  const systemText = systemPromptMap[scenario] || "你是一個親切的AI助手。";
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `${systemText}\n\n使用者問題：${content}`,
        },
      ],
    },
  ];

  console.log("Sending to Gemini API:", contents);

  const genModel = ai.getGenerativeModel({ model });
  const result = await genModel.generateContent({ contents });
  console.log("Gemini API response:", result);

  const replyText = result.response.text() || "[No content]";

  const reply = {
    role: "model",
    parts: [{ text: replyText }],
    time: new Date().toLocaleTimeString(),
  };
  setHistory((h) => [...h, reply]);

    } catch (err) {
      console.error("⚠ Gemini API Error:", err);
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  // --- UI 樣式 ---
  const styles = {
    wrap: {
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      background: "#f0f4f8",
      marginTop: "auto",
    },
    sidebar: {
      width: 300,
      background: "#fff",
      borderRight: "2px solid #e0e0e0",
      padding: 20,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    },
    chatArea: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "#f9fafb",
      padding: 16,
    },
    header: { fontSize: 18, fontWeight: 700, marginBottom: 12, color: "#1e3a8a" },
    label: {
      display: "flex",
      flexDirection: "column",
      fontSize: 14,
      fontWeight: 600,
      marginBottom: 10,
    },
    input: {
      padding: "6px 8px",
      borderRadius: 6,
      border: "1px solid #ccc",
      fontSize: 14,
    },
    messages: {
      flex: 1,
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      padding: 12,
      background: "#f8fafc",
      borderRadius: 12,
      border: "1px solid #e2e8f0",
    },
    composer: {
      display: "flex",
      gap: 8,
      padding: 8,
      borderTop: "1px solid #ccc",
      background: "#f1f5f9",
      borderRadius: 12,
      marginTop: 12,
    },
    textInput: {
      flex: 1,
      padding: "8px 10px",
      borderRadius: 12,
      border: "1px solid #94a3b8",
    },
    sendBtn: {
      padding: "8px 12px",
      borderRadius: 12,
      border: "none",
      background: "#2563eb",
      color: "#fff",
      cursor: "pointer",
    },
    clearBtn: {
      marginTop: 12,
      padding: "8px 10px",
      borderRadius: 8,
      border: "1px solid #facc15",
      background: "#fef9c3",
      cursor: "pointer",
      color: "#7c6f00",
      fontWeight: 600,
    },
    quickExamples: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginTop: 10,
    },
    suggestion: {
      padding: "6px 10px",
      borderRadius: 12,
      border: "1px solid #93c5fd",
      cursor: "pointer",
      background: "#dbeafe",
      color: "#1e3a8a",
    },
    spinner: {
      width: 24,
      height: 24,
      border: "3px solid #ccc",
      borderTop: "3px solid #2563eb",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 6px",
    },
    error: { color: "#b91c1c", marginTop: 6 },
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={styles.wrap}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.header}>⚙️ 設定區</div>

          <label style={styles.label}>
<select
  value={scenario}
  onChange={(e) => {
    const val = e.target.value;
    setScenario(val);
    addSystemMessage(val);
  }}
  style={styles.input}
>
  <option value="psychology">情緒 / 心理輔助助手</option>
  <option value="hobby">興趣 / 專屬話題助手</option>
  <option value="coding">程式開發助理</option>
</select>
          </label>

          <label style={styles.label}>
            Model
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="例如 gemini-2.0-flash"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Gemini API Key
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                const v = e.target.value;
                setApiKey(v);
                if (rememberKey) localStorage.setItem("gemini_api_key", v);
              }}
              placeholder="貼上你的 API Key"
              style={styles.input}
            />
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 6,
                fontSize: 12,
              }}
            >
              <input
                type="checkbox"
                checked={rememberKey}
                onChange={(e) => {
                  setRememberKey(e.target.checked);
                  if (!e.target.checked) localStorage.removeItem("gemini_api_key");
                  else if (apiKey) localStorage.setItem("gemini_api_key", apiKey);
                }}
              />
              <span>記住在本機（localStorage）</span>
            </label>
          </label>

          <button onClick={() => setHistory([])} style={styles.clearBtn}>
            🧹 清除對話
          </button>
        </div>

        {/* 聊天區 */}
        <div style={styles.chatArea}>
          <div style={styles.header}>💬 AI 聊天</div>

          <div ref={listRef} style={styles.messages}>
            {history.map((msg, i) => {
              const isUser = msg.role === "user";
              const isSystem = msg.role === "system";
              const bg = isUser
                ? "#fff8e1"
                : isSystem
                ? "#e3f2fd"
                : "#bbdefb";
              const borderColor = isUser
                ? "#fdd835"
                : isSystem
                ? "#64b5f6"
                : "#42a5f5";
              const align = isUser ? "flex-end" : "flex-start";
              const label = isUser ? "You" : isSystem ? "System" : "Gemini";

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: align,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      background: bg,
                      padding: "10px 14px",
                      borderRadius: 16,
                      maxWidth: "70%",
                      border: `2px solid ${borderColor}`,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      {label}
                    </div>
                    <div>{msg.parts[0].text}</div>
                    <div
                      style={{
                        fontSize: 12,
                        textAlign: "right",
                        color: "#555",
                        marginTop: 4,
                      }}
                    >
                      {msg.time || new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ textAlign: "center", color: "#666", marginTop: 8 }}>
                <div style={styles.spinner}></div>
                Gemini 正在思考中...
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            style={styles.composer}
          >
            <input
              placeholder="輸入訊息，按 Enter 送出"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.textInput}
            />
            <button
              type="submit"
              disabled={loading || !input.trim() || !apiKey}
              style={styles.sendBtn}
            >
              送出
            </button>
          </form>

          <div style={styles.quickExamples}>
            {(quickExamplesMap[scenario] || []).map((q) => (
              <button
                key={q}
                type="button"
                style={styles.suggestion}
                onClick={() => sendMessage(q)}
              >
                {q}
              </button>
            ))}
          </div>

          {error && <div style={styles.error}>⚠ {error}</div>}
        </div>
      </div>
    </>
  );
}
