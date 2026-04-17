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

// ---------- ABOUT FEATURE SLIDER ----------
const aboutSliders = document.querySelectorAll('.about__feature-slider');

aboutSliders.forEach((slider) => {
  const aboutSlides = slider.querySelectorAll('.about__feature-slide');
  const aboutDots = slider.querySelectorAll('.about__feature-dot');

  if (aboutSlides.length <= 1) {
    return;
  }

  let aboutSlideIndex = 0;

  const setAboutSlide = (index) => {
    aboutSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === index);
    });

    aboutDots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === index);
    });
  };

  setAboutSlide(aboutSlideIndex);

  window.setInterval(() => {
    aboutSlideIndex = (aboutSlideIndex + 1) % aboutSlides.length;
    setAboutSlide(aboutSlideIndex);
  }, 5200);
});

// ---------- CONTACT FORM ----------
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const whatsappNumber = '51987142146';
const isEnglishPage = document.documentElement.lang.startsWith('en');

const interestLabels = isEnglishPage
  ? {
      adults: 'Adult programs',
      kids: 'Kids program',
      companies: 'Experiences for organizations',
      giftcard: 'Gift card / Gift a workshop'
    }
  : {
      adults: 'Talleres para adultos',
      kids: 'Talleres para niños',
      companies: 'Experiencias para organizaciones',
      giftcard: 'Regalar un taller / Gift card'
    };

const formCopy = isEnglishPage
  ? {
      nameRequired: 'Please enter your name.',
      emailRequired: 'Please enter a valid email address.',
      openingWhatsApp: 'Opening WhatsApp...',
      redirecting: 'We are taking you to WhatsApp...',
      submitIdle: 'Send message',
      namePrefix: 'Name',
      emailPrefix: 'Email',
      interestPrefix: 'Interest',
      unspecified: 'Not specified',
      messagePrefix: 'Message',
      defaultMessage: 'I would like to receive more information.',
      greeting: 'Hello Rouge Lab, I would like information about your programs and experiences.'
    }
  : {
      nameRequired: 'Por favor ingresa tu nombre.',
      emailRequired: 'Por favor ingresa un correo electrónico válido.',
      openingWhatsApp: 'Abriendo WhatsApp...',
      redirecting: 'Te estamos llevando a WhatsApp...',
      submitIdle: 'Enviar mensaje',
      namePrefix: 'Nombre',
      emailPrefix: 'Correo',
      interestPrefix: 'Interés',
      unspecified: 'No especificado',
      messagePrefix: 'Mensaje',
      defaultMessage: 'Quiero recibir más información.',
      greeting: 'Hola Rouge Lab, quiero información sobre sus programas y experiencias.'
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
      alert(formCopy.nameRequired);
      form.name.focus();
      return;
    }

    if (!email || !emailRe.test(email)) {
      alert(formCopy.emailRequired);
      form.email.focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = formCopy.openingWhatsApp;

    const interestLine = interest
      ? `${formCopy.interestPrefix}: ${interestLabels[interest] || interest}`
      : `${formCopy.interestPrefix}: ${formCopy.unspecified}`;

    const messageLine = message
      ? `${formCopy.messagePrefix}: ${message}`
      : `${formCopy.messagePrefix}: ${formCopy.defaultMessage}`;

    const whatsappText = [
      formCopy.greeting,
      `${formCopy.namePrefix}: ${name}`,
      `${formCopy.emailPrefix}: ${email}`,
      interestLine,
      messageLine
    ].join('\n');

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

    formSuccess.textContent = formCopy.redirecting;
    window.open(whatsappUrl, '_blank', 'noopener');
    form.reset();
    btn.disabled = false;
    btn.textContent = formCopy.submitIdle;
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

// ---------- PROMO MODAL ----------
// ⚡ CONFIGURACIÓN: cambiar a true para activar la oferta, false para desactivar
const PROMO_ACTIVE = true;

(function initPromo() {
  if (!PROMO_ACTIVE) return;
  const overlay = document.getElementById('promoOverlay');
  if (!overlay) return;

  // Mostrar tras 1.5s si no fue cerrado antes en esta sesión
  if (!sessionStorage.getItem('promo-dismissed')) {
    setTimeout(() => overlay.classList.add('active'), 1500);
  }

  const close = () => {
    overlay.classList.remove('active');
    sessionStorage.setItem('promo-dismissed', '1');
  };

  overlay.querySelector('.promo__close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Currency toggle
  const togBtn = overlay.querySelector('.promo__currency-toggle');
  if (togBtn) {
    const oldEl = overlay.querySelector('.promo__price-old');
    const newEl = overlay.querySelector('.promo__price-new');
    const prices = { PEN: ['S/ 149', 'S/ 69'], USD: ['US$ 40', 'US$ 19'] };
    let curr = 'PEN';
    const togLabel = isEnglishPage ? ['View in US$', 'View in S/'] : ['Ver en US$', 'Ver en S/'];
    togBtn.addEventListener('click', () => {
      curr = curr === 'PEN' ? 'USD' : 'PEN';
      oldEl.textContent = prices[curr][0];
      newEl.textContent = prices[curr][1];
      togBtn.textContent = curr === 'PEN' ? togLabel[0] : togLabel[1];
    });
  }

  // Countdown — expires April 22, 2026 11:59 PM Lima (UTC-5)
  const deadline = new Date('2026-04-22T23:59:59-05:00').getTime();
  const cdBox = document.getElementById('promoCountdown');
  if (cdBox) {
    const dEl = cdBox.querySelector('[data-cd="d"]');
    const hEl = cdBox.querySelector('[data-cd="h"]');
    const mEl = cdBox.querySelector('[data-cd="m"]');
    const sEl = cdBox.querySelector('[data-cd="s"]');
    const pad = (n) => String(n).padStart(2, '0');

    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        dEl.textContent = '00'; hEl.textContent = '00';
        mEl.textContent = '00'; sEl.textContent = '00';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      dEl.textContent = pad(d);
      hEl.textContent = pad(h);
      mEl.textContent = pad(m);
      sEl.textContent = pad(s);
    };

    tick();
    setInterval(tick, 1000);
  }
})();
