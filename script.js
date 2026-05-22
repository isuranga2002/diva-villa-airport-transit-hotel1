/* DIVA VILLA — Interactions */

// ---------- Scroll progress bar
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}

// ---------- Nav: scrolled state + dark-overlay state
const nav = document.querySelector('.nav');
const hero = document.querySelector('.hero');
function onScroll() {
  const y = window.scrollY;
  if (nav) nav.classList.toggle('scrolled', y > 60);
  if (hero && nav) {
    const heroBottom = hero.offsetTop + hero.offsetHeight - 100;
    nav.classList.toggle('over-dark', y < heroBottom);
  }
  // Subtle hero movement. Avoid scaling the whole background; it softens photos.
  const bg = document.querySelector('.hero-bg');
  if (bg && y < window.innerHeight) {
    bg.style.transform = `translateY(${y * 0.12}px)`;
  }
  updateProgress();
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Mobile menu (animated slide)
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      toggle.classList.remove('open');
      links.classList.remove('open');
    }
  });
}

// ---------- Reveal on scroll (enhanced)
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal, .reveal-x, .reveal-right, .stagger, .slide-left, .slide-right').forEach(el => io.observe(el));

// ---------- Tour timeline sequential reveal
const timelineSteps = document.querySelectorAll('.route-step');
if (timelineSteps.length) {
  const tio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = [...timelineSteps].indexOf(e.target);
        setTimeout(() => {
          e.target.classList.add('in');
        }, idx * 180);
        tio.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  timelineSteps.forEach(step => tio.observe(step));
}

// ---------- Count-up stats
const counters = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseFloat(el.dataset.count);
    const dur = 1600;
    const start = performance.now();
    const suffix = el.dataset.suffix || '';
    function tick(t) {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    cio.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => cio.observe(c));

// ---------- Lightbox
const lb = document.getElementById('lightbox');
if (lb) {
  const lbImg = lb.querySelector('img');
  let lbIndex = 0;
  const lbItems = [...document.querySelectorAll('.masonry-item img')];
  const lbSrcs = lbItems.map(img => img.src);

  function openLB(i) {
    lbIndex = i;
    lbImg.src = lbSrcs[i];
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLB() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function navLB(d) {
    lbIndex = (lbIndex + d + lbSrcs.length) % lbSrcs.length;
    lbImg.src = lbSrcs[lbIndex];
  }
  document.querySelectorAll('.masonry-item').forEach((it, i) =>
    it.addEventListener('click', () => openLB(i)));
  lb.querySelector('.lbclose').addEventListener('click', closeLB);
  lb.querySelector('.lbprev').addEventListener('click', () => navLB(-1));
  lb.querySelector('.lbnext').addEventListener('click', () => navLB(1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') navLB(-1);
    if (e.key === 'ArrowRight') navLB(1);
  });
}

// ---------- Booking Modal
  const body = document.body;

  // Hero Carousel
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 7000);
  }

  // Booking Modal
const modal = document.getElementById('booking-modal');
const modalOverlay = document.getElementById('modal-overlay');

function openModal() {
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.querySelector('.modal-box').classList.add('in'), 10);
}
function closeModal() {
  if (!modal) return;
  modal.querySelector('.modal-box').classList.remove('in');
  setTimeout(() => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }, 320);
}

// All booking trigger buttons
document.querySelectorAll('[data-booking-trigger]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

// WhatsApp booking
document.querySelectorAll('[data-whatsapp]').forEach(btn => {
  btn.addEventListener('click', () => {
    const num = '94712025453';
    const msg = encodeURIComponent("Hello, I'd like to enquire about a room booking at Diva Villa Transit Hotel. Please share availability and details.");
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
  });
});

// ---------- Video player (gallery)
const featuredVideo = document.getElementById('featured-video');
const videoToggle = document.getElementById('video-toggle');
if (featuredVideo && videoToggle) {
  videoToggle.addEventListener('click', () => {
    if (featuredVideo.paused) {
      featuredVideo.play();
      videoToggle.classList.add('playing');
    } else {
      featuredVideo.pause();
      videoToggle.classList.remove('playing');
    }
  });
  featuredVideo.addEventListener('click', () => {
    if (featuredVideo.paused) {
      featuredVideo.play();
      videoToggle.classList.add('playing');
    } else {
      featuredVideo.pause();
      videoToggle.classList.remove('playing');
    }
  });
}

// ---------- Image frame staggered reveal on load
window.addEventListener('load', () => {
  document.querySelectorAll('.img-frame').forEach((el, i) => {
    setTimeout(() => el.classList.add('loaded'), i * 80);
  });
});

// ---------- Active nav link for sub-pages
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});
