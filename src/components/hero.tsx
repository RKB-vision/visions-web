'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Modal from './ui/modal';

export default function Hero() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<'idle' | 'running' | 'success'>('idle');
  return (
    <div className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Explore the Future of AI
          </motion.h1>
          <motion.p 
            className="mt-6 max-w-2xl mx-auto text-xl md:text-2xl text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover innovative AI projects and tools that are shaping tomorrow&apos;s technology landscape.
          </motion.p>
          <motion.div 
            className="mt-10 flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              href="/projects"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-full text-black bg-white hover:bg-gray-200 transition-transform duration-200 active:scale-[0.98]"
            >
              Explore Projects
            </Link>
            <button
              onClick={() => {
                setOpen(true);
                setState('running');
                setTimeout(() => setState('success'), 1200);
              }}
              className="px-8 py-3 border border-white text-base font-medium rounded-full text-white hover:bg-white hover:bg-opacity-10 transition-transform duration-200 active:scale-[0.98]"
            >
              Try a mini-demo
            </button>
            <Link 
              href="/blog"
              className="px-8 py-3 border border-white text-base font-medium rounded-full text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-300"
            >
              Read Blog
            </Link>
          </motion.div>
          <Modal open={open} onClose={() => { setOpen(false); setState('idle'); }}>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Sandboxed Demo</h3>
              {state === 'running' && (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                  <p className="text-gray-600">Running…</p>
                </div>
              )}
              {state === 'success' && (
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-600">
                    <path fill="currentColor" d="M9 16.2l-3.5-3.5L4 14.2l5 5 12-12-1.5-1.5z" />
                  </svg>
                  <p className="text-gray-800 font-medium">Success!</p>
                </div>
              )}
              <div className="rounded-lg overflow-hidden border">
                <iframe
                  title="Mini Demo"
                  srcDoc="<html><body style='font-family:sans-serif;padding:16px'><h4>Demo sandbox</h4><p>This is an isolated iframe demo.</p></body></html>"
                  className="w-full h-48"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => { setOpen(false); setState('idle'); }}
                  className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}