document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('hotelsList');
  let hotels = [];

  function buildCard(h) {
    const div = document.createElement('div');
    div.className = 'card';

    const img = document.createElement('img');
    img.src = h.image;
    img.alt = h.name;
    img.style.borderRadius = '8px';

    const h3 = document.createElement('h3');
    h3.textContent = h.name;

    const p = document.createElement('p');
    p.textContent = h.address;

    const roomsDiv = document.createElement('div');
    roomsDiv.style.marginTop = '8px';
    h.rooms.forEach(rm => {
      const row = document.createElement('div');
      row.textContent = `${rm.type} — ${rm.price}`;
      roomsDiv.appendChild(row);
    });

    const actions = document.createElement('div');
    actions.className = 'actions';

    const callBtn = document.createElement('a');
    callBtn.className = 'btn-small btn-call';
    callBtn.textContent = 'Call';
    callBtn.href = `tel:${h.phone}`;

    const mapBtn = document.createElement('a');
    mapBtn.className = 'btn-small btn-map';
    mapBtn.textContent = 'Open Map';
    const query = encodeURIComponent(h.googleMapsQuery || h.name + ' ' + h.address);
    mapBtn.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
    mapBtn.target = '_blank';

    actions.appendChild(callBtn);
    actions.appendChild(mapBtn);

    div.appendChild(img);
    div.appendChild(h3);
    div.appendChild(p);
    div.appendChild(roomsDiv);
    div.appendChild(actions);

    return div;
  }

  function render() {
    listEl.innerHTML = '';
    if(hotels.length === 0){
      listEl.innerHTML = '<p class="center">No hotels found.</p>';
      return;
    }
    hotels.forEach(h => {
      listEl.appendChild(buildCard(h));
    });
  }

  fetch('data/hotels.json')
    .then(res => res.json())
    .then(data => {
      hotels = data;
      render();
    })
    .catch(err => {
      console.error(err);
      listEl.innerHTML = '<p class="center">Failed to load hotels.</p>';
    });
});
