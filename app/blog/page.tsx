'use client';

import { motion } from 'framer-motion';

export default function BlogPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Our Blog</h1>
        <p className="mt-2 text-lg text-gray-600">
          Stay tuned for exciting updates, insights, and stories from Visions!
        </p>
        <div className="mt-6">
          <p className="text-md text-gray-500">
            We're busy crafting engaging content. Check back soon for our first posts!
          </p>
        </div>
      </div>
    </motion.div>
  );
}