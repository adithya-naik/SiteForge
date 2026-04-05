import { ArrowLeft, Plus } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useState } from "react";
import axios from "axios";
import { serverURL } from "../App";
const Generate = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const handleGenerateWebsite = async () => {
    try {
      const result = await axios.post(
        `${serverURL}/api/website/generate`,
        {
          prompt,
        },
        { withCredentials: true },
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={16}></ArrowLeft>
            </button>
            <h1 className="text-lg font-semibold">SiteForage</h1>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Build Websites with{" "}
            <span className="block bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Real AI Power
            </span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            This process may take several minutes. SiteForage focuses on
            quality, not shortcuts.
          </p>
        </motion.div>

        {/*Promt bar  */}
        <div className="mb-14">
          <h1 className="text-xl font-semibold mb-2">Describe your website</h1>
          <div className="relative">
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder="Describe your website in detail...."
              className="w-full mt-4 h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-white/10"
            ></textarea>
          </div>
        </div>
        {/* Generate Button */}
        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ sclae: 0.96 }}
            onClick={handleGenerateWebsite}
            className="px-8 py-2 rounded-2xl font-semibold text-lg bg-white text-black"
          >
            Generate Website
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Generate;
