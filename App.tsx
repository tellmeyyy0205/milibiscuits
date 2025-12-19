import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_TITLE, FORTUNES } from './constants';
import { GameState, FortuneMessage } from './types';
import { FortuneCookie } from './components/FortuneCookie';
import { FortunePaper } from './components/FortunePaper';
import { Crumbs } from './components/Crumbs';
import { playCrunchSound } from './utils/audio';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [currentFortune, setCurrentFortune] = useState<FortuneMessage | null>(null);

  const handleCrackCookie = useCallback(() => {
    if (gameState !== GameState.IDLE) return;

    // 1. Play Sound
    playCrunchSound();

    // 2. Select random fortune
    const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    setCurrentFortune(randomFortune);

    // 3. Change state to animate
    setGameState(GameState.CRACKING);

    // 4. Settle into OPEN state shortly after
    setTimeout(() => {
      setGameState(GameState.OPEN);
    }, 100);
  }, [gameState]);

  const handlePaperClick = useCallback(() => {
    if (gameState === GameState.OPEN) {
      setGameState(GameState.ZOOMED);
    } 
    // If ZOOMED, maybe clicking paper does nothing or toggles? 
    // We'll rely on the Gachapon button to reset.
  }, [gameState]);

  const handleReset = () => {
    setGameState(GameState.IDLE);
    setTimeout(() => setCurrentFortune(null), 300);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 relative overflow-hidden select-none font-cute pb-12">
      
      {/* Header */}
      <motion.header 
        className="mt-8 text-center z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <h1 className="text-4xl md:text-6xl text-orange-600 drop-shadow-sm tracking-wide transform -rotate-2">
          {APP_TITLE}
        </h1>
        <p className="text-orange-400 mt-2 text-lg md:text-xl font-bold">
          {gameState === GameState.IDLE ? "Tap the biscuit!" : "Your Fortune Awaits..."}
        </p>
      </motion.header>

      {/* Main Interaction Area */}
      <div className="relative flex-1 flex items-center justify-center w-full max-w-lg aspect-square">
        
        {/* The Cookie */}
        <div className={`relative z-20 ${gameState === GameState.IDLE ? 'animate-float' : ''}`}>
           <FortuneCookie 
             gameState={gameState} 
             onClick={handleCrackCookie} 
           />
        </div>

        {/* The Paper */}
        <FortunePaper 
          fortune={currentFortune} 
          gameState={gameState} 
          onClick={handlePaperClick}
        />

        {/* Crumbs Effect */}
        {(gameState === GameState.CRACKING || gameState === GameState.OPEN) && (
          <Crumbs />
        )}
      </div>

      {/* Gachapon Style Reset Button */}
      <div className="relative z-50 mb-4">
        <motion.button
          onClick={gameState === GameState.ZOOMED ? handleReset : undefined}
          disabled={gameState !== GameState.ZOOMED}
          className={`group relative w-24 h-24 md:w-32 md:h-32 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300
            ${gameState === GameState.ZOOMED 
              ? 'bg-orange-500 cursor-pointer hover:scale-105 active:scale-95' 
              : 'bg-gray-300 cursor-not-allowed opacity-50 grayscale'}`}
          whileTap={gameState === GameState.ZOOMED ? { rotate: 180 } : {}}
        >
           {/* Outer Ring */}
           <div className="absolute inset-2 rounded-full border-4 border-white/30 border-dashed"></div>
           
           {/* Knob Handle Bar */}
           <div className="w-full h-8 bg-white/20 absolute rotate-45 transform group-hover:bg-white/40 transition-colors"></div>
           <div className="w-8 h-full bg-white/20 absolute rotate-45 transform group-hover:bg-white/40 transition-colors"></div>

           {/* Center cap */}
           <div className="w-12 h-12 bg-white rounded-full shadow-inner flex items-center justify-center z-10">
              <span className="text-2xl">
                {gameState === GameState.ZOOMED ? "↻" : "🔒"}
              </span>
           </div>
        </motion.button>
        {gameState === GameState.ZOOMED && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1 rounded-full text-orange-500 font-bold shadow-md"
          >
            Turn to Reset!
          </motion.div>
        )}
      </div>
      
      {/* Overlay background for focus when zoomed */}
      {gameState === GameState.ZOOMED && (
        <motion.div 
          className="fixed inset-0 bg-amber-50/80 backdrop-blur-sm z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

    </div>
  );
};

export default App;
