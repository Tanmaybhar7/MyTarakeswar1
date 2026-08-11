// js/route.js

document.addEventListener('DOMContentLoaded', () => {
  // Initialize map centered on Tarakeswar Temple
  const templeCoords = [22.8852478, 88.0174851];
  const map = L.map('map').setView(templeCoords, 15);

  // OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  // Default Markers
  const markers = [
    { name: "Tarakeswar Temple", coords: [22.8852478, 88.0174851], iconClass: "fa-solid fa-om", color: "#8b0000" },
    { name: "Police Station", coords: [22.8833067, 88.01783335], iconClass: "fa-solid fa-building-shield", color: "#111111" },
    { name: "Hospital", coords: [22.8798743, 88.0263139], iconClass: "fa-solid fa-square-h", color: "#d9534f" },
    { name: "Bus Stand", coords: [22.8806209, 88.0129270], iconClass: "fa-solid fa-bus", color: "#f0ad4e" },
    { name: "Railway Station", coords: [22.8821589, 88.0144998], iconClass: "fa-solid fa-train", color: "#0275d8" }
  ];

  markers.forEach(m => {
    const icon = L.divIcon({
      html: `<i class="${m.iconClass}" style="color:${m.color}; font-size:24px; text-shadow: 0 2px 5px rgba(0,0,0,0.3);"></i>`,
      className: 'custom-leaflet-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    });
    L.marker(m.coords, { icon }).addTo(map).bindPopup(`<strong>${m.name}</strong>`);
  });

  let routingControl = null;
  let isProcessing = false;

  const locateBtn = document.getElementById("locateBtn");
  const startAddressInput = document.getElementById("startAddress");
  const searchRouteBtn = document.getElementById("searchRouteBtn");
  const clearRouteBtn = document.getElementById("clearRouteBtn");
  const routeStatus = document.getElementById("routeStatus");

  function showStatus(msg, type = "info") {
    if (!routeStatus) return;
    routeStatus.style.display = "block";
    routeStatus.className = `route-status-msg status-${type}`;
    if (type === "loading") {
      routeStatus.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${msg}`;
    } else if (type === "error") {
      routeStatus.innerHTML = `<i class="fas fa-circle-exclamation"></i> ${msg}`;
    } else if (type === "success") {
      routeStatus.innerHTML = `<i class="fas fa-circle-check"></i> ${msg}`;
    } else {
      routeStatus.innerHTML = msg;
    }
  }

  function hideStatus() {
    if (routeStatus) {
      routeStatus.style.display = "none";
      routeStatus.innerHTML = "";
    }
  }

  // Draw Route Function
  function drawRoute(startCoords, startName = "Starting Location") {
    if (routingControl) {
      map.removeControl(routingControl);
      routingControl = null;
    }

    try {
      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(startCoords[0], startCoords[1]),
          L.latLng(templeCoords[0], templeCoords[1])
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        show: true,
        collapsible: true,
        createMarker: function (i, wp, nWps) {
          if (i === 0) {
            return L.marker(wp.latLng).bindPopup(`<b>${startName}</b>`).openPopup();
          }
          if (i === nWps - 1) {
            return L.marker(wp.latLng).bindPopup("<b>Baba Taraknath Temple</b>");
          }
          return null;
        }
      }).addTo(map);

      routingControl.on('routesfound', function () {
        showStatus("Route calculated successfully!", "success");
        if (clearRouteBtn) clearRouteBtn.style.display = "inline-block";
        isProcessing = false;
      });

      routingControl.on('routingerror', function () {
        showStatus("Could not calculate route. Please try another starting point.", "error");
        isProcessing = false;
      });
    } catch (err) {
      console.error(err);
      showStatus("Routing service error. Please try again.", "error");
      isProcessing = false;
    }
  }

  // GPS Location Handler
  if (locateBtn) {
    locateBtn.addEventListener("click", () => {
      if (isProcessing) return;

      if (!navigator.geolocation) {
        showStatus("Geolocation is not supported by your browser. Please type your location manually.", "error");
        return;
      }

      isProcessing = true;
      showStatus("Acquiring your GPS position...", "loading");

      navigator.geolocation.getCurrentPosition(
        pos => {
          const loc = [pos.coords.latitude, pos.coords.longitude];
          map.setView(loc, 14);
          drawRoute(loc, "Your Current Location");
        },
        err => {
          isProcessing = false;
          console.warn("Geolocation error:", err);
          let errorMsg = "Could not access your location. ";
          if (err.code === err.PERMISSION_DENIED) {
            errorMsg += "Location permission was denied. Please enter your city manually.";
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            errorMsg += "Location information is unavailable. Please enter your location manually.";
          } else if (err.code === err.TIMEOUT) {
            errorMsg += "Location request timed out. Please try again or type manually.";
          } else {
            errorMsg += "Please enter your location manually.";
          }
          showStatus(errorMsg, "error");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  // Local Common Place Fallbacks (quick matching without network delays)
  const knownPlaces = {
    "howrah": [22.5958, 88.2636],
    "kolkata": [22.5726, 88.3639],
    "sheoraphuli": [22.7533, 88.3377],
    "chinsurah": [22.9038, 88.3968],
    "chunchura": [22.9038, 88.3968],
    "bandel": [22.9234, 88.3752],
    "serampore": [22.7523, 88.3426],
    "shrirampur": [22.7523, 88.3426],
    "burdwan": [23.2324, 87.8615],
    "bardhaman": [23.2324, 87.8615],
    "arambagh": [22.8800, 87.7800],
    "tarakeswar": [22.8852, 88.0175]
  };

  // Search Address Handler
  async function searchAddress() {
    if (isProcessing) return;
    const query = startAddressInput ? startAddressInput.value.trim() : "";
    if (!query) {
      showStatus("Please enter a starting city or address.", "error");
      return;
    }

    isProcessing = true;
    showStatus(`Searching location for "${query}"...`, "loading");

    const lower = query.toLowerCase();
    for (const key in knownPlaces) {
      if (lower.includes(key)) {
        const coords = knownPlaces[key];
        map.setView(coords, 12);
        drawRoute(coords, query);
        return;
      }
    }

    // Geocoding via Nominatim API
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', West Bengal, India')}`);
      const data = await res.json();

      if (data && data.length > 0) {
        const first = data[0];
        const coords = [parseFloat(first.lat), parseFloat(first.lon)];
        map.setView(coords, 12);
        drawRoute(coords, first.display_name.split(',')[0]);
      } else {
        isProcessing = false;
        showStatus(`Could not find location "${query}". Please check spelling or try a nearby city name.`, "error");
      }
    } catch (err) {
      console.error(err);
      isProcessing = false;
      showStatus("Failed to search address. Please check your internet connection.", "error");
    }
  }

  if (searchRouteBtn) {
    searchRouteBtn.addEventListener("click", searchAddress);
  }

  if (startAddressInput) {
    startAddressInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchAddress();
      }
    });
  }

  // Clear Route Handler
  if (clearRouteBtn) {
    clearRouteBtn.addEventListener("click", () => {
      if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
      }
      hideStatus();
      map.setView(templeCoords, 15);
      clearRouteBtn.style.display = "none";
      if (startAddressInput) startAddressInput.value = "";
    });
  }
});
