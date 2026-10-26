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
  // Button labels come from the page (data-label-*, data-aria-*) so they follow its language.
  const syncTheme = () => {
    if (!themeBtn) return;
    const d = themeBtn.dataset;
    const isDark = effective() === 'dark';
    themeBtn.textContent = isDark ? d.labelLight : d.labelDark;
    themeBtn.setAttribute('aria-label', isDark ? d.ariaLight : d.ariaDark);
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
      const label = mode === 'mobile' ? a.dataset.labelMobile : a.dataset.labelDesktop;
      img.src = src;
      img.alt = (img.dataset.altTemplate || '{caption}').replace('{caption}', a.dataset.caption).replace('{kind}', label || mode);
      cap.textContent = `${a.dataset.caption} · ${label || mode}`;
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

  // giscus (votes): add its script only when the vote section comes near the screen,
  // so nothing loads from giscus.app until then, and keep its theme in step with ours.
  const giscus = document.querySelector('.giscus[data-giscus]');
  const giscusTheme = () => (root.dataset.theme ? effective() : 'preferred_color_scheme');
  if (giscus) {
    const load = () => {
      if (giscus.dataset.loaded) return;
      giscus.dataset.loaded = '1';
      const s = document.createElement('script');
      s.src = 'https://giscus.app/client.js';
      s.async = true;
      s.crossOrigin = 'anonymous';
      for (const [k, v] of Object.entries(JSON.parse(giscus.dataset.giscus))) s.setAttribute(k, v);
      s.setAttribute('data-theme', giscusTheme());
      giscus.after(s);
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      }, { rootMargin: '300px' });
      io.observe(giscus);
    } else load();
    themeBtn?.addEventListener('click', () => {
      const frame = document.querySelector('iframe.giscus-frame');
      frame?.contentWindow?.postMessage({ giscus: { setConfig: { theme: giscusTheme() } } }, 'https://giscus.app');
    });
  }

  // Scroll recordings: the button is a plain link to the file; with JS it becomes a player
  // on click, so nothing is downloaded before that and nothing plays by itself.
  document.querySelectorAll('[data-video-src]').forEach((a) =>
    a.addEventListener('click', (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const v = document.createElement('video');
      v.src = a.dataset.videoSrc;
      v.controls = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.setAttribute('aria-label', a.dataset.videoLabel || '');
      if (a.dataset.videoWidth) v.style.maxWidth = `${a.dataset.videoWidth}px`;
      a.closest('[data-video-box]').replaceChildren(v);
      v.focus();
      v.play().catch(() => {});
    }),
  );

  // Language menu: close it on Escape or a click elsewhere.
  const langMenu = document.querySelector('.lang-menu');
  if (langMenu) {
    document.addEventListener('click', (e) => {
      if (langMenu.open && !langMenu.contains(e.target)) langMenu.open = false;
    });
    langMenu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && langMenu.open) {
        langMenu.open = false;
        langMenu.querySelector('summary').focus();
      }
    });
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
