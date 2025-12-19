import React from 'react';
import { motion } from 'framer-motion';

export const Crumbs: React.FC = () => {
  // Generate random crumbs
  const crumbs = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    x: Math.random() * 200 - 100, // Random spread
    y: Math.random() * 50,
    rotation: Math.random() * 360,
    size: Math.random() * 6 + 4,
    delay: Math.random() * 0.2,
  }));

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none z-20">
      {crumbs.map((crumb) => (
        <motion.div
          key={crumb.id}
          initial={{ 
            opacity: 0, 
            x: 0, 
            y: 0, 
            rotate: 0 
          }}
          animate={{ 
            opacity: [1, 1, 0], 
            x: crumb.x, 
            y: 200 + crumb.y, 
            rotate: crumb.rotation 
          }}
          transition={{ 
            duration: 1.5, 
            ease: "easeIn", 
            delay: crumb.delay 
          }}
          className="absolute bg-cookie-dark rounded-sm"
          style={{
            width: crumb.size,
            height: crumb.size,
            backgroundColor: Math.random() > 0.5 ? '#D99F59' : '#F4C47C',
          }}
        />
      ))}
    </div>
  );
};
