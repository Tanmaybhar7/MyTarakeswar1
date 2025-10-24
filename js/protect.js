(function(){
  const allowed = ['login.html','signup.html'];
  const path = window.location.pathname.split('/').pop();
  if(allowed.includes(path)) return;

  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if(!user) {
    window.location.href = 'login.html';
  } else {
    const nameHolder = document.getElementById('userNameDisplay');
    if(nameHolder) nameHolder.textContent = user.name;
  }
})();
