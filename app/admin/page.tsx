'use client';
import { useEffect, useState } from 'react';
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

type SurveyRow = {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  rating: number;
  feedback: string | null;
  user_email: string | null;
};

export default function AdminPage() {
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

  const [surveys, setSurveys] = useState<SurveyRow[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/surveys', { cache: 'no-store' });
      if (!res.ok) return;
      const json = await res.json();
      setSurveys(json.data ?? []);
    }
    load();
  }, []);

  function exportCSV() {
    const rows = [['id','created_at','name','email','rating','feedback','user_email'],
      ...surveys.map(s => [s.id, s.created_at, s.name ?? '', s.email ?? '', String(s.rating), s.feedback ?? '', s.user_email ?? ''])
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'survey_responses.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = ratingFilter === 'all' ? surveys : surveys.filter(s => s.rating === ratingFilter);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Project Upload and Existing Projects sections */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Survey Responses</h2>
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm text-gray-700">Filter by rating:</label>
          <select className="border rounded px-2 py-1" value={ratingFilter} onChange={e => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}>
            <option value="all">All</option>
            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button className="ml-auto bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-900" onClick={exportCSV}>Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Rating</th>
                <th className="py-2 pr-4">Feedback</th>
                <th className="py-2 pr-4">User Email</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-b">
                  <td className="py-2 pr-4">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="py-2 pr-4">{row.name ?? '-'}</td>
                  <td className="py-2 pr-4">{row.email ?? '-'}</td>
                  <td className="py-2 pr-4">{row.rating}</td>
                  <td className="py-2 pr-4">{row.feedback ?? '-'}</td>
                  <td className="py-2 pr-4">{row.user_email ?? '-'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td className="py-4 text-gray-500" colSpan={6}>No responses yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}