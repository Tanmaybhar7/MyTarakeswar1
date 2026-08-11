document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('hotelsList');
  const searchEl = document.getElementById('searchInput');
  const sortEl = document.getElementById('sortPrice');
  let rawHotels = [];

  function getMinRoomPrice(hotel) {
    if (!hotel.rooms || !hotel.rooms.length) return 0;
    let min = Infinity;
    hotel.rooms.forEach(rm => {
      const match = (rm.price || '').match(/\d+/);
      if (match) {
        const val = parseInt(match[0], 10);
        if (val < min) min = val;
      }
    });
    return min === Infinity ? 0 : min;
  }

  function buildCard(h) {
    const div = document.createElement('div');
    div.className = 'card';

    const img = document.createElement('img');
    img.src = h.image || 'images/TAR1.jpg';
    img.alt = h.name || 'Hotel';
    img.style.borderRadius = '8px';
    img.onerror = () => {
      img.onerror = null;
      img.src = 'images/TAR1.jpg';
    };

    const h3 = document.createElement('h3');
    h3.textContent = h.name || 'Unnamed Hotel';

    const p = document.createElement('p');
    p.textContent = h.address || 'Tarakeswar';

    const roomsDiv = document.createElement('div');
    roomsDiv.style.marginTop = '8px';
    roomsDiv.style.fontSize = '0.9rem';
    roomsDiv.style.color = '#555';

    if (h.rooms && h.rooms.length) {
      h.rooms.forEach(rm => {
        const row = document.createElement('div');
        row.style.padding = '2px 0';
        row.innerHTML = `<strong>${rm.type}:</strong> ${rm.price}`;
        roomsDiv.appendChild(row);
      });
    }

    const actions = document.createElement('div');
    actions.className = 'actions';

    if (h.phone) {
      const callBtn = document.createElement('a');
      callBtn.className = 'btn-small btn-call';
      callBtn.textContent = 'Call';
      callBtn.href = `tel:${h.phone}`;
      actions.appendChild(callBtn);
    }

    if (h.googleMapsQuery || h.address || h.name) {
      const mapBtn = document.createElement('a');
      mapBtn.className = 'btn-small btn-map';
      mapBtn.textContent = 'Open Map';
      const query = encodeURIComponent(h.googleMapsQuery || (h.name + ' ' + h.address));
      mapBtn.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
      mapBtn.target = '_blank';
      mapBtn.rel = 'noopener noreferrer';
      actions.appendChild(mapBtn);
    }

    div.appendChild(img);
    div.appendChild(h3);
    div.appendChild(p);
    div.appendChild(roomsDiv);
    div.appendChild(actions);

    return div;
  }

  function applyFiltersAndRender() {
    if (!listEl) return;
    listEl.innerHTML = '';

    const searchQuery = searchEl ? searchEl.value.trim().toLowerCase() : '';
    const sortVal = sortEl ? sortEl.value : 'default';

    let filtered = rawHotels.filter(h => {
      if (searchQuery) {
        const nameMatch = (h.name || '').toLowerCase().includes(searchQuery);
        const addressMatch = (h.address || '').toLowerCase().includes(searchQuery);
        if (!nameMatch && !addressMatch) return false;
      }
      return true;
    });

    if (sortVal === 'low-high') {
      filtered.sort((a, b) => getMinRoomPrice(a) - getMinRoomPrice(b));
    } else if (sortVal === 'high-low') {
      filtered.sort((a, b) => getMinRoomPrice(b) - getMinRoomPrice(a));
    }

    if (filtered.length === 0) {
      listEl.innerHTML = '<p class="center" style="grid-column: 1/-1; padding: 20px; color: var(--muted);">No hotels found matching your search criteria.</p>';
      return;
    }

    filtered.forEach(h => {
      listEl.appendChild(buildCard(h));
    });
  }

  if (listEl) {
    listEl.innerHTML = '<p class="center" style="grid-column: 1/-1; padding: 20px;">Loading hotels...</p>';
  }

  fetch('data/hotels.json')
    .then(res => {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    })
    .then(data => {
      rawHotels = data || [];
      applyFiltersAndRender();
    })
    .catch(err => {
      console.error(err);
      if (listEl) {
        listEl.innerHTML = '<p class="center" style="grid-column: 1/-1; padding: 20px; color: #d00;">Failed to load hotels. Please refresh the page.</p>';
      }
    });

  if (searchEl) searchEl.addEventListener('input', applyFiltersAndRender);
  if (sortEl) sortEl.addEventListener('change', applyFiltersAndRender);
});
