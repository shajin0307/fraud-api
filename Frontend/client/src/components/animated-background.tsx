import { motion } from "framer-motion";
import { Coins, Star } from "lucide-react";

function StickFigure({ delay = 0 }) {
  return (
    <motion.div
      className="absolute text-primary/20"
      initial={{ x: -100, opacity: 0 }}
      animate={{ 
        x: ["-100%", "200%"],
        y: [0, -20, 0, -30, 0, -20, 0],
      }}
      transition={{
        x: { duration: 15, repeat: Infinity, delay },
        y: { duration: 2, repeat: Infinity },
      }}
    >
      <svg width="40" height="60" viewBox="0 0 40 60" className="glow-effect">
        <circle cx="20" cy="10" r="8" stroke="currentColor" fill="none" strokeWidth="2"/>
        <line x1="20" y1="18" x2="20" y2="40" stroke="currentColor" strokeWidth="2"/>
        <line x1="20" y1="40" x2="10" y2="60" stroke="currentColor" strokeWidth="2"/>
        <line x1="20" y1="40" x2="30" y2="60" stroke="currentColor" strokeWidth="2"/>
        <line x1="20" y1="30" x2="5" y2="20" stroke="currentColor" strokeWidth="2"/>
        <line x1="20" y1="30" x2="35" y2="20" stroke="currentColor" strokeWidth="2"/>
      </svg>
    </motion.div>
  );
}

function FloatingCoin({ delay = 0 }) {
  return (
    <motion.div
      className="absolute text-yellow-400/30"
      initial={{ y: -20, opacity: 0 }}
      animate={{ 
        y: ["0%", "100%"],
        rotate: [0, 360],
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "linear"
      }}
    >
      <Coins size={24} className="glow-effect" />
    </motion.div>
  );
}

function FloatingStar({ delay = 0 }) {
  return (
    <motion.div
      className="absolute text-purple-400/30"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{
        scale: [0.5, 1, 0.5],
        opacity: [0.2, 0.8, 0.2],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
      }}
    >
      <Star size={16} className="glow-effect" />
    </motion.div>
  );
}

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-pink-900/50">
      <style jsx global>{`
        .glow-effect {
          filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.5));
        }
      `}</style>
      {[...Array(5)].map((_, i) => (
        <StickFigure key={`figure-${i}`} delay={i * 2} />
      ))}
      {[...Array(8)].map((_, i) => (
        <FloatingCoin 
          key={`coin-${i}`} 
          delay={i * 1.5} 
        />
      ))}
      {[...Array(12)].map((_, i) => (
        <FloatingStar
          key={`star-${i}`}
          delay={i * 0.5}
        />
      ))}
    </div>
  );
}