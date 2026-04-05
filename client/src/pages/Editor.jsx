import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverURL } from "../App";
import { Code2, Monitor, Rocket } from "lucide-react";
import { useRef } from "react";

const Editor = () => {
  const { id } = useParams();
  const [website, setWebsite] = useState(null);
  const [error, setError] = useState("");
  const iframeRef = useRef(null);
  useEffect(() => {
    const handlegetWebsite = async () => {
      try {
        const result = await axios.get(
          `${serverURL}/api/website/get-by-id/${id}`,
          { withCredentials: true },
        );
        setWebsite(result.data);
      } catch (err) {
        setError(err.response?.data?.message);
      }
    };

    if (id) handlegetWebsite();
  }, [id]);

  useEffect(() => {
if (!iframeRef.current || !website || !website.latestCode) return;
    const blob = new Blob([website.latestCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;

    return () => URL.revokeObjectURL(url);
  }, [website]);

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
      <aside>
        <Header></Header>
        <Chat></Chat>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80">
          <span className="text-xs text-zinc-400">Live Preview</span>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition">
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
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/10 ">
        <span className="font-semibold truncate">{website.title}</span>
      </div>
    );
  }

  function Chat() {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {website.conversation.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[85%] ${
              msg.role === "user" ? "ml-auto" : "mr-auto"
            }`}
          >
            <div
              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-white text-black"
                  : "bg-white/5 border border-white/10 text-zinc-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
    );
  }
};
export default Editor;
