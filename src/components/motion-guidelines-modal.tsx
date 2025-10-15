'use client';

import Modal from './ui/modal';
import { useState } from 'react';
import { useThemePrefs } from './ui/theme-provider';

export default function MotionGuidelinesModal() {
  const [open, setOpen] = useState(false);
  const { reduceMotion, toggleReduceMotion } = useThemePrefs();

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-sm text-gray-300 hover:text-white">Motion Info</button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Motion Guidelines</h3>
          <p className="text-gray-700">We use short, meaningful animations to enhance clarity. If you prefer less motion, enable Reduce Motion below.</p>
          <div className="flex items-center justify-between">
            <span className="text-gray-800">Reduce Motion</span>
            <button onClick={toggleReduceMotion} className="px-3 py-1 rounded-md bg-black text-white hover:bg-gray-800">
              {reduceMotion ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}