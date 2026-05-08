/* ============================================================
   JEETHY LABS — Script
============================================================ */

// ── Theme Toggle ──
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;

  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const moonIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const sunIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (toggle) toggle.innerHTML = t === 'dark' ? moonIcon : sunIcon;
    // store in memory only
  }

  applyTheme(theme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
    });
  }
})();

// ── Mobile Menu ──
const mobileBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
if (mobileBtn && navLinks) {
  mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    mobileBtn.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// ── Navbar Scroll Effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar && navbar.classList.add('scrolled');
  } else {
    navbar && navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Active Nav Link on Scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinkEls.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
sections.forEach(s => observer.observe(s));

// ── Scroll Reveal ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('revealed'), i * 80);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

// ── Animated Counter ──
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = performance.now();
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-number[data-target]');
      statNums.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── Live User Count Simulation ──
const liveUsersEl = document.getElementById('liveUsers');
if (liveUsersEl) {
  let currentUsers = 47;
  setInterval(() => {
    const delta = Math.floor(Math.random() * 5) - 2;
    currentUsers = Math.max(30, Math.min(150, currentUsers + delta));
    liveUsersEl.textContent = currentUsers;
  }, 3500);
}

// ── Contact Form Submit ──
const feedbackForm = document.getElementById('feedbackForm');
const formSuccess = document.getElementById('formSuccess');
if (feedbackForm && formSuccess) {
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = feedbackForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    setTimeout(() => {
      feedbackForm.reset();
      formSuccess.classList.add('show');
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1500);
  });
}

// ── Back to Top ──
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Modal System ──
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOutside(event, id) {
  if (event.target.id === id) closeModal(id);
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// ── Smooth Scroll for nav links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── App Launch Modal (Try Tool buttons) ──
const appTools = {
  chat: {
    title: '<i class="fas fa-brain"></i> AI Assistant',
    icon: '<i class="fas fa-brain"></i>',
    iconClass: 'icon-chat',
    desc: 'Engage in natural conversations, generate code, summarize documents, and more — powered by state-of-the-art LLMs on Google Cloud.',
    status: 'Live Now · Free to Try'
  },
  image: {
    title: '<i class="fas fa-palette"></i> Image Generate',
    icon: '<i class="fas fa-palette"></i>',
    iconClass: 'icon-image',
    desc: 'Transform text prompts into stunning high-resolution images. Multiple styles, inpainting, batch generation — all powered by AI.',
    status: 'Live Now · Free to Try'
  },
  song: {
    title: '<i class="fas fa-music"></i> AI Music Generate',
    icon: '<i class="fas fa-music"></i>',
    iconClass: 'icon-song',
    desc: 'Create original AI music from text prompts — choose genre, mood, and instruments. Perfect for creators, filmmakers, and musicians.',
    status: 'Live Now · Free to Try'
  }
};

function openAppModal(tool) {
  const data = appTools[tool];
  if (!data) return;
  document.getElementById('appModalTitle').innerHTML = data.title;
  const iconEl = document.getElementById('appModalIcon');
  iconEl.innerHTML = data.icon;
  iconEl.className = 'app-modal-icon ' + data.iconClass;
  document.getElementById('appModalDesc').textContent = data.desc;
  document.getElementById('appModalStatus').textContent = data.status;
  openModal('appModal');
}

// ── Image Gallery Slider ──
let galleryIndex = 0;
const galleryTotal = 3;

function galleryGoTo(index) {
  galleryIndex = index;
  const track = document.getElementById('imgGalleryTrack');
  if (track) track.style.transform = `translateX(-${galleryIndex * 100}%)`;
  document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === galleryIndex);
  });
}

function gallerySlide(dir) {
  galleryGoTo((galleryIndex + dir + galleryTotal) % galleryTotal);
}

// Auto-advance every 4 seconds
setInterval(() => gallerySlide(1), 4000);
