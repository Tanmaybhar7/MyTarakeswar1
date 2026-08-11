document.addEventListener('DOMContentLoaded', () => {

  function showAuthMessage(msg, type = 'error') {
    const box = document.getElementById('authMessage');
    if (!box) {
      alert(msg);
      return;
    }
    box.style.display = 'block';
    box.textContent = msg;

    if (type === 'error') {
      box.style.background = 'rgba(255, 77, 77, 0.25)';
      box.style.color = '#ff9999';
      box.style.border = '1px solid rgba(255, 77, 77, 0.5)';
    } else if (type === 'success') {
      box.style.background = 'rgba(46, 204, 113, 0.25)';
      box.style.color = '#7bed9f';
      box.style.border = '1px solid rgba(46, 204, 113, 0.5)';
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Signup Logic
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('signupName');
      const emailEl = document.getElementById('signupEmail');
      const passEl = document.getElementById('signupPassword');
      const confirmPassEl = document.getElementById('signupConfirmPassword');
      const submitBtn = document.getElementById('signupSubmitBtn');

      const name = nameEl ? nameEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim().toLowerCase() : '';
      const pass = passEl ? passEl.value : '';
      const confirmPass = confirmPassEl ? confirmPassEl.value : '';

      if (!name) {
        showAuthMessage('Please enter your full name.', 'error');
        return;
      }
      if (!email || !validateEmail(email)) {
        showAuthMessage('Please enter a valid email address.', 'error');
        return;
      }
      if (!pass || pass.length < 6) {
        showAuthMessage('Password must be at least 6 characters long.', 'error');
        return;
      }
      if (confirmPassEl && pass !== confirmPass) {
        showAuthMessage('Passwords do not match. Please try again.', 'error');
        return;
      }

      // Check existing users in localStorage
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('users')) || [];
      } catch (err) {
        users = [];
      }

      if (users.find(u => u.email === email)) {
        showAuthMessage('This email is already registered. Please login.', 'error');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;

      users.push({ name, email, password: pass });
      localStorage.setItem('users', JSON.stringify(users));

      showAuthMessage('Account created successfully! Redirecting to login...', 'success');

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1200);
    });
  }

  // Login Logic
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailEl = document.getElementById('loginEmail');
      const passEl = document.getElementById('loginPassword');
      const submitBtn = document.getElementById('loginSubmitBtn');

      const email = emailEl ? emailEl.value.trim().toLowerCase() : '';
      const pass = passEl ? passEl.value : '';

      if (!email || !validateEmail(email)) {
        showAuthMessage('Please enter a valid registered email.', 'error');
        return;
      }
      if (!pass) {
        showAuthMessage('Please enter your password.', 'error');
        return;
      }

      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('users')) || [];
      } catch (err) {
        users = [];
      }

      const user = users.find(u => u.email === email && u.password === pass);

      if (!user) {
        showAuthMessage('Invalid email or password. Please check your credentials.', 'error');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;

      // Store loggedInUser session
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      showAuthMessage('Login successful! Redirecting...', 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    });
  }

  // Logout Logic
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('loggedInUser');
      window.location.href = 'login.html';
    });
  }
});
