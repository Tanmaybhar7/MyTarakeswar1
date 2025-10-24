document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('restaurantsList');
  const filterEl = document.getElementById('filterType');
  let restaurants = [];

  function buildCard(r) {
    const div = document.createElement('div');
    div.className = 'card';

    const img = document.createElement('img');
    img.src = r.image || 'images/default-restaurant.jpg';
    img.alt = r.name;
    img.style.borderRadius = '8px';

    const h3 = document.createElement('h3');
    h3.textContent = r.name;

    const p = document.createElement('p');
    p.textContent = r.address;

    const actions = document.createElement('div');
    actions.className = 'actions';

    if (r.phone) {
      const callBtn = document.createElement('a');
      callBtn.className = 'btn-small btn-call';
      callBtn.textContent = 'Call';
      callBtn.href = `tel:${r.phone}`;
      actions.appendChild(callBtn);
    }

    if (r.googleMapsQuery || r.address) {
      const mapBtn = document.createElement('a');
      mapBtn.className = 'btn-small btn-map';
      mapBtn.textContent = 'Open Map';
      const query = encodeURIComponent(r.googleMapsQuery || r.name + ' ' + r.address);
      mapBtn.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
      mapBtn.target = '_blank';
      actions.appendChild(mapBtn);
    }

    div.appendChild(img);
    div.appendChild(h3);
    div.appendChild(p);

    // Restaurant type
    const typeTag = document.createElement('span');
    typeTag.textContent = r.type || 'Both';
    typeTag.className = 'tag';
    div.appendChild(typeTag);

    div.appendChild(actions);

    return div;
  }

  function render() {
    listEl.innerHTML = '';
    if (restaurants.length === 0) {
      listEl.innerHTML = '<p class="center">No restaurants found.</p>';
      return;
    }
    restaurants.forEach(r => {
      listEl.appendChild(buildCard(r));
    });
  }

  function loadRestaurants(type = "All") {
    let url = 'http://localhost:5000/restaurants';
    if (type && type !== "All") {
      url += `?type=${encodeURIComponent(type)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        restaurants = data;
        render();
      })
      .catch(err => {
        console.error(err);
        listEl.innerHTML = '<p class="center">Failed to load restaurants.</p>';
      });
  }

  // Event listener for filter
  if (filterEl) {
    filterEl.addEventListener('change', e => {
      loadRestaurants(e.target.value);
    });
  }

  // Load all on page start
  loadRestaurants();
});
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
});