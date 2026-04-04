import { signInWithPopup } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import React from "react";
import { auth, provider } from "../firebase";
import axios from "axios";
import { serverURL } from "../App";
import { useDispatch } from "react-redux";
import { setuserData } from "../redux/userSlice";
const LoginModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { data } = await axios.post(
        `${serverURL}/api/auth/google`,
        {
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
        },
        { withCredentials: true },
      );
      dispatch(setuserData(data));
      window.location.reload();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-xl px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => onClose()}
        >
          <motion.div
            initial={{ scale: 0.88, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 30, opacity: 0 }}
            className="relative w-full max-w-md p-px rounded-3xl bg-linear-to-br
        from-purple-500/40 via-blue-500/30 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-3xl bg-[#0b0b0b] border border-white/10 shadow-gray-400 overflow-hidden">
              <button
                className="absolute top-5 right-5 z-20 text-zinc-400 hover:text-white transition text-lg"
                onClick={onClose}
              >
                X
              </button>
              <div className="relative px-8 pt-14 pb-10 text-center">
                <h1 className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
                  AI Powered Website builder
                </h1>
                <h2 className="text-3xl font-semibold leading-tight mb-3 space-x-2 ">
                  <span>Welcome</span>
                  <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    SiteForage
                  </span>
                </h2>
                <motion.button
                  onClick={handleGoogleAuth}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="group cursor-pointer relative w-full h-13 rounded-xl bg-white text-black font-semibold shadow-xl overflow-hidden"
                >
                  <div className="flex justify-center items-center gap-5">
                    <img
                      className="w-5 h-5"
                      src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
                      alt=""
                    />
                    Continue with Google
                  </div>
                </motion.button>
                <div className="flex items-center gap-4 my-10">
                  <div className="h-px flex-1 bg-white/10"></div>
                  <span className="text-xs text-zinc-500 tracking-wide">
                    Secure Login
                  </span>
                  <div className="h-px flex-1 bg-white/10"></div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  By Continuing, you agree to our{" "}
                  <span className="cursor-pointer underline hover:text-zinc-300 ">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="cursor-pointer underline hover:text-zinc-300 ">
                    Privacy and Policy
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
