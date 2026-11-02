import rawProjects from './projects.json';

export const projects = rawProjects;

export const categories = [
  'All',
  'AI Films',
  'Product & Motion Design',
  'Talking Head',
  'Documentary & Storytelling'
];

export const getFeaturedProject = () => {
  // Use the 60fps high impact Beast documentary as the main cinematic showreel feature
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
