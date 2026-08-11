document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for Scroll Reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active-reveal');
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    reveals.forEach(el => el.classList.add('active-reveal'));
  }

  // Active TOC Highlight on Scroll
  const chapters = document.querySelectorAll('.chapter-card');
  const tocChips = document.querySelectorAll('.toc-chip');

  window.addEventListener('scroll', () => {
    let currentId = '';
    chapters.forEach(chap => {
      const top = chap.offsetTop - 120;
      if (window.scrollY >= top) {
        currentId = chap.getAttribute('id');
      }
    });

    tocChips.forEach(chip => {
      chip.classList.remove('active-chip');
      if (chip.getAttribute('href') === `#${currentId}`) {
        chip.classList.add('active-chip');
      }
    });

    // Back to top button visibility
    const bttBtn = document.getElementById('backToTop');
    if (bttBtn) {
      if (window.scrollY > 300) {
        bttBtn.classList.add('show-btn');
      } else {
        bttBtn.classList.remove('show-btn');
      }
    }
  });

  // Back to Top Button Click
  const bttBtn = document.getElementById('backToTop');
  if (bttBtn) {
    bttBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
