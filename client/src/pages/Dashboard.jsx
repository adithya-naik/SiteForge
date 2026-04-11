import { ArrowLeft, Plus, Rocket, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../App";

function Dashboard() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [websites, setWebsites] = useState(null);
  const [Lloading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handlegetAllWebsites = async () => {
      setLoading(true);
      try {
        const result = await axios.get(`${serverURL}/api/website/get-all`, {
          withCredentials: true,
        });
        console.log(result.data);
        setWebsites(result.data || []);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error.response.data.message);
        setLoading(false);
      }
    };

    handlegetAllWebsites();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
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

            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>

          <button
            className="px-4 py-2 flex items-center gap-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition"
            onClick={() => navigate("/generate")}
          >
            <Plus size={16} /> New Generate
          </button>
        </div>
      </div>

      {/* Greeting */}
      <div className="max-w-7xl mx-auto px-6 py-10 ">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-sm text-zinc-400 mb-1">Welcome back, </p>
          <h1 className="text-3xl font-bold">{userData.name}</h1>
        </motion.div>

        {Lloading && (
          <div className="mt-24 text-center text-zinc-400">
            Loading your websites....
          </div>
        )}
        {error && !Lloading && (
          <div className="mt-24 text-center text-red-400">
            Error in Loading your websites....
          </div>
        )}

        {websites?.length == 0 && (
          <div className="mt-24 text-center text-zinc-400">
            You have no Websites
          </div>
        )}

        {!Lloading && !error && websites?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {websites?.map((w, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition flex flex-col"
              >
                {/* Preview */}
                <div className="relative h-40 bg-black cursor-pointer">
                  <iframe
                    srcDoc={w.latestCode}
                    className="absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
                  ></iframe>

                  <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* 🔥 CONTENT (FIXED POSITION) */}
                <div className="p-5 flex flex-col gap-2">
                  <h3 className="text-base font-semibold line-clamp-2">
                    {w.title}
                  </h3>

                  <p className="text-xs text-zinc-400">
                    Last Updated {new Date(w.updatedAt).toLocaleDateString()}
                  </p>

                  {!w.deployed ? (
                    <button className="mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 hover:scale-105 transition">
                      <Rocket size={18} /> Deploy{" "}
                    </button>
                  ) : (
                    <button>
                      <Share2 /> Share Link
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
