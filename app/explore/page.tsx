'use client';

import FeaturedProjects from '@/src/components/featured-projects';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Explore Projects</h1>
        <FeaturedProjects />
      </div>
    </div>
  );
}