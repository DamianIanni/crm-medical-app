"use client";
import { motion, AnimatePresence } from "framer-motion";

export const PageAnimationWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      initial={{ opacity: 0, y: 0 }} // Empieza invisible y 15px más abajo
      animate={{ opacity: 1, y: 0 }} // Aparece y sube a su posición
      exit={{ opacity: 0, y: 0 }} // Desaparece y baja
      transition={{ duration: 0.25 }} // Duración de la animación
    >
      {children}
    </motion.div>
  </AnimatePresence>
);
