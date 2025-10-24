document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if(toggle && navLinks){
    toggle.addEventListener('click', ()=> {
      navLinks.classList.toggle('show');
      toggle.classList.toggle('open');
    });
  }

  const slides = document.querySelectorAll('.slide');
  if(slides && slides.length){
    let idx = 0;
    slides[idx].classList.add('active');
    setInterval(()=>{
      slides[idx].classList.remove('active');
      idx = (idx+1) % slides.length;
      slides[idx].classList.add('active');
    }, 4500);
  }
});
