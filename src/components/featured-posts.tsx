'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// Mock data - will be replaced with real data from content files later
const posts = [
  {
    id: 1,
    title: 'The Future of AI in 2024',
    excerpt: 'Exploring the upcoming trends and breakthroughs in artificial intelligence.',
    date: 'Jan 15, 2024',
    author: 'Alex Johnson',
    authorImage: '/placeholder-author.jpg',
    link: '/blog/future-of-ai-2024'
  },
  {
    id: 2,
    title: 'How to Get Started with Machine Learning',
    excerpt: 'A beginner\'s guide to understanding and implementing machine learning models.',
    date: 'Dec 28, 2023',
    author: 'Maria Garcia',
    authorImage: '/placeholder-author.jpg',
    link: '/blog/getting-started-with-ml'
  },
  {
    id: 3,
    title: 'Ethics in AI Development',
    excerpt: 'Discussing the important ethical considerations when developing AI systems.',
    date: 'Dec 10, 2023',
    author: 'David Kim',
    authorImage: '/placeholder-author.jpg',
    link: '/blog/ethics-in-ai-development'
  }
];

export default function FeaturedPosts() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Latest Insights</h2>
          <p className="mt-4 text-xl text-gray-600">
            Stay updated with our latest articles and research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{post.author}</p>
                    <p className="text-xs text-gray-500">{post.date}</p>
                  </div>
                </div>
                <Link href={post.link}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link 
                  href={post.link}
                  className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200 flex items-center"
                >
                  Read more
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-black hover:bg-gray-800 transition-colors duration-300"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}