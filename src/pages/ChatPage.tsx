import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import Header from "../components/Header";

// Upgraded Typewriter with Block Cursor and line-break support
const Typewriter = ({ text, delay = 15 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);

  return (
    <div className="relative inline-block w-full">
      {/* whitespace-pre-wrap is the MAGIC class that fixes your line breaks! */}
      <span className="whitespace-pre-wrap break-words">{displayedText}</span>
      {/* Movie-style solid block cursor that blinks */}
      <span className="animate-pulse inline-block w-2.5 h-4 bg-emerald-500 ml-1 align-middle opacity-80"></span>
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, input]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { role: "user", content: input, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await api.post("/chat", {
        message: input,
        conversationId,
      });

      setConversationId(res.data.conversationId);
      const aiMsg = { role: "ai", content: res.data.reply, id: Date.now() + 1 };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "ERROR: [SYS_FAIL] Core connection severed.", id: Date.now() + 1 },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    // Added CRT glow text-shadow for that cinematic hacker vibe
    <div className="flex flex-col h-screen bg-[#050505] text-sm font-mono text-emerald-500 selection:bg-emerald-500 selection:text-black">
      <Header />

      {/* Main Terminal Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
        style={{ textShadow: "0 0 5px rgba(16, 185, 129, 0.4)" }} // CRT Phosphor Glow
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col space-y-1 w-full max-w-4xl"
            >
              <div className="flex items-start w-full">
                <span className={m.role === "user" ? "text-blue-400 mr-3 shrink-0" : "text-emerald-400 mr-3 shrink-0"}>
                  {m.role === "user" ? "user@local:~$" : "root@sys:~#"}
                </span>
                
                <div className="flex-1 leading-relaxed tracking-wide">
                  {m.role === "ai" ? (
                    <Typewriter text={m.content} />
                  ) : (
                    <span className="whitespace-pre-wrap">{m.content}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Cinematic Loading Sequence */}
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex items-center text-emerald-400 opacity-70"
          >
            <span className="mr-3 shrink-0">root@sys:~#</span>
            <span className="flex gap-2 items-center">
              <span>Decryption in progress</span>
              <span className="w-1.5 h-1.5 bg-emerald-400 animate-ping"></span>
            </span>
          </motion.div>
        )}
      </div>

      {/* Input Section */}
      <div className="border-t border-emerald-900/30 p-4 bg-black/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center group">
          <span className="text-emerald-500 mr-3 font-bold animate-pulse">
            ►
          </span>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter execution command..."
            className="flex-1 bg-transparent outline-none text-emerald-400 placeholder-emerald-800/50 caret-transparent"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            autoComplete="off"
            spellCheck="false"
          />
          {/* Custom Input Cursor */}
          <span className={`w-2.5 h-4 bg-emerald-500 align-middle ${input ? 'hidden' : 'animate-pulse'}`}></span>
        </div>
      </div>
    </div>
  );
};

export default Chat;