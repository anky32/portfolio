/* ============================================
   ARPAN PANDEY — PORTFOLIO SCRIPTS v3
   ============================================ */

/* ---- Respect user motion preference throughout ---- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Page fade-in: removes loading class once everything has settled ---- */
window.addEventListener('load', () => {
  document.body.classList.remove('body-loading');
});

/* ---- Dynamic footer year ---- */
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(section => sectionObserver.observe(section));

/* ---- Hamburger mobile menu with aria-expanded ---- */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ---- Typing effect (skip if reduced motion) ---- */
const typedEl = document.getElementById('typedText');

if (prefersReducedMotion) {
  typedEl.textContent = 'AI Agents';
} else {
  const phrases = [
    'AI Agents',
    'LLM Applications',
    'RAG Systems',
    'ML Models',
    'Automation Bots',
    'Full-Stack Apps',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIndex];
    if (!isDeleting) {
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(type, isDeleting ? 60 : 90);
  }

  type();
}

/* ---- Hero code card: cycle self.skills value ---- */
const codeSkillEl = document.getElementById('codeSkill');
if (codeSkillEl && !prefersReducedMotion) {
  const codeSkills = [
    '"LLMs"', '"RAG"', '"Agents"', '"LangChain"',
    '"Django"', '"Streamlit"', '"PyTorch"', '"NLP"',
  ];
  let codeSkillIndex = 0;

  setInterval(() => {
    codeSkillEl.classList.add('fade-out');
    setTimeout(() => {
      codeSkillIndex = (codeSkillIndex + 1) % codeSkills.length;
      codeSkillEl.textContent = codeSkills[codeSkillIndex];
      codeSkillEl.classList.remove('fade-out');
    }, 300);
  }, 2000);
}

/* ---- Floating particles (none if reduced motion) ---- */
if (!prefersReducedMotion) {
  const particlesContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 12;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 2.5 + 1;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 18 + 12}s;
      animation-delay: ${Math.random() * 12}s;
    `;
    particlesContainer.appendChild(p);
  }
}

/* ---- Scroll reveal ---- */
function revealOnScroll(selector) {
  const elements = document.querySelectorAll(selector);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
        if (prefersReducedMotion) {
          entry.target.classList.add('visible');
        } else {
          setTimeout(() => entry.target.classList.add('visible'), delay);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

revealOnScroll('.skill-category');
revealOnScroll('.project-card');
revealOnScroll('.cert-card');

const genericRevealEls = document.querySelectorAll(
  '.section-header, .about-grid, .contact-grid, .cert-grid, .coursework-wrap, .projects-cta'
);
const genericObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      genericObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

genericRevealEls.forEach(el => {
  el.classList.add('reveal');
  genericObserver.observe(el);
});

/* ---- Back to top ---- */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

/* ---- Contact form (Formspree) ---- */
const contactForm = document.getElementById('contactForm');
const FORMSPREE_ID = 'mzeegppg';

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  const originalHTML = btn.innerHTML;

  btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
  btn.disabled = true;

  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(contactForm),
    });

    if (response.ok) {
      btn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Message Sent!';
      btn.style.background = '#16a34a';
      contactForm.querySelectorAll('input, textarea').forEach(el => (el.value = ''));
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    } else {
      const data = await response.json();
      const msg = data?.errors?.map(err => err.message).join(', ') || 'Submission failed.';
      btn.innerHTML = '<i class="fas fa-exclamation-circle" aria-hidden="true"></i> Failed — try email';
      btn.style.background = '#dc2626';
      console.error('Formspree error:', msg);
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    }
  } catch (err) {
    btn.innerHTML = '<i class="fas fa-exclamation-circle" aria-hidden="true"></i> Network error';
    btn.style.background = '#dc2626';
    console.error('Form submit error:', err);
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  }
});

/* ---- Smooth scroll — only true anchor links, skips bare "#" (demo placeholder) ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return; // let demo/placeholder links do nothing
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  });
});

/* ---- Card tilt effect (skipped if reduced motion) ---- */
if (!prefersReducedMotion) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -3;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 3;
      card.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
