"use client";
import { motion, AnimatePresence } from "framer-motion";

export const PageAnimationWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);
