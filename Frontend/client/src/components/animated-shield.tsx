import { motion } from "framer-motion";

export function AnimatedShield() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative w-24 h-24"
    >
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        animate={{
          filter: [
            "drop-shadow(0 0 8px rgba(147, 51, 234, 0.7))",
            "drop-shadow(0 0 12px rgba(79, 70, 229, 0.8))",
            "drop-shadow(0 0 16px rgba(236, 72, 153, 0.6))"
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <motion.path
          d="M12 2L3 7V12C3 16.97 7.02 21.5 12 22C16.98 21.5 21 16.97 21 12V7L12 2Z"
          stroke="url(#gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M12 8L9 11L10.5 12.5L12 11L13.5 12.5L15 11L12 8Z"
          stroke="url(#gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        />
        <defs>
          <linearGradient id="gradient" x1="3" y1="2" x2="21" y2="22">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="50%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </motion.svg>
    </motion.div>
  );
}