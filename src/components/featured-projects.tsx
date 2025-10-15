'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import RevealOnScroll from './ui/reveal-on-scroll';

// Mock data - will be replaced with real data from content files later
const projects = [
  {
    id: 1,
    title: 'AI Text Generator',
    description: 'A powerful text generation tool using state-of-the-art language models.',
    image: '/placeholder-project.jpg',
    tags: ['NLP', 'GPT', 'Text Generation'],
    link: '/projects/ai-text-generator'
  },
  {
    id: 2,
    title: 'Computer Vision Analyzer',
    description: 'Analyze images and videos with advanced computer vision algorithms.',
    image: '/placeholder-project.jpg',
    tags: ['Computer Vision', 'Object Detection'],
    link: '/projects/computer-vision-analyzer'
  },
  {
    id: 3,
    title: 'Voice Assistant',
    description: 'A customizable voice assistant for various applications.',
    image: '/placeholder-project.jpg',
    tags: ['Speech Recognition', 'NLP'],
    link: '/projects/voice-assistant'
  }
];

export default function FeaturedProjects() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured AI Projects</h2>
          <p className="mt-4 text-xl text-gray-600">
            Explore our latest AI tools and projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <RevealOnScroll key={project.id}>
              <motion.div
                className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Project Image</span>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center">
                    <div className="flex gap-3">
                      <button className="px-3 py-1 text-sm rounded-full bg-white text-black hover:bg-gray-200">Run demo</button>
                      <button className="px-3 py-1 text-sm rounded-full bg-white text-black hover:bg-gray-200">Fork</button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <Link 
                    href={project.link}
                    className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200 flex items-center"
                  >
                    Learn more
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
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/projects"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-black hover:bg-gray-800 transition-colors duration-300"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}