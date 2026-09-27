/**
 * projects.js - Project Cards Renderer & State Management
 * 
 * ARCHITECTURE NOTE:
 * Structured for dynamic project rendering connected to the backend Projects API.
 * Fetches real projects from MongoDB via PortfolioAPI.getProjects(), rendering them
 * into the semantic project-card structure while preserving safe fallback to local
 * data if the backend server is unreachable.
 */

const ProjectsManager = (() => {
  /**
   * Structured fallback Project Data for the portfolio.
   * Used if the backend API is unreachable or returns empty data.
   */
  const DEFAULT_PROJECTS = [
    {
      id: 'libsync-smart-library',
      title: 'LibSync Smart Library',
      type: 'Frontend Prototype',
      description: 'A smart library management frontend designed to digitalize student management, library entry/exit tracking, and seat occupancy management. Features an interactive seat availability and occupancy view, scanner/verification workflow, active library sessions, available/occupied/maintenance states, and comprehensive handling of invalid students, duplicate entries, unavailable seats, and exits without an active session (currently a frontend prototype using mock data).',
      githubUrl: 'https://github.com/sunshriya-jeer/libsync-smart-library',
      liveDemoUrl: null,
      tags: ['React', 'TypeScript', 'Vite', 'React Router', 'HTML/CSS']
    },
    {
      id: 'virtual-drawing-board',
      title: 'Virtual Drawing Board',
      type: 'Computer Vision Application',
      description: 'A computer-vision-based application that allows users to draw in the air using hand gestures captured through a webcam. Solves the traditional need for a mouse, touchpad, or physical drawing tablet for quick digital drawing, writing, and annotation. Workflow: Webcam → Hand Detection → Finger Tracking → Gesture Recognition → Drawing on Screen.',
      githubUrl: 'https://github.com/sunshriya-jeer/virtual_drawing_board',
      liveDemoUrl: null,
      tags: ['Python', 'OpenCV', 'MediaPipe', 'NumPy', 'Computer Vision']
    },
    {
      id: 'evidence-ai',
      title: 'Evidence AI',
      type: 'AI Web Application',
      description: 'A web application designed to help users analyze claims and find supporting evidence or relevant sources, streamlining evidence-based research and reducing manual search time across multiple sources. Workflow: User enters a claim → AI analyzes the claim → Relevant evidence is identified → Results are presented.',
      githubUrl: null,
      liveDemoUrl: null,
      tags: ['HTML', 'CSS', 'JavaScript', 'AI/ML', 'API Integration', 'Web Technologies']
    }
  ];

  /**
   * Safe HTML escaping helper to prevent XSS when rendering external data
   * @param {string} str 
   * @returns {string}
   */
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Generates markup for an individual project card.
   * Matches the semantic structure defined in index.html and style.css.
   * 
   * @param {Object} project
   * @returns {string} HTML string
   */
  function createProjectCardHTML(project) {
    const title = escapeHTML(project.title || '');
    const type = escapeHTML(project.type || (project.featured ? 'Featured Project' : ''));
    const description = escapeHTML(project.description || '');

    // Validate URLs strictly: non-empty string, not '#'
    const rawGithub = project.githubUrl;
    const githubUrl = rawGithub && typeof rawGithub === 'string' && rawGithub.trim() !== ''
      ? escapeHTML(rawGithub.trim())
      : '';

    const rawLive = project.liveUrl || project.liveDemoUrl;
    const liveDemoUrl = rawLive && typeof rawLive === 'string' && rawLive.trim() !== '' && rawLive.trim() !== '#'
      ? escapeHTML(rawLive.trim())
      : '';

    // Extract technologies from MongoDB array or fallback tags array
    const rawTags = Array.isArray(project.technologies)
      ? project.technologies
      : (Array.isArray(project.tags) ? project.tags : []);

    const tagsHTML = rawTags
      .filter(tag => tag && typeof tag === 'string')
      .map(tag => `<li class="badge">${escapeHTML(tag.trim())}</li>`)
      .join('');

    const projectId = escapeHTML(project._id || project.id || '');

    return `
      <article class="card project-card" data-project-id="${projectId}">
        <div class="project-header">
          <div class="project-type">${type}</div>
          <div class="project-actions">
            ${githubUrl ? `
              <a href="${githubUrl}" class="project-icon-link" target="_blank" rel="noopener noreferrer" aria-label="View ${title} Source Code on GitHub">
                <svg class="icon" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
            ` : ''}
            ${liveDemoUrl ? `
              <a href="${liveDemoUrl}" class="project-icon-link" target="_blank" rel="noopener noreferrer" aria-label="View ${title} Live Demo">
                <svg class="icon" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            ` : ''}
          </div>
        </div>
        <h3 class="project-title">${title}</h3>
        <p class="project-description">${description}</p>
        <ul class="project-tags-list" aria-label="Technologies used in ${title}">
          ${tagsHTML}
        </ul>
      </article>
    `;
  }

  /**
   * Displays a simple loading state indicator while projects are being fetched.
   */
  function showLoading() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    container.innerHTML = `
      <div class="projects-status-message" role="status" aria-live="polite" style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: var(--space-xl) 0; font-family: var(--font-mono); font-size: var(--font-size-sm);">
        Loading projects...
      </div>
    `;
  }

  /**
   * Renders a list of projects into the DOM container.
   * @param {Array<Object>} projectsList 
   */
  function renderProjects(projectsList) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    if (!projectsList || projectsList.length === 0) {
      return;
    }

    container.innerHTML = projectsList.map(createProjectCardHTML).join('');
  }

  /**
   * Initializes the projects component.
   * Displays loading state, fetches remote projects from PortfolioAPI,
   * and falls back cleanly to local data if the API request fails.
   */
  async function init() {
    showLoading();

    try {
      if (window.PortfolioAPI && typeof window.PortfolioAPI.getProjects === 'function') {
        const remoteProjects = await window.PortfolioAPI.getProjects();
        if (remoteProjects && Array.isArray(remoteProjects) && remoteProjects.length > 0) {
          renderProjects(remoteProjects);
          return;
        }
      }
    } catch (err) {
      console.warn('[ProjectsManager] Remote projects fetch failed. Falling back to local data:', err);
    }

    // Fallback to structured default data
    renderProjects(DEFAULT_PROJECTS);
  }

  return {
    init,
    renderProjects,
    createProjectCardHTML,
    DEFAULT_PROJECTS
  };
})();

// Attach to window and auto-initialize on DOMContentLoaded
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProjectsManager;
} else {
  window.ProjectsManager = ProjectsManager;
  document.addEventListener('DOMContentLoaded', () => {
    ProjectsManager.init();
  });
}
