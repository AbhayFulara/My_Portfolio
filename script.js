/* ============================================================
   script.js — Abhay Fulara Portfolio
   ============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Scroll reveal ──
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      const delay = prefersReducedMotion ? 0 : i * 80;
      setTimeout(() => e.target.classList.add('visible'), delay);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.07 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── Mobile menu ──
function openMob() {
  document.getElementById('mobMenu').classList.add('open');
  document.body.style.overflow = 'hidden';
  const btn = document.querySelector('.hamburger');
  if (btn) btn.setAttribute('aria-expanded', 'true');
}
function closeMob() {
  document.getElementById('mobMenu').classList.remove('open');
  document.body.style.overflow = '';
  const btn = document.querySelector('.hamburger');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

// ── Active nav highlight + navbar scroll state ──
const navAs = document.querySelectorAll('.nav-links a');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const navEl = document.querySelector('nav');

window.addEventListener('scroll', () => {
  let cur = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) cur = s.id;
  });
  navAs.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });

  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('show', window.scrollY > 350);
  }
}, { passive: true });

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

// ── Animated stat counters ──
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const suffix = el.dataset.suffix || '';

  if (isNaN(target)) return;

  if (prefersReducedMotion) {
    el.textContent = target.toFixed(decimals) + suffix;
    return;
  }

  const duration = 1400;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = target * eased;
    el.textContent = current.toFixed(decimals) + suffix;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toFixed(decimals) + suffix;
    }
  }
  requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.hstat-n[data-target]').forEach(el => counterObs.observe(el));

// ── Project Screenshot Modal ──
let projectTiles = [];
let currentProjectIndex = 0;
let lastFocusedEl = null;

function collectProjectTiles() {
  projectTiles = Array.from(document.querySelectorAll('.proj-tile[data-has-image="true"]'));
}

function renderModal() {
  const tile = projectTiles[currentProjectIndex];
  if (!tile) return;

  const img = tile.querySelector('.proj-tile-media img');
  const title = tile.querySelector('.proj-tile-title');
  const techEls = tile.querySelectorAll('.tpill');

  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalTech = document.getElementById('modalTech');
  const modalPrevBtn = document.getElementById('modalPrev');
  const modalNextBtn = document.getElementById('modalNext');

  if (img && modalImg) {
    modalImg.src = img.src;
    modalImg.alt = img.alt;
  }
  if (title && modalTitle) {
    modalTitle.textContent = title.textContent.trim();
  }
  if (modalTech) {
    modalTech.innerHTML = '';
    techEls.forEach(t => {
      const span = document.createElement('span');
      span.className = 'modal-tpill';
      span.textContent = t.textContent;
      modalTech.appendChild(span);
    });
  }
  if (modalPrevBtn) modalPrevBtn.disabled = currentProjectIndex === 0;
  if (modalNextBtn) modalNextBtn.disabled = currentProjectIndex === projectTiles.length - 1;
}

function openModal(triggerEl) {
  collectProjectTiles();
  const tile = triggerEl.closest('.proj-tile');
  const idx = projectTiles.indexOf(tile);
  currentProjectIndex = idx >= 0 ? idx : 0;
  lastFocusedEl = triggerEl;

  renderModal();
  document.getElementById('pptModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('pptModal').classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocusedEl) {
    lastFocusedEl.focus();
    lastFocusedEl = null;
  }
}

function modalPrev() {
  if (currentProjectIndex > 0) {
    currentProjectIndex--;
    renderModal();
  }
}

function modalNext() {
  if (currentProjectIndex < projectTiles.length - 1) {
    currentProjectIndex++;
    renderModal();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('pptModal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
  }
});

document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('pptModal');
  if (!modal || !modal.classList.contains('open')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') modalPrev();
  if (e.key === 'ArrowRight') modalNext();
});

// ── Copy email ──
function copyEmail(e) {
  e.preventDefault();
  e.stopPropagation();
  const email = 'abhayfulara@gmail.com';
  const btn = e.currentTarget;
  const original = btn.textContent;

  const done = () => {
    btn.textContent = '✓';
    btn.classList.add('copied');
    btn.setAttribute('aria-label', 'Email copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
      btn.setAttribute('aria-label', 'Copy email address');
    }, 1600);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(done).catch(done);
  } else {
    done();
  }
}

// ── Theme toggle ──
function setThemeMode(mode) {
  document.body.dataset.theme = mode;
  try { localStorage.setItem('abhay_portfolio_theme', mode); } catch (e) {}
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

// ── Interactive Hero Background Controller ──
function initHeroBackground() {
  const canvas = document.getElementById('heroBgCanvas');
  if (!canvas) return;
}

// ── Achievements 3D Carousel Controller ──
function initAchievementsCarousel() {
  const section = document.getElementById('achievements');
  const carousel = document.getElementById('achCarousel');
  const cards = Array.from(document.querySelectorAll('.ach-card'));
  const dotsContainer = document.getElementById('achDots');
  const prevBtn = document.getElementById('achPrevBtn');
  const nextBtn = document.getElementById('achNextBtn');
  const autoToggleBtn = document.getElementById('achAutoToggle');

  if (!section || !carousel || cards.length === 0) return;

  const totalCards = cards.length;
  let activeIndex = 0;
  let isAutoScrollOn = true;
  let isHovered = false;
  let isSectionVisible = true;
  let autoScrollTimer = null;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Build pagination dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'ach-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to achievement ${i + 1} of ${totalCards}`);
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => {
        goToCard(i);
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.ach-dot')) : [];

  function updateCarousel() {
    cards.forEach((card, i) => {
      let diff = i - activeIndex;
      while (diff > totalCards / 2) diff -= totalCards;
      while (diff < -totalCards / 2) diff += totalCards;

      card.classList.remove('card-active', 'card-prev', 'card-next', 'card-hidden');

      if (diff === 0) {
        card.classList.add('card-active');
        card.setAttribute('aria-hidden', 'false');
        card.tabIndex = 0;
      } else if (diff === -1) {
        card.classList.add('card-prev');
        card.setAttribute('aria-hidden', 'false');
        card.tabIndex = -1;
      } else if (diff === 1) {
        card.classList.add('card-next');
        card.setAttribute('aria-hidden', 'false');
        card.tabIndex = -1;
      } else {
        card.classList.add('card-hidden');
        card.setAttribute('aria-hidden', 'true');
        card.tabIndex = -1;
      }
    });

    dots.forEach((dot, i) => {
      const isActive = i === activeIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function goToCard(index) {
    activeIndex = (index + totalCards) % totalCards;
    updateCarousel();
    if (isAutoScrollOn && !isHovered && isSectionVisible) {
      restartAutoScroll();
    }
  }

  function nextCard() {
    goToCard(activeIndex + 1);
  }

  function prevCard() {
    goToCard(activeIndex - 1);
  }

  function startAutoScroll() {
    stopAutoScroll();
    if (!isAutoScrollOn || prefersReduced || isHovered || !isSectionVisible) return;
    autoScrollTimer = setInterval(nextCard, 3800);
  }

  function stopAutoScroll() {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
  }

  function restartAutoScroll() {
    stopAutoScroll();
    startAutoScroll();
  }

  // Click on a side card brings it to center
  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      if (i !== activeIndex) {
        e.preventDefault();
        goToCard(i);
      }
    });
  });

  // Navigation arrow buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevCard();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextCard();
    });
  }

  // Auto-scroll toggle button
  if (autoToggleBtn) {
    autoToggleBtn.addEventListener('click', () => {
      isAutoScrollOn = !isAutoScrollOn;
      autoToggleBtn.classList.toggle('active', isAutoScrollOn);
      autoToggleBtn.setAttribute('aria-pressed', isAutoScrollOn ? 'true' : 'false');

      const txt = autoToggleBtn.querySelector('.auto-txt');
      if (txt) {
        txt.textContent = isAutoScrollOn ? 'Auto Scroll: ON' : 'Auto Scroll: OFF';
      }

      if (isAutoScrollOn) {
        startAutoScroll();
      } else {
        stopAutoScroll();
      }
    });
  }

  // Hover pauses auto-scroll
  carousel.addEventListener('mouseenter', () => {
    isHovered = true;
    stopAutoScroll();
  });

  carousel.addEventListener('mouseleave', () => {
    isHovered = false;
    if (isAutoScrollOn && isSectionVisible) {
      startAutoScroll();
    }
  });

  // Keyboard navigation
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevCard();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextCard();
    }
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isHovered = true;
    stopAutoScroll();
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    isHovered = false;
    if (isAutoScrollOn && isSectionVisible) {
      startAutoScroll();
    }

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > 36 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextCard();
      } else {
        prevCard();
      }
    }
  }, { passive: true });

  // IntersectionObserver to pause when off-screen
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isSectionVisible = entry.isIntersecting;
      if (isSectionVisible && isAutoScrollOn && !isHovered) {
        startAutoScroll();
      } else {
        stopAutoScroll();
      }
    });
  }, { threshold: 0.15 });

  obs.observe(section);

  updateCarousel();
  if (isAutoScrollOn && !prefersReduced) {
    startAutoScroll();
  }
}

// ── Skills Circular/Orbital Layout Controller ──
function initSkillsOrbit() {
  const stage = document.getElementById('skillsOrbitStage');
  const cardsContainer = document.getElementById('skillsOrbitCards');
  if (!stage || !cardsContainer) return;

  const cards = Array.from(cardsContainer.querySelectorAll('.sk-card'));
  const totalCards = cards.length;
  if (totalCards === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentAngle = -90; // Start top card at -90 degrees (12 o'clock)
  let isHovered = false;
  let isSectionVisible = true;
  let animId = null;

  // Orbit radius parameters (dynamically updated on resize)
  let radiusX = 330;
  let radiusY = 330;
  let isOrbitActive = true;

  function updateDimensions() {
    const stageWidth = stage.offsetWidth;
    // On screens <= 768px, layout adapts via CSS grid; disable orbital transforms
    if (window.innerWidth <= 768) {
      isOrbitActive = false;
      cards.forEach(card => {
        card.style.transform = '';
      });
      return;
    }

    isOrbitActive = true;
    if (window.innerWidth <= 1024) {
      radiusX = Math.min(270, (stageWidth * 0.42));
      radiusY = Math.min(270, (stageWidth * 0.42));
    } else {
      radiusX = Math.min(330, (stageWidth * 0.38));
      radiusY = Math.min(330, (stageWidth * 0.38));
    }
    renderCards();
  }

  function renderCards() {
    if (!isOrbitActive) return;

    const angleStep = 360 / totalCards;
    cards.forEach((card, index) => {
      const angleDeg = currentAngle + (index * angleStep);
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = Math.cos(angleRad) * radiusX;
      const y = Math.sin(angleRad) * radiusY;

      // Use 2 decimal places for sub-pixel precision to avoid 1px rounding jitter
      card.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px), 0)`;
    });
  }

  let lastTimestamp = null;
  // Desired rotation speed: ~6 degrees per second = 60s for full 360 deg turn
  const degreesPerSecond = 5;

  function step(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    if (isOrbitActive && !isHovered && isSectionVisible && !prefersReduced) {
      // Delta-time based smooth rotation regardless of screen refresh rate (60Hz, 120Hz, 144Hz)
      currentAngle = (currentAngle + (degreesPerSecond * delta)) % 360;
      renderCards();
    }
    animId = requestAnimationFrame(step);
  }

  // Hover pauses the orbital motion smoothly
  stage.addEventListener('mouseenter', () => { isHovered = true; });
  stage.addEventListener('mouseleave', () => {
    isHovered = false;
    lastTimestamp = performance.now(); // reset delta so it doesn't jump
  });
  stage.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
  stage.addEventListener('touchend', () => {
    isHovered = false;
    lastTimestamp = performance.now();
  }, { passive: true });

  // IntersectionObserver to pause when off-screen
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isSectionVisible = entry.isIntersecting;
    });
  }, { threshold: 0.1 });
  obs.observe(stage);

  window.addEventListener('resize', updateDimensions);

  // Initialize
  updateDimensions();
  renderCards();

  if (!prefersReduced) {
    animId = requestAnimationFrame(step);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = (function() {
    try { return localStorage.getItem('abhay_portfolio_theme'); } catch(e) { return null; }
  })() || 'dark';
  setThemeMode(savedTheme);

  initHeroBackground();
  initAchievementsCarousel();
  initSkillsOrbit();

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
    });
  }
});