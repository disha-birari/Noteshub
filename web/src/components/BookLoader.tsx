"use client";

import React from 'react';
import { motion } from 'framer-motion';

const BookLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8" style={{ perspective: '1000px' }}>
      <div className="relative w-32 h-40">
        {/* Book Cover - Back */}
        <div 
          className="absolute inset-0 bg-[#1E293B] rounded-r-lg shadow-xl" 
          style={{ transformOrigin: 'left' }} 
        />
        
        {/* Pages */}
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-y-1 right-1 w-full bg-white border-l border-slate-200 rounded-r-sm shadow-sm"
            style={{ 
              transformOrigin: 'left',
              zIndex: 5 - i 
            }}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: -180 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Book Cover - Front */}
        <motion.div 
          className="absolute inset-0 bg-[#1E293B] rounded-r-lg shadow-2xl flex flex-col items-center justify-center overflow-hidden"
          style={{ transformOrigin: 'left' }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: -180 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0,
            ease: "easeInOut"
          }}
        >
            <div className="w-1.5 h-full bg-slate-800/50 absolute left-0" />
            <div className="w-12 h-1 bg-white/20 rounded-full mb-3" />
            <div className="w-8 h-1 bg-white/10 rounded-full" />
            
            {/* Logo on Book */}
            <div className="mt-8 w-8 h-8 border-2 border-white/20 rounded-lg flex items-center justify-center">
               <div className="w-4 h-4 bg-white/40 rounded-sm" />
            </div>
        </motion.div>
      </div>
      
      <div className="text-center space-y-3">
        <motion.h3 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl font-black text-[#1E293B] tracking-tight"
        >
          CURATING YOUR NOTES
        </motion.h3>
        <div className="flex items-center justify-center gap-1">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }}
              className="w-1.5 h-1.5 bg-[#1E293B] rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookLoader;
