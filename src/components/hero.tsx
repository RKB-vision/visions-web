'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
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
              className="px-8 py-3 border border-transparent text-base font-medium rounded-full text-black bg-white hover:bg-gray-200 transition-colors duration-300"
            >
              Explore Projects
            </Link>
            <Link 
              href="/blog"
              className="px-8 py-3 border border-white text-base font-medium rounded-full text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-300"
            >
              Read Blog
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}