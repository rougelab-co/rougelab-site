/* ============================================================
   ROUGE LAB — main.js
   ============================================================ */

// ---------- NAV: scroll state ----------
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ---------- NAV: mobile toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

// ---------- TABS: workshops ----------
const tabs   = document.querySelectorAll('.workshops__tab');
const panels = document.querySelectorAll('.workshops__panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    const targetPanel = document.getElementById(`tab-${target}`);
    if (targetPanel) targetPanel.classList.add('active');
  });
});

// ---------- SCROLL REVEAL ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Add reveal class to key elements
document.querySelectorAll(
  '.about__grid, .workshop-card, .companies-card, .testimonial, .gallery__item, .contact__grid'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ---------- TEAM: image swap on viewport ----------
const teamCards = document.querySelectorAll('.team__card');

const teamObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  },
  { threshold: 0.45, rootMargin: '0px 0px -10% 0px' }
);

teamCards.forEach((card, index) => {
  card.style.setProperty('--team-delay', `${index * 180}ms`);
  teamObserver.observe(card);
});

// ---------- CONTACT FORM ----------
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const whatsappNumber = '51987142146';

const interestLabels = {
  adults: 'Talleres para adultos',
  kids: 'Talleres para ninos',
  companies: 'Experiencias para empresas',
  giftcard: 'Regalar un taller / Gift card'
};

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const interest = form.interest.value;
    const message = form.message.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      alert('Por favor ingresa tu nombre.');
      form.name.focus();
      return;
    }

    if (!email || !emailRe.test(email)) {
      alert('Por favor ingresa un correo electrónico válido.');
      form.email.focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Abriendo WhatsApp...';

    const interestLine = interest
      ? `Interes: ${interestLabels[interest] || interest}`
      : 'Interes: No especificado';

    const messageLine = message
      ? `Mensaje: ${message}`
      : 'Mensaje: Quiero recibir mas informacion.';

    const whatsappText = [
      'Hola Rouge Lab, quiero informacion sobre sus talleres.',
      `Nombre: ${name}`,
      `Correo: ${email}`,
      interestLine,
      messageLine
    ].join('\n');

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

    formSuccess.textContent = 'Te estamos llevando a WhatsApp...';
    window.open(whatsappUrl, '_blank', 'noopener');
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Enviar mensaje';
    setTimeout(() => { formSuccess.textContent = ''; }, 4000);
  });
}

// ---------- SMOOTH ACTIVE NAV LINK ----------
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll('.nav__links a').forEach(a => {
          a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => navObserver.observe(s));
