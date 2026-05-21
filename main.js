/* ============================================================
   EXERCISES
   ============================================================ */
(function () {
  let selectedTile = null;

  function normalize(str) {
    return str.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function updateScore(el, correct, total) {
    el.textContent = correct + ' / ' + total;
    el.className = el.className.split(' ')[0];
    if (correct === total) el.classList.add('perfect');
    else if (correct > 0)  el.classList.add('partial');
    else                   el.classList.add('zero');
  }

  // Tab switching
  document.querySelectorAll('.ex-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ex-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.ex-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('ex-' + btn.dataset.group).classList.add('active');
      if (selectedTile) { selectedTile.classList.remove('selected'); selectedTile = null; }
    });
  });

  // Fill-in exercises
  document.querySelectorAll('.fill-group').forEach(group => {
    group.querySelector('.fill-check').addEventListener('click', () => {
      let correct = 0, total = 0;
      group.querySelectorAll('.fill-item').forEach(item => {
        const input  = item.querySelector('.fill-input');
        const hint   = item.querySelector('.fill-hint');
        const answer = item.dataset.answer;
        const ok     = normalize(input.value) === normalize(answer);
        input.classList.toggle('correct',   ok);
        input.classList.toggle('incorrect', !ok);
        if (!ok) { hint.textContent = '→ ' + answer; hint.style.display = 'inline-block'; }
        else     { hint.style.display = 'none'; }
        if (ok) correct++;
        total++;
      });
      updateScore(group.querySelector('.fill-score'), correct, total);
    });

    group.querySelector('.fill-reset').addEventListener('click', () => {
      group.querySelectorAll('.fill-input').forEach(i => { i.value = ''; i.classList.remove('correct','incorrect'); });
      group.querySelectorAll('.fill-hint').forEach(h  => { h.style.display = 'none'; });
      const sc = group.querySelector('.fill-score');
      sc.textContent = '';
      sc.className = 'fill-score';
    });
  });

  // Drag & Drop exercises
  document.querySelectorAll('.dnd-group').forEach(group => {
    const bank = group.querySelector('.dnd-bank');

    // HTML5 DnD
    group.addEventListener('dragstart', e => {
      const tile = e.target.closest('.tile');
      if (!tile) return;
      e.dataTransfer.setData('tileId', tile.id);
      tile.classList.add('dragging');
    });

    group.addEventListener('dragend', e => {
      const tile = e.target.closest('.tile');
      if (tile) tile.classList.remove('dragging');
    });

    group.querySelectorAll('.drop-zone').forEach(zone => {
      zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('over'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('over'));
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('over');
        const tile = document.getElementById(e.dataTransfer.getData('tileId'));
        if (!tile) return;
        const existing = zone.querySelector('.tile');
        if (existing && existing !== tile) bank.appendChild(existing);
        zone.appendChild(tile);
      });
    });

    bank.addEventListener('dragover', e => e.preventDefault());
    bank.addEventListener('drop', e => {
      e.preventDefault();
      const tile = document.getElementById(e.dataTransfer.getData('tileId'));
      if (tile) bank.appendChild(tile);
    });

    // Click / tap placement (mobile-friendly)
    group.addEventListener('click', e => {
      const tile = e.target.closest('.tile');
      const zone = e.target.closest('.drop-zone');

      if (tile) {
        if (selectedTile === tile) {
          tile.classList.remove('selected');
          selectedTile = null;
        } else {
          if (selectedTile) selectedTile.classList.remove('selected');
          selectedTile = tile;
          tile.classList.add('selected');
        }
        return;
      }

      if (zone) {
        if (selectedTile) {
          const existing = zone.querySelector('.tile');
          if (existing) bank.appendChild(existing);
          zone.appendChild(selectedTile);
          selectedTile.classList.remove('selected');
          selectedTile = null;
        } else {
          const existing = zone.querySelector('.tile');
          if (existing) bank.appendChild(existing);
        }
      }
    });

    // Check & Reset
    group.querySelector('.dnd-check').addEventListener('click', () => {
      let correct = 0, total = 0;
      group.querySelectorAll('.drop-zone').forEach(zone => {
        const expected = normalize(zone.dataset.answer);
        const tile     = zone.querySelector('.tile');
        const placed   = tile ? normalize(tile.dataset.word) : '';
        zone.classList.remove('correct','incorrect','empty');
        if (placed === expected)  { zone.classList.add('correct');   correct++; }
        else if (placed === '')   { zone.classList.add('empty'); }
        else                      { zone.classList.add('incorrect'); }
        total++;
      });
      updateScore(group.querySelector('.dnd-score'), correct, total);
    });

    group.querySelector('.dnd-reset').addEventListener('click', () => {
      group.querySelectorAll('.drop-zone .tile').forEach(t => bank.appendChild(t));
      group.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('correct','incorrect','empty','over'));
      const sc = group.querySelector('.dnd-score');
      sc.textContent = '';
      sc.className = 'dnd-score';
      if (selectedTile) { selectedTile.classList.remove('selected'); selectedTile = null; }
    });
  });
})();

function setupSectionNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sticky-nav a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    },
    { rootMargin: '-20% 0px -65% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}

setupSectionNav();
setupHamburger();
