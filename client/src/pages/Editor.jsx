import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { serverURL } from "../App";
import { Code2, Monitor, Rocket, Send } from "lucide-react";

const Editor = () => {
  const { id } = useParams();
  const [website, setWebsite] = useState(null);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const iframeRef = useRef(null);
  const messagesEndRef = useRef(null);

  const thinkingSteps = [
    "Understanding your request...",
    "Analyzing requirements...",
    "Designing UI structure...",
    "Generating components...",
    "Connecting backend logic...",
    "Optimizing performance...",
    "Finalizing your website...",
  ];

  // ✅ Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentStep]);

  // ✅ Controlled step animation (NO SKIPPING)
  useEffect(() => {
    if (!updateLoading) return;

    let step = 0;
    setCurrentStep(0);

    const interval = setInterval(() => {
      step++;

      setCurrentStep((prev) => {
        if (step >= thinkingSteps.length) {
          clearInterval(interval);
          return prev;
        }
        return step;
      });
    }, 1000); // ⏳ perfect speed

    return () => clearInterval(interval);
  }, [updateLoading]);

  // ✅ Handle Update (FIXED)
  const handleUpdate = async () => {
    if (!prompt.trim()) return;

    const userPrompt = prompt; // ✅ capture safely
    setPrompt(""); // ✅ clear instantly

    setCurrentStep(0);
    setUpdateLoading(true);

    setMessages((m) => [...m, { role: "user", content: userPrompt }]);

    try {
      const [result] = await Promise.all([
        axios.post(
          `${serverURL}/api/website/update/${id}`,
          { prompt: userPrompt },
          { withCredentials: true }
        ),
        new Promise((res) => setTimeout(res, 5000)),
      ]);

      setMessages((m) => [
        ...m,
        { role: "ai", content: result.data.message },
      ]);

      setCode(result.data.code);
    } catch (error) {
      console.log(error);
    } finally {
      setUpdateLoading(false);
    }
  };

  // ✅ Load website
  useEffect(() => {
    const handlegetWebsite = async () => {
      try {
        const result = await axios.get(
          `${serverURL}/api/website/get-by-id/${id}`,
          { withCredentials: true }
        );
        setWebsite(result.data);
        setCode(result.data.latestCode);
        setMessages(result.data.conversation);
      } catch (err) {
        setError(err.response?.data?.message);
      }
    };

    if (id) handlegetWebsite();
  }, [id]);

  // ✅ Render iframe safely
  useEffect(() => {
    if (!iframeRef.current || !code) return;

    const fixCode = (html) => {
      const scriptRegex = /<script(\s[^>]*)?>[\s\S]*?<\/script>/gi;
      const scripts = [];

      const stripped = html.replace(scriptRegex, (match) => {
        if (/src\s*=/i.test(match)) return match;
        scripts.push(match);
        return "";
      });

      const injected = stripped.replace(
        /<\/body>/i,
        `${scripts.join("\n")}</body>`
      );

      return injected.includes("</body>")
        ? injected
        : stripped + scripts.join("\n");
    };

    const blob = new Blob([fixCode(code)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;

    return () => URL.revokeObjectURL(url);
  }, [code]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-400">
        {error}
      </div>
    );
  }

  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-black text-white overflow-hidden">
      
      {/* Sidebar */}
      <aside className="hidden lg:flex w-[380px] flex-col border-r border-white/10 bg-black/80">
        <Header />

        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] ${
                  msg.role === "user" ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-white text-black"
                      : "bg-white/5 border border-white/10 text-zinc-200"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* 🔥 THINKING STEPS */}
            {updateLoading && (
              <div className="max-w-[85%] mr-auto">
                <div className="px-4 py-3 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400">
                  {thinkingSteps
                    .slice(0, currentStep + 1)
                    .map((step, i) => (
                      <div key={i}>
                        {i === currentStep ? "⏳" : "✔️"} {step}
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                placeholder="Describe changes ...."
                className="flex-1 rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                className="px-4 py-3 rounded-2xl bg-white text-black"
                disabled={updateLoading}
                onClick={handleUpdate}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Preview */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 px-4 flex justify-between items-center border-b border-white/10">
          <span className="text-xs text-zinc-400">Live Preview</span>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold">
              <Rocket size={18} /> Deploy
            </button>
            <button className="p-2">
              <Code2 size={18} />
            </button>
            <button className="p-2">
              <Monitor size={18} />
            </button>
          </div>
        </div>

        <iframe ref={iframeRef} className="flex-1 w-full bg-white" />
      </div>
    </div>
  );

  function Header() {
    return (
      <div className="h-14 px-4 flex items-center border-b border-white/10">
        <span className="font-semibold truncate">{website.title}</span>
      </div>
    );
  }
};

export default Editor;