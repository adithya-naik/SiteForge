import React, { useState } from "react";
import { motion } from "motion/react";
import LoginModal from "../components/LoginModal";

const Home = () => {
  const [openLogin, setOpenLogin] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#040404] text-white overflow-hidden">
      {/* Navbar */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-lg font-semibold">SiteForage</div>
          <div className="flex items-center gap-5 ">
            <div className="hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer">
              Pricing
            </div>
            <button
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm cursor-pointer"
              onClick={() => setOpenLogin(true)}
            >
              Get Started
            </button>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="pt-44 pb-32 px-6 text-center min-h-[calc(100vh-80px)]">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          Build Stunning Websites
          <p className="bg-linear-to-r from-purple-400 to to-blue-400 bg-clip-text text-transparent">
            with AI
          </p>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 max-w-2xl mx-auto text-zinc-400 text-lg"
        >
          Describe your idea and let AI generate a
          modern,response,production-ready,auto-deployable website
        </motion.p>

        <button
          className="mt-4 px-4 py-2 rounded-xl bg-white text-black font-semibold hover:scale-105 transition cursor-pointer"
          onClick={() => setOpenLogin(true)}
        >
          Get Started
        </button>
      </section>

      <footer className="border border-white/10 py-4 flex items-center justify-center text-sm text-zinc-500">
        &copy; {new Date().getFullYear()} SiteForage
      </footer>

      {openLogin && (
        <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
      )}
    </div>
  );
};

export default Home;
