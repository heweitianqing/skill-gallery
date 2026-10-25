// skill-gallery: theme toggle, desktop/mobile screenshot switch, lightbox and
// sandboxed preview sizing. Every page works without this script.
(() => {
  const root = document.documentElement;
  const store = {
    get(k) {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, v);
      } catch {}
    },
  };

  // Theme: follows the system until the visitor picks one.
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const dark = matchMedia('(prefers-color-scheme: dark)');
  const effective = () => root.dataset.theme || (dark.matches ? 'dark' : 'light');
  const syncTheme = () => {
    if (!themeBtn) return;
    const t = effective();
    themeBtn.textContent = t === 'dark' ? 'Light' : 'Dark';
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  };
  themeBtn?.addEventListener('click', () => {
    const next = effective() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    store.set('sg-theme', next);
    syncTheme();
  });
  dark.addEventListener?.('change', syncTheme);
  syncTheme();

  // Desktop / mobile screenshots, remembered across pages.
  const viewBtns = document.querySelectorAll('[data-set-view]');
  const setView = (v) => {
    document.body.dataset.view = v;
    viewBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setView === v)));
  };
  if (viewBtns.length) {
    setView(store.get('sg-view') === 'mobile' ? 'mobile' : 'desktop');
    viewBtns.forEach((b) =>
      b.addEventListener('click', () => {
        setView(b.dataset.setView);
        store.set('sg-view', b.dataset.setView);
      }),
    );
  }

  // Lightbox for full-page screenshots.
  const dlg = document.getElementById('lightbox');
  if (dlg && typeof dlg.showModal === 'function') {
    const img = dlg.querySelector('img');
    const cap = dlg.querySelector('[data-caption]');
    const body = dlg.querySelector('.lightbox-body');
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a.thumb');
      if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const wantMobile = document.body.dataset.view === 'mobile';
      const mode = wantMobile && a.dataset.fullMobile ? 'mobile' : a.dataset.fullDesktop ? 'desktop' : 'mobile';
      const src = mode === 'mobile' ? a.dataset.fullMobile : a.dataset.fullDesktop;
      if (!src) return;
      e.preventDefault();
      img.src = src;
      img.alt = `${a.dataset.caption}, full-page ${mode} screenshot`;
      cap.textContent = `${a.dataset.caption} · ${mode === 'mobile' ? 'Mobile 390' : 'Desktop 1440'}`;
      dlg.dataset.mode = mode;
      dlg.showModal();
      body.scrollTop = 0;
    });
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) dlg.close();
    });
    dlg.querySelector('[data-close]').addEventListener('click', () => dlg.close());
    dlg.addEventListener('close', () => img.removeAttribute('src'));
  }

  // Sandboxed preview: render at a fixed CSS width and scale down to fit.
  const wrap = document.querySelector('[data-frame-wrap]');
  if (wrap) {
    const frame = wrap.querySelector('iframe');
    const btns = document.querySelectorAll('[data-frame]');
    let target = 'fit';
    const layout = () => {
      if (target === 'fit') {
        Object.assign(frame.style, { width: '100%', height: '100%', transform: '', left: '0' });
        return;
      }
      const w = Number(target);
      const avail = wrap.clientWidth;
      const s = Math.min(1, avail / w);
      Object.assign(frame.style, {
        width: `${w}px`,
        height: `${wrap.clientHeight / s}px`,
        transform: s < 1 ? `scale(${s})` : '',
        left: s < 1 ? '0' : `${(avail - w) / 2}px`,
      });
    };
    btns.forEach((b) =>
      b.addEventListener('click', () => {
        target = b.dataset.frame;
        btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        layout();
      }),
    );
    if ('ResizeObserver' in window) new ResizeObserver(layout).observe(wrap);
    else addEventListener('resize', layout);
  }
})();
