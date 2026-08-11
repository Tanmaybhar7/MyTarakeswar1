(function(){
  const allowed = ['login.html', 'signup.html'];
  const currentPath = window.location.pathname.split('/').pop().toLowerCase();

  // Allow login and signup pages without session
  if (allowed.includes(currentPath)) return;

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('loggedInUser'));
  } catch (e) {
    user = null;
  }

  if (!user) {
    window.location.href = 'login.html';
  } else {
    // Safely update greeting after DOM elements are ready
    document.addEventListener('DOMContentLoaded', () => {
      const nameHolder = document.getElementById('userNameDisplay');
      if (nameHolder && user.name) {
        nameHolder.textContent = `Hi, ${user.name}`;
      }
    });
  }
})();
