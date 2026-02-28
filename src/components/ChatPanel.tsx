import { useState, useRef, useEffect } from "react";
import { Send, Heart, User } from "lucide-react";

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "init-1",
    role: "assistant",
    text: "Bonjour ! 👋 Je suis là pour vous aider à comprendre votre rapport médical. Chargez votre document à gauche, puis posez-moi toutes vos questions ici. Je vous explique tout simplement !",
  },
];

const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: "C'est une très bonne question ! Dans cette démo, la réponse viendrait de l'analyse de votre rapport. N'hésitez pas à me poser d'autres questions 😊",
        },
      ]);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/60 bg-gm-gradient relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary-foreground/10 blur-xl" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-primary-foreground/5 blur-lg" />
        <div className="relative">
          <h2 className="text-sm font-display font-semibold text-primary-foreground tracking-wide flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Votre assistant santé
          </h2>
          <p className="text-xs text-primary-foreground/70 mt-1">
            Posez vos questions, je vous explique simplement.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-gm-gradient-soft">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 animate-float-up ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                msg.role === "assistant"
                  ? "bg-secondary text-secondary-foreground shadow-gm-soft"
                  : "bg-gm-gradient text-primary-foreground shadow-gm"
              }`}
            >
              {msg.role === "assistant" ? <Heart className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "rounded-2xl rounded-tl-md bg-card border border-border/60 text-foreground shadow-gm-soft"
                  : "rounded-2xl rounded-tr-md bg-gm-gradient text-primary-foreground shadow-gm"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border/60 bg-card">
        <div className="flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:border-primary/50 focus-within:shadow-gm transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question ici…"
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[40px] max-h-[120px] py-2"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-lg bg-gm-gradient text-primary-foreground flex items-center justify-center flex-shrink-0 hover:scale-105 hover:shadow-gm-lg active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
