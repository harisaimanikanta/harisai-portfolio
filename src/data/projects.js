import rawProjects from './projects.json';

// Ensure base URL is properly prefixed for GitHub Pages or root domains
const BASE = import.meta.env.BASE_URL.endsWith('/') 
  ? import.meta.env.BASE_URL 
  : `${import.meta.env.BASE_URL}/`;

export const projects = rawProjects.map(p => ({
  ...p,
  thumbnailUrl: p.thumbnailUrl.startsWith('http') 
    ? p.thumbnailUrl 
    : `${BASE}${p.thumbnailUrl.replace(/^\.?\//, '')}`
}));

export const categories = [
  'All',
  'Product & Motion Design',
  'Talking Head',
  'Documentary & Storytelling',
  'AI Films'
];

export const getFeaturedProject = () => {
  const beast = projects.find(p => p.id === 'project-17' || p.title.includes('Beast'));
  return beast || projects[0];
};

export const getProjectById = (id) => {
  return projects.find(p => p.id === id);
};

export const getAdjacentProjects = (currentId) => {
  const currentIndex = projects.findIndex(p => p.id === currentId);
  if (currentIndex === -1) return { prev: null, next: null };
  const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
  const nextIndex = (currentIndex + 1) % projects.length;
  return {
    prev: projects[prevIndex],
    next: projects[nextIndex],
    currentIndex: currentIndex + 1,
    total: projects.length
  };
};
