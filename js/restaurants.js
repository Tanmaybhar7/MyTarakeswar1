document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('restaurantsList');
  const filterEl = document.getElementById('filterType');
  const searchEl = document.getElementById('searchInput');
  const sortEl = document.getElementById('sortPrice');

  let rawRestaurants = [];

  function getMinPrice(priceStr) {
    if (!priceStr) return 0;
    const match = priceStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  function buildCard(r) {
    const div = document.createElement('div');
    div.className = 'card';

    const img = document.createElement('img');
    img.src = r.image || 'images/TAR2.jpg';
    img.alt = r.name || 'Restaurant';
    img.style.borderRadius = '8px';
    img.onerror = () => {
      img.onerror = null;
      img.src = 'images/TAR2.jpg';
    };

    const h3 = document.createElement('h3');
    h3.textContent = r.name || 'Unnamed Restaurant';

    const pAddress = document.createElement('p');
    pAddress.textContent = r.address || 'Tarakeswar';

    const pPrice = document.createElement('p');
    pPrice.style.fontWeight = 'bold';
    pPrice.style.marginTop = '4px';
    pPrice.style.color = '#8b0000';
    pPrice.textContent = r.price_range ? `Price Range: ${r.price_range}` : '';

    const typeTag = document.createElement('span');
    typeTag.textContent = r.type || 'Veg/Non-Veg';
    typeTag.className = 'tag';
    typeTag.style.display = 'inline-block';
    typeTag.style.marginTop = '6px';
    typeTag.style.padding = '3px 8px';
    typeTag.style.borderRadius = '6px';
    typeTag.style.fontSize = '0.82rem';
    typeTag.style.fontWeight = 'bold';
    if (r.type === 'Veg') {
      typeTag.style.background = '#e6f4ea';
      typeTag.style.color = '#137333';
    } else if (r.type === 'Non-Veg') {
      typeTag.style.background = '#fce8e6';
      typeTag.style.color = '#c5221f';
    } else {
      typeTag.style.background = '#feefe3';
      typeTag.style.color = '#b06000';
    }

    const actions = document.createElement('div');
    actions.className = 'actions';

    if (r.phone) {
      const callBtn = document.createElement('a');
      callBtn.className = 'btn-small btn-call';
      callBtn.textContent = 'Call';
      callBtn.href = `tel:${r.phone}`;
      actions.appendChild(callBtn);
    }

    if (r.googleMapsQuery || r.address || r.name) {
      const mapBtn = document.createElement('a');
      mapBtn.className = 'btn-small btn-map';
      mapBtn.textContent = 'Open Map';
      const query = encodeURIComponent(r.googleMapsQuery || (r.name + ' ' + r.address));
      mapBtn.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
      mapBtn.target = '_blank';
      mapBtn.rel = 'noopener noreferrer';
      actions.appendChild(mapBtn);
    }

    div.appendChild(img);
    div.appendChild(h3);
    div.appendChild(pAddress);
    if (r.price_range) div.appendChild(pPrice);
    div.appendChild(typeTag);
    div.appendChild(actions);

    return div;
  }

  function applyFiltersAndRender() {
    if (!listEl) return;
    listEl.innerHTML = '';

    const selectedType = filterEl ? filterEl.value : 'All';
    const searchQuery = searchEl ? searchEl.value.trim().toLowerCase() : '';
    const sortVal = sortEl ? sortEl.value : 'default';

    let filtered = rawRestaurants.filter(r => {
      // Food Type filter
      if (selectedType !== 'All') {
        if (selectedType === 'Veg' && r.type !== 'Veg') return false;
        if (selectedType === 'Non-Veg' && r.type !== 'Non-Veg') return false;
        if (selectedType === 'Both' && r.type !== 'Both') return false;
      }

      // Search Query filter
      if (searchQuery) {
        const nameMatch = (r.name || '').toLowerCase().includes(searchQuery);
        const addressMatch = (r.address || '').toLowerCase().includes(searchQuery);
        const typeMatch = (r.type || '').toLowerCase().includes(searchQuery);
        if (!nameMatch && !addressMatch && !typeMatch) return false;
      }

      return true;
    });

    // Price Sorting
    if (sortVal === 'low-high') {
      filtered.sort((a, b) => getMinPrice(a.price_range) - getMinPrice(b.price_range));
    } else if (sortVal === 'high-low') {
      filtered.sort((a, b) => getMinPrice(b.price_range) - getMinPrice(a.price_range));
    }

    if (filtered.length === 0) {
      listEl.innerHTML = '<p class="center" style="grid-column: 1/-1; padding: 20px; color: var(--muted);">No restaurants found matching your search criteria.</p>';
      return;
    }

    filtered.forEach(r => {
      listEl.appendChild(buildCard(r));
    });
  }

  // Load restaurants directly from data/restaurants.json (Fixing previous localhost:5000 API bug)
  fetch('data/restaurants.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load JSON');
      return res.json();
    })
    .then(data => {
      rawRestaurants = data || [];
      applyFiltersAndRender();
    })
    .catch(err => {
      console.error(err);
      if (listEl) {
        listEl.innerHTML = '<p class="center" style="grid-column: 1/-1; padding: 20px; color: #d00;">Unable to load restaurant listings. Please refresh the page.</p>';
      }
    });

  if (filterEl) filterEl.addEventListener('change', applyFiltersAndRender);
  if (searchEl) searchEl.addEventListener('input', applyFiltersAndRender);
  if (sortEl) sortEl.addEventListener('change', applyFiltersAndRender);
});