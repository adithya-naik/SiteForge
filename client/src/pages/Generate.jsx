import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { serverURL } from "../App";

const Generate = () => {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateWebsite = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(""); // clear previous errors

    try {
      const result = await axios.post(
        `${serverURL}/api/website/generate`,
        { prompt },
        { withCredentials: true }
      );

      const websiteId = result.data?.websiteId;

      if (!websiteId) {
        throw new Error("Invalid response from server");
      }

      // ✅ Navigate to editor
      navigate(`${serverURL}/editor/${websiteId}`);
    } catch (err) {
      console.log(err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate website. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            className="p-2 rounded-lg hover:bg-white/10 transition"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-semibold">SiteForge</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Build Websites with{" "}
            <span className="block bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Real AI Power
            </span>
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto">
            This process may take several minutes. SiteForge focuses on quality, not shortcuts.
          </p>
        </motion.div>

        {/* Prompt */}
        <div className="mb-10">
          <h1 className="text-xl font-semibold mb-2">Describe your website</h1>

          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            placeholder="Describe your website in detail...."
            className="w-full mt-4 h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-white/10"
          />

          {/* 🔥 ERROR MESSAGE */}
          {error && (
            <div className="mt-5 max-w-xl mx-auto text-center px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Button */}
        <div className="flex flex-col items-center gap-3">
          <motion.button
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.96 } : {}}
            disabled={loading || !prompt.trim()}
            onClick={handleGenerateWebsite}
            className="px-8 py-3 rounded-2xl font-semibold text-lg bg-white text-black flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Generating...
              </>
            ) : (
              "Generate Website"
            )}
          </motion.button>

          {/* 🔁 Retry */}
          {error && !loading && (
            <button
              onClick={handleGenerateWebsite}
              className="text-sm text-zinc-300 underline hover:text-white"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generate;