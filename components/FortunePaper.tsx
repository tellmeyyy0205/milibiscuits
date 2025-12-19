import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FortuneMessage, GameState } from '../types';

interface FortunePaperProps {
  fortune: FortuneMessage | null;
  gameState: GameState;
  onClick: () => void;
}

export const FortunePaper: React.FC<FortunePaperProps> = ({ fortune, gameState, onClick }) => {
  if (!fortune) return null;

  // Small strip state (inside cookie)
  const isSmall = gameState === GameState.OPEN;
  // Zoomed state (fullscreen overlay)
  const isZoomed = gameState === GameState.ZOOMED;

  return (
    <AnimatePresence>
      {(isSmall || isZoomed) && (
        <motion.div
          layoutId="fortune-paper"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={`absolute z-30 flex items-center justify-center cursor-pointer shadow-sm
            ${isZoomed 
              ? 'fixed inset-0 m-auto w-[90vw] max-w-xl h-[50vh] max-h-[400px] z-50' 
              : 'top-1/2 left-1/2 w-48 h-12'
            }`}
          initial={isSmall ? { 
            scale: 0.1, 
            opacity: 0, 
            y: 0, 
            x: "-50%" 
          } : {}}
          animate={isSmall ? { 
            scale: 1, 
            opacity: 1, 
            y: -20, // Move up slightly out of cookie
            x: "-50%",
            rotate: -2
          } : { 
            scale: 1, 
            opacity: 1, 
            y: "-50%", // Center screen
            x: "-50%",
            rotate: 0
          }}
          transition={{ 
            type: "spring", 
            stiffness: 120, 
            damping: 20,
            delay: isSmall ? 0.2 : 0
          }}
        >
          {/* The Paper Visual */}
          <div className={`relative w-full h-full bg-paper-bg border-2 border-gray-200 shadow-lg transform transition-all duration-500
            ${isZoomed ? 'rotate-0 p-8 flex flex-col justify-center items-center' : '-rotate-1 p-2 flex items-center'}`}
            style={{
              boxShadow: '2px 2px 0px rgba(0,0,0,0.1)',
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #e5e5e5 24px)',
              backgroundAttachment: 'local',
            }}
          >
            {/* Tape/Detail for cute effect */}
            {isZoomed && (
               <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-red-200/50 -rotate-2" />
            )}

            {/* Content */}
            <div className={`font-typewriter text-ink w-full text-center overflow-hidden
              ${isZoomed ? 'text-lg md:text-2xl leading-relaxed' : 'text-[8px] whitespace-nowrap'}`}
            >
              {isZoomed ? (
                <div className="flex flex-col gap-6">
                  <p className="font-bold tracking-widest text-xl md:text-3xl text-gray-800">
                    {fortune.cn}
                  </p>
                  <div className="w-16 h-0.5 bg-gray-300 mx-auto rounded-full"></div>
                  <p className="text-sm md:text-lg text-gray-600 italic">
                    {fortune.en}
                  </p>
                </div>
              ) : (
                <div className="opacity-50 blur-[0.5px]">
                  ************ CLASSIFIED FORTUNE ************
                </div>
              )}
            </div>

            {/* Cute stamp/footer */}
            {isZoomed && (
              <div className="absolute bottom-4 right-4 font-cute text-gray-400 text-sm rotate-[-5deg]">
                 From: Mily's Gachapon
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
