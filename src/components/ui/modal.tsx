'use client';

import { motion } from 'framer-motion';

export default function Modal({
  open,
  onClose,
  children,
}: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        className="absolute inset-0 flex items-center justify-center p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
          {children}
        </div>
      </motion.div>
    </div>
  );
}