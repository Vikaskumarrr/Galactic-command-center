"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { componentAnimationVariants } from '@/lib/theme';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({ children, className }) => {
  return (
    <motion.div
      variants={componentAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedWrapper;
