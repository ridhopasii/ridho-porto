function parseTags(tags) {
  if (!tags) return [];
  return String(tags)
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

function projectType(project) {
  const tags = parseTags(project.tags);
  if (tags.includes('design') || tags.includes('ui') || tags.includes('ux')) return 'design';
  if (tags.includes('editing') || tags.includes('video') || tags.includes('audio')) return 'editing';
  return 'project';
}

function groupProjectsByType(projects) {
  const grouped = { project: [], design: [], editing: [] };
  (projects || []).forEach((p) => {
    const cat = projectType(p); // Use projectType to determine category
    if (grouped[cat]) {
      grouped[cat].push(p);
    } else {
      // Fallback for unknown categories or if we add more
      grouped.project.push(p);
    }
  });
  return grouped;
}

function sortAwardsByDate(awards) {
  return (awards || []).slice().sort((a, b) => {
    const ad = new Date(String(a.date).replace(/-/g, '/'));
    const bd = new Date(String(b.date).replace(/-/g, '/'));
    return bd - ad;
  });
}

function filterAwardsByCategory(awards, category) {
  if (!category || category === 'all') return awards || [];
  return (awards || []).filter((a) => String(a.category || '').toLowerCase() === String(category).toLowerCase());
}

function isPdfUrl(url) {
  if (!url) return false;
  return /\.pdf(\?.*)?$/i.test(String(url));
}

module.exports = {
  parseTags,
  projectType,
  groupProjectsByType,
  sortAwardsByDate,
  filterAwardsByCategory,
  isPdfUrl,
};
