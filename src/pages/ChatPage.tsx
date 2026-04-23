// src/pages/chatPage.tsx
import { useState } from "react";
import api from "../api/axios";
import Header from "../components/Header";

const Chat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");

    try {
      const res = await api.post("/chat", {
      message: input,
      conversationId,
    });

    setConversationId(res.data.conversationId);

    const aiMsg = { role: "ai", content: res.data.reply };
    setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.log("error" , error)
    }

    
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
        {messages.map((m, i) => (
          <div key={i} className="terminal-glow">
            <span className="text-blue-400">
              {m.role === "user" ? "user@local:~$" : "ai@core:~$"}
            </span>{" "}
            {m.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 p-3 flex items-center bg-black">
        <span className="text-green-400 mr-2">➜</span>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type your command..."
          className="flex-1 bg-transparent outline-none text-green-400 placeholder-gray-600"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
      </div>
    </div>
  );
};

export default Chat;