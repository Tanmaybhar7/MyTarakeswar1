document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  // Mobile Navigation Toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('show');
      toggle.classList.toggle('open');
    });

    // Close menu when a navigation link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        toggle.classList.remove('open');
      });
    });

    // Close menu when clicking outside the navbar
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
        navLinks.classList.remove('show');
        toggle.classList.remove('open');
      }
    });
  }

  // Active Link Highlight matching current page URL
  const currentPath = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
  if (navLinks) {
    const navAnchors = navLinks.querySelectorAll('a');
    navAnchors.forEach(a => {
      const href = a.getAttribute('href').toLowerCase();
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  // Hero Background Image Slider (index.html)
  const slides = document.querySelectorAll('.slide');
  if (slides && slides.length > 0) {
    let idx = 0;
    slides[idx].classList.add('active');
    setInterval(() => {
      slides[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }, 4500);
  }
});
