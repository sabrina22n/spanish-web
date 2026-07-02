const GRAMMAR_NAV = [
  {
    section: 'Gramática',
    items: [
      { id: 'verbos',        label: 'Tiempos verbales',  href: 'verbos.html',        icon: '⏰', available: true  },
      { id: 'ser-estar',     label: 'Ser y Estar',        href: 'ser-estar.html',     icon: '🔀', available: true  },
      { id: 'preposiciones', label: 'Preposiciones',      href: 'preposiciones.html', icon: '📍', available: true  },
      { id: 'articulos',     label: 'Artículos',          href: 'articulos.html',     icon: '📝', available: true  },
      { id: 'sustantivos',   label: 'Sustantivos',        href: 'sustantivos.html',   icon: '🏷️', available: true  },
      { id: 'pronombres',    label: 'Pronombres',         href: '#',                  icon: '👤', available: false },
      { id: 'adjetivos',     label: 'Adjetivos',          href: '#',                  icon: '✨', available: false },
      { id: 'adverbios',     label: 'Adverbios',          href: '#',                  icon: '🔄', available: false },
      { id: 'conectores',    label: 'Conectores',         href: '#',                  icon: '🔗', available: false },
    ]
  }
];

function buildSidebar(activeId) {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  const inPages = location.pathname.includes('/paginas/');
  const homeHref = inPages ? '../index.html' : 'index.html';
  const pageBase = inPages ? '' : 'paginas/';

  const isHome = activeId === 'home';
  let html = `
    <div class="sidebar-header">
      <button class="sidebar-hide-btn" id="sidebar-hide-btn" aria-label="Ocultar menú" title="Ocultar menú">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>

      </button>
    </div>
    <a href="${homeHref}" class="sidebar-home-link${isHome ? ' active' : ''}">
      <span>🏠</span><span>Inicio</span>
    </a>`;

  GRAMMAR_NAV.forEach(group => {
    html += `<div class="sidebar-section-title">${group.section}</div>`;
    group.items.forEach(item => {
      const isActive = item.id === activeId;
      if (item.available) {
        html += `<a href="${pageBase}${item.href}" class="sidebar-link${isActive ? ' active' : ''}">
          <span class="sidebar-icon">${item.icon}</span>
          <span>${item.label}</span>
        </a>`;
      } else {
        html += `<span class="sidebar-link disabled">
          <span class="sidebar-icon">${item.icon}</span>
          <span>${item.label}</span>
          <span class="coming-soon-pill">Pronto</span>
        </span>`;
      }
    });
  });

  nav.innerHTML = html;

  setupSidebarToggle();
}

function setupSidebarToggle() {
  const hideBtn  = document.getElementById('sidebar-hide-btn');
  const sidebar  = document.querySelector('.sidebar');
  const appBody  = document.querySelector('.app-body');
  if (!hideBtn || !sidebar) return;

  const showBtn = document.createElement('button');
  showBtn.id        = 'sidebar-show-btn';
  showBtn.className = 'sidebar-show-btn';
  showBtn.setAttribute('aria-label', 'Mostrar menú');
  showBtn.title     = 'Mostrar menú';
  showBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>`;
  appBody.appendChild(showBtn);

  hideBtn.addEventListener('click', () => {
    sidebar.classList.add('collapsed');
    showBtn.classList.add('visible');
  });

  showBtn.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
    showBtn.classList.remove('visible');
  });
}

function setupHamburger() {
  const btn     = document.getElementById('hamburger');
  const sidebar = document.querySelector('.sidebar');
  if (!btn || !sidebar) return;

  btn.addEventListener('click', () => sidebar.classList.toggle('open'));

  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !btn.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}
