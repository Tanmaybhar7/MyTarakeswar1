document.addEventListener('DOMContentLoaded', ()=> {

  const signupForm = document.getElementById('signupForm');
  if(signupForm){
    signupForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim().toLowerCase();
      const pass = document.getElementById('signupPassword').value;

      let users = JSON.parse(localStorage.getItem('users')) || [];
      if(users.find(u=>u.email===email)){
        alert('Email already registered. Please login.');
        return;
      }
      users.push({ name, email, password: pass });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Signup successful. Please login.');
      window.location.href = 'login.html';
    });
  }

  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const pass = document.getElementById('loginPassword').value;

      let users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email===email && u.password===pass);
      if(!user){ alert('Invalid credentials'); return; }

      localStorage.setItem('loggedInUser', JSON.stringify(user));
      window.location.href = 'index.html';
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn){
    logoutBtn.addEventListener('click', ()=> {
      localStorage.removeItem('loggedInUser');
      window.location.href = 'login.html';
    });
  }
});
