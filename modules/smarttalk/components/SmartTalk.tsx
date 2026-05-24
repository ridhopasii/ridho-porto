"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FaPaperPlane, FaRobot, FaUser, FaRegQuestionCircle } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { id: 1, text: "Siapa Ridho Robbi Pasi?", label: "Siapa Ridho?" },
  { id: 2, text: "Apa saja keahlian dan teknologi utama yang dikuasai Ridho?", label: "Keahlian Utama" },
  { id: 3, text: "Ceritakan tentang proyek portofolio terbaik yang dibangun Ridho.", label: "Proyek Terbaik" },
  { id: 4, text: "Bagaimana cara merekrut atau menghubungi Ridho?", label: "Hubungi Ridho" },
];

const SmartTalk = () => {
  const t = useTranslations("SmartTalkPage");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setErrorMsg(null);

    try {
      const chatHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/smart-talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mendapatkan respon.");
      }

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("AI Chat error:", error);
      setErrorMsg(t("error") || "AI saat ini tidak tersedia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Premium Glassmorphic Chat Container */}
      <div className="flex h-[600px] flex-col rounded-3xl border border-neutral-200/60 bg-white/70 shadow-xl backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-900/60">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-neutral-200/50 px-6 py-4 dark:border-neutral-800/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <FaRobot size={18} />
          </div>
          <div>
            <h3 className="font-bold text-neutral-800 dark:text-neutral-100">Smart Talk Assistant</h3>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Online & Ready
            </span>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto">
              <div className="rounded-full bg-neutral-100 p-4 dark:bg-neutral-800 animate-bounce">
                <FaRobot size={36} className="text-blue-500" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                  Tanya apa saja tentang Ridho!
                </h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                  Asisten AI ini dilatih khusus untuk mempresentasikan portofolio, keahlian, pengalaman, dan filosofi kerja Ridho Robbi Pasi.
                </p>
              </div>

              {/* Quick Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-4">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handleSend(prompt.text)}
                    className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-left rounded-2xl border border-neutral-200 bg-white hover:border-blue-500 hover:bg-blue-50/10 text-neutral-600 hover:text-blue-600 transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-blue-400 dark:hover:text-blue-400 shadow-sm"
                  >
                    <FaRegQuestionCircle size={14} className="flex-shrink-0 text-blue-500 dark:text-blue-400" />
                    <span>{prompt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  } animate-[fadeIn_0.3s_ease-out]`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${
                      msg.role === "user"
                        ? "bg-neutral-800 dark:bg-neutral-700"
                        : "bg-gradient-to-tr from-blue-500 to-indigo-600"
                    }`}
                  >
                    {msg.role === "user" ? <FaUser size={12} /> : <FaRobot size={12} />}
                  </div>

                  {/* Bubble */}
                  <div className="space-y-1">
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-neutral-100 text-neutral-800 rounded-tl-none dark:bg-neutral-800 dark:text-neutral-100 border border-neutral-200/30 dark:border-neutral-700/30"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-100">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                    <span className="block text-[9px] text-neutral-400 dark:text-neutral-500 px-1 text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Loading Typing Indicator */}
              {loading && (
                <div className="flex gap-3 max-w-[80%] mr-auto animate-pulse">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white">
                    <FaRobot size={12} />
                  </div>
                  <div className="rounded-2xl bg-neutral-100 px-4 py-3 rounded-tl-none dark:bg-neutral-800 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs font-semibold text-red-500 dark:text-red-400 max-w-md mx-auto text-center">
                  {errorMsg}
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2 border-t border-neutral-200/50 p-4 dark:border-neutral-800/50"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan sesuatu tentang Ridho..."
            disabled={loading}
            className="flex-1 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm text-neutral-800 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-blue-400 dark:focus:bg-neutral-900"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none hover:bg-blue-700"
          >
            <FaPaperPlane size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SmartTalk;
