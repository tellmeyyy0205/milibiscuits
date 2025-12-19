import React from 'react';
import { motion } from 'framer-motion';
import { GameState } from '../types';

interface FortuneCookieProps {
  gameState: GameState;
  onClick: () => void;
}

export const FortuneCookie: React.FC<FortuneCookieProps> = ({ gameState, onClick }) => {
  const isCrack = gameState === GameState.CRACKING || gameState === GameState.OPEN || gameState === GameState.ZOOMED;
  const isZoomed = gameState === GameState.ZOOMED;

  // Variants for left half (moves left and tilts)
  const leftHalfVariants = {
    idle: { x: 0, y: 0, rotate: 0 },
    crack: { x: -40, y: 10, rotate: -15 },
  };

  // Variants for right half (moves right and tilts)
  const rightHalfVariants = {
    idle: { x: 0, y: 0, rotate: 0 },
    crack: { x: 40, y: 10, rotate: 15 },
  };

  // The jagged line path coordinates for the center seam
  // We use the same points for both sides to ensure they interlock perfectly
  // Starting from bottom (100, 180) to top (100, 20)
  const seamPath = "L 100 180 L 92 160 L 108 140 L 92 120 L 108 100 L 92 80 L 108 60 L 92 40 L 100 20";

  return (
    <div 
      className={`relative w-64 h-64 cursor-pointer transition-opacity duration-500 ${isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-105'} transition-transform`}
      onClick={gameState === GameState.IDLE ? onClick : undefined}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible drop-shadow-xl">
        <defs>
          <radialGradient id="cookieGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="#FBD38D" /> {/* Lighter center */}
            <stop offset="100%" stopColor="#F6AD55" /> {/* Darker edge */}
          </radialGradient>
        </defs>
        
        {/* Left Half */}
        <motion.g
          variants={leftHalfVariants}
          initial="idle"
          animate={isCrack ? "crack" : "idle"}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          style={{ originX: 0.5, originY: 0.5 }}
        >
          {/* Left Shape: Arc from top to bottom, then up the seam */}
          <path
            d={`M 100 20 A 80 80 0 0 0 100 180 ${seamPath} Z`}
            fill="url(#cookieGradient)"
            stroke="#C05621"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Texture Dots (Left) */}
          <circle cx="60" cy="60" r="3" fill="#9C4221" opacity="0.7" />
          <circle cx="45" cy="100" r="4" fill="#9C4221" opacity="0.7" />
          <circle cx="70" cy="130" r="3" fill="#9C4221" opacity="0.7" />
          <circle cx="85" cy="85" r="2.5" fill="#9C4221" opacity="0.7" />
        </motion.g>

        {/* Right Half */}
        <motion.g
          variants={rightHalfVariants}
          initial="idle"
          animate={isCrack ? "crack" : "idle"}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          style={{ originX: 0.5, originY: 0.5 }}
        >
          {/* Right Shape: Arc from top to bottom, then up the seam */}
          <path
            d={`M 100 20 A 80 80 0 0 1 100 180 ${seamPath} Z`}
            fill="url(#cookieGradient)"
            stroke="#C05621"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Texture Dots (Right) */}
          <circle cx="140" cy="70" r="4" fill="#9C4221" opacity="0.7" />
          <circle cx="120" cy="110" r="3" fill="#9C4221" opacity="0.7" />
          <circle cx="155" cy="120" r="2.5" fill="#9C4221" opacity="0.7" />
          <circle cx="130" cy="45" r="3" fill="#9C4221" opacity="0.7" />
        </motion.g>
      </svg>
    </div>
  );
};
