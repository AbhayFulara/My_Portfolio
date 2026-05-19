/* ============================================================
   script.js — Abhay Fulara Portfolio
   ============================================================ */

// ── Scroll reveal ──
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.07 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── Mobile menu ──
function openMob() {
  document.getElementById('mobMenu').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMob() {
  document.getElementById('mobMenu').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Active nav highlight on scroll ──
const navAs = document.querySelectorAll('.nav-links a');
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  let cur = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) cur = s.id;
  });
  navAs.forEach(a => {
    const active = a.getAttribute('href') === '#' + cur;
    a.style.color = active ? 'var(--green)' : '';
    a.style.fontWeight = active ? '600' : '';
  });

  if (scrollTopBtn) {
    if (window.scrollY > 350) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  }
}, { passive: true });

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── PPT / Image Modal ──
function openModal(imgSrc, title) {
  document.getElementById('modalImg').src = imgSrc;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('pptModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('pptModal').classList.remove('open');
  document.body.style.overflow = '';
}
// Close on overlay click
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pptModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
});

// ── Theme toggle ──
function setThemeMode(mode) {
  document.body.dataset.theme = mode;
  const toggle = document.getElementById('themeToggle');
  if (mode === 'dark') {
    document.body.classList.add('dark');
    if (toggle) {
      toggle.textContent = '☀️';
      toggle.title = 'Switch to light mode';
    }
  } else {
    document.body.classList.remove('dark');
    if (toggle) {
      toggle.textContent = '🌙';
      toggle.title = 'Switch to dark mode';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setThemeMode('light');

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setThemeMode(document.body.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  const resumeBtn = document.querySelector('.btn-resume');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      console.log('Resume downloaded');
      // You can later connect analytics here
    });
  }
});