'use client';

import { motion } from 'framer-motion';
import FeaturedProjects from '@/src/components/featured-projects';

export default function ExplorePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-extrabold text-gray-900 text-center mb-12"
        >
          Explore Our Projects
        </motion.h1>
        <FeaturedProjects />
      </div>
    </motion.div>
  );
}