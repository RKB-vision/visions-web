'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published';
  lastModified: Date;
}

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user?.role !== 'admin')) {
      router.push('/');
    }
  }, [session, status, router]);

  const handleProjectUpload = async () => {
    if (!newProject.title.trim()) return;
    
    setIsUploading(true);
    
    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      status: 'draft',
      lastModified: new Date()
    };

    // Simulate API call
    setTimeout(() => {
      setProjects(prev => [...prev, project]);
      setNewProject({ title: '', description: '' });
      setIsUploading(false);
      
      // Auto-save to localStorage (in real app, this would be database)
      localStorage.setItem('adminProjects', JSON.stringify([...projects, project]));
    }, 1000);
  };

  const publishProject = (id: string) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === id 
          ? { ...project, status: 'published' as const, lastModified: new Date() }
          : project
      )
    );
  };

  const syncToGitHub = async () => {
    // Simulate GitHub integration
    alert('GitHub sync initiated! Projects will be pushed to repository.');
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600">Manage projects and content</p>
      </div>

      {/* Project Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Upload New Project</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Project Title"
            value={newProject.title}
            onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <textarea
            placeholder="Project Description"
            value={newProject.description}
            onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex space-x-4">
            <button
              onClick={handleProjectUpload}
              disabled={isUploading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload Project'}
            </button>
            <button
              onClick={syncToGitHub}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
            >
              Sync to GitHub
            </button>
          </div>
        </div>
      </motion.div>

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-gray-600 text-sm">{project.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Last modified: {project.lastModified.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                  {project.status === 'draft' && (
                    <button
                      onClick={() => publishProject(project.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                    >
                      Publish
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}