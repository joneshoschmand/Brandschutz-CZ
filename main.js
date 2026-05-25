// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const nav = document.getElementById('nav');
const toggle = nav.querySelector('.menu-toggle');
toggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

// Scroll progress
const scrollBar = document.getElementById('scroll-progress');
let ticking = false;
function updateScroll() {
  const el = document.scrollingElement || document.documentElement;
  const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
  scrollBar.style.width = pct + '%';
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; }
}, { passive: true });

// Parallax scroll effects
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
  const parallaxElements = document.querySelectorAll('.parallax-slow');
  const heroHeadline = document.querySelector('.hero-headline');
  const heroLede = document.querySelector('.hero-lede');
  
  let pTicking = false;
  function updateParallax() {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    
    // Hero parallax
    if (scrollY < vh) {
      if (heroHeadline) heroHeadline.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0)`;
      if (heroLede) heroLede.style.transform = `translate3d(0, ${scrollY * 0.06}px, 0)`;
    }
    
    // Section parallax – elements move slower than scroll
    parallaxElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (center - vh / 2) * 0.04;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
    
    pTicking = false;
  }
  window.addEventListener('scroll', () => {
    if (!pTicking) { requestAnimationFrame(updateParallax); pTicking = true; }
  }, { passive: true });
}

// Nav background on scroll
let navTicking = false;
function updateNav() {
  nav.style.boxShadow = window.scrollY > 10 ? '0 1px 20px rgba(0,0,0,0.06)' : 'none';
  navTicking = false;
}
window.addEventListener('scroll', () => {
  if (!navTicking) { requestAnimationFrame(updateNav); navTicking = true; }
}, { passive: true });

// ─── PRICING CARD SCROLL ENTRANCE ───
const priceCards = document.querySelectorAll('.price-card');
const priceIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      priceIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
priceCards.forEach(card => priceIO.observe(card));

// ─── REFERENZEN GALLERY SCROLL ENTRANCE ───
const refGallery = document.querySelector('.ref-gallery');
if (refGallery) {
  const refIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        refIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  refIO.observe(refGallery);
}

// ─── SECTION TITLE WORD SPLIT ───
document.querySelectorAll('.section-title').forEach(title => {
  const html = title.innerHTML;
  // Wrap each word (preserve <em> tags) in a .word span
  const wrapped = html.replace(/(<em>.*?<\/em>|\S+)/g, '<span class="word">$1</span> ');
  title.innerHTML = wrapped;
});
const titleIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('words-visible');
      titleIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.section-title').forEach(t => titleIO.observe(t));

// ─── ENHANCED MULTI-DEPTH PARALLAX ───
if (!prefersReducedMotion) {
  const allTitles = document.querySelectorAll('.section-title, .emergency h2');
  const allDescs = document.querySelectorAll('.section-desc, .emergency p');
  const statNums = document.querySelectorAll('.stat-num');
  
  let deepTicking = false;
  function updateDeepParallax() {
    const vh = window.innerHeight;
    
    allTitles.forEach(el => {
      const rect = el.getBoundingClientRect();
      const progress = (rect.top - vh) / vh;
      if (progress < 0.5 && progress > -1.5) {
        const offset = progress * -18;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });
    
    allDescs.forEach(el => {
      const rect = el.getBoundingClientRect();
      const progress = (rect.top - vh) / vh;
      if (progress < 0.5 && progress > -1.5) {
        const offset = progress * -10;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });
    
    statNums.forEach(el => {
      const rect = el.getBoundingClientRect();
      const progress = (rect.top - vh) / vh;
      if (progress < 0.5 && progress > -1.5) {
        const offset = progress * -12;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });
    
    deepTicking = false;
  }
  window.addEventListener('scroll', () => {
    if (!deepTicking) { requestAnimationFrame(updateDeepParallax); deepTicking = true; }
  }, { passive: true });
}

// Form submit — also saves lead to localStorage
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');
  const orig = btn.textContent;
  btn.textContent = 'Wird gesendet …';
  btn.disabled = true;
  const name = form.name.value;
  const email = form.email.value;
  const topic = form.topic.value;
  const message = form.message.value;

  // Save to localStorage
  const leads = JSON.parse(localStorage.getItem('admin-leads') || '[]');
  leads.unshift({
    id: Date.now(),
    date: new Date().toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }),
    name, email, topic, message,
    status: 'new'
  });
  localStorage.setItem('admin-leads', JSON.stringify(leads));

  const subject = `Anfrage: ${topic}`;
  const body = `Name: ${name}%0D%0AE-Mail: ${email}%0D%0A%0D%0A${message}`;
  setTimeout(() => {
    window.location.href = `mailto:brandundelektroservice@outlook.de?subject=${encodeURIComponent(subject)}&body=${body}`;
    btn.textContent = orig;
    btn.disabled = false;
    form.reset();
  }, 400);
}

// ─── COOKIE BANNER ───
(function() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  if (localStorage.getItem('cookie-consent')) return;
  setTimeout(() => banner.classList.add('show'), 1200);
  banner.querySelector('.cookie-accept').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'all');
    banner.classList.remove('show');
  });
  banner.querySelector('.cookie-decline').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'essential');
    banner.classList.remove('show');
  });
})();

// ─── ACCESSIBILITY WIDGET ───
(function() {
  const toggle = document.getElementById('a11y-toggle');
  const panel = document.getElementById('a11y-panel');
  const guide = document.getElementById('reading-guide');
  if (!toggle || !panel) return;

  // Toggle panel
  toggle.addEventListener('click', () => panel.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !toggle.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  // Font size
  let fontSize = parseInt(localStorage.getItem('a11y-fontsize') || '100');
  const sizeDisplay = document.getElementById('a11y-size-val');
  function applyFontSize() {
    document.documentElement.style.fontSize = fontSize + '%';
    if (sizeDisplay) sizeDisplay.textContent = fontSize + '%';
    localStorage.setItem('a11y-fontsize', fontSize);
  }
  applyFontSize();
  document.getElementById('a11y-size-up')?.addEventListener('click', () => {
    if (fontSize < 140) { fontSize += 10; applyFontSize(); }
  });
  document.getElementById('a11y-size-down')?.addEventListener('click', () => {
    if (fontSize > 80) { fontSize -= 10; applyFontSize(); }
  });

  // High contrast
  const contrastSwitch = document.getElementById('a11y-contrast');
  let contrastOn = localStorage.getItem('a11y-contrast') === 'true';
  function applyContrast() {
    document.body.classList.toggle('high-contrast', contrastOn);
    contrastSwitch?.classList.toggle('on', contrastOn);
    localStorage.setItem('a11y-contrast', contrastOn);
  }
  applyContrast();
  contrastSwitch?.addEventListener('click', () => { contrastOn = !contrastOn; applyContrast(); });

  // Reading guide
  const guideSwitch = document.getElementById('a11y-guide');
  let guideOn = localStorage.getItem('a11y-guide') === 'true';
  function applyGuide() {
    guide?.classList.toggle('active', guideOn);
    guideSwitch?.classList.toggle('on', guideOn);
    localStorage.setItem('a11y-guide', guideOn);
  }
  applyGuide();
  guideSwitch?.addEventListener('click', () => { guideOn = !guideOn; applyGuide(); });
  document.addEventListener('mousemove', (e) => {
    if (guide && guideOn) guide.style.top = e.clientY + 'px';
  });

  // Reset
  document.getElementById('a11y-reset')?.addEventListener('click', () => {
    fontSize = 100; applyFontSize();
    contrastOn = false; applyContrast();
    guideOn = false; applyGuide();
  });
})();

// ─── ADMIN PANEL ───
(function() {
  const overlay = document.getElementById('admin-overlay');
  const panel = document.getElementById('admin-panel');
  const pwInput = document.getElementById('admin-pw');
  const errorMsg = document.getElementById('admin-error');
  if (!overlay || !panel) return;

  // 5x logo click trigger
  let clickCount = 0;
  let clickTimer = null;
  const logoEl = document.querySelector('.logo');
  if (logoEl) {
    logoEl.addEventListener('click', (e) => {
      clickCount++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => clickCount = 0, 2000);
      if (clickCount >= 5) {
        e.preventDefault();
        clickCount = 0;
        overlay.classList.add('show');
        pwInput.value = '';
        errorMsg.style.display = 'none';
        setTimeout(() => pwInput.focus(), 100);
      }
    });
  }

  // Close login
  document.getElementById('admin-close')?.addEventListener('click', () => {
    overlay.classList.remove('show');
  });

  // Login
  function tryLogin() {
    if (pwInput.value === 'Brandschutz1!') {
      overlay.classList.remove('show');
      panel.classList.add('show');
      renderLeads();
    } else {
      errorMsg.style.display = 'block';
      pwInput.value = '';
      pwInput.focus();
    }
  }
  document.getElementById('admin-login-btn')?.addEventListener('click', tryLogin);
  pwInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryLogin(); });

  // Logout
  document.getElementById('admin-logout')?.addEventListener('click', () => {
    panel.classList.remove('show');
  });

  // Render leads table
  function renderLeads() {
    const leads = JSON.parse(localStorage.getItem('admin-leads') || '[]');
    const tbody = document.getElementById('admin-leads-body');
    const totalEl = document.getElementById('admin-total');
    const newEl = document.getElementById('admin-new');
    const doneEl = document.getElementById('admin-done');
    if (!tbody) return;

    const newCount = leads.filter(l => l.status === 'new').length;
    const doneCount = leads.filter(l => l.status === 'done').length;
    totalEl.innerHTML = `<em>${leads.length}</em>`;
    newEl.innerHTML = `<em>${newCount}</em>`;
    doneEl.innerHTML = `<em>${doneCount}</em>`;

    if (leads.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="admin-empty">Noch keine Anfragen eingegangen.</td></tr>';
      return;
    }

    tbody.innerHTML = leads.map(l => `
      <tr>
        <td>${l.date}</td>
        <td><strong>${l.name}</strong></td>
        <td><a href="mailto:${l.email}" style="color:var(--accent)">${l.email}</a></td>
        <td>${l.topic}</td>
        <td style="max-width:220px;white-space:pre-wrap;word-break:break-word">${l.message}</td>
        <td><span class="admin-badge ${l.status}">${l.status === 'new' ? 'Neu' : 'Erledigt'}</span></td>
        <td>
          <div class="admin-actions">
            ${l.status === 'new' ? `<button class="admin-action-btn" onclick="adminMarkDone(${l.id})">✓ Erledigt</button>` : ''}
            <button class="admin-action-btn delete" onclick="adminDelete(${l.id})">✕</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Global actions
  window.adminMarkDone = function(id) {
    const leads = JSON.parse(localStorage.getItem('admin-leads') || '[]');
    const lead = leads.find(l => l.id === id);
    if (lead) lead.status = 'done';
    localStorage.setItem('admin-leads', JSON.stringify(leads));
    renderLeads();
  };
  window.adminDelete = function(id) {
    let leads = JSON.parse(localStorage.getItem('admin-leads') || '[]');
    leads = leads.filter(l => l.id !== id);
    localStorage.setItem('admin-leads', JSON.stringify(leads));
    renderLeads();
  };
})();

// ─── LEGAL MODALS (Impressum / Datenschutz) ───
(function() {
  const modals = [
    { link: 'link-impressum', overlay: 'impressum-overlay' },
    { link: 'link-datenschutz', overlay: 'datenschutz-overlay' }
  ];

  modals.forEach(({ link, overlay }) => {
    const linkEl = document.getElementById(link);
    const overlayEl = document.getElementById(overlay);
    if (!linkEl || !overlayEl) return;

    const closeBtn = overlayEl.querySelector('.legal-modal-close');
    const modal = overlayEl.querySelector('.legal-modal');

    linkEl.addEventListener('click', (e) => {
      e.preventDefault();
      overlayEl.classList.add('show');
      document.body.style.overflow = 'hidden';
    });

    function closeModal() {
      overlayEl.classList.remove('show');
      document.body.style.overflow = '';
    }

    closeBtn?.addEventListener('click', closeModal);

    // Close on backdrop click
    overlayEl.addEventListener('click', (e) => {
      if (!modal.contains(e.target)) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlayEl.classList.contains('show')) closeModal();
    });
  });
})();
