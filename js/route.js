// Initialize map
const map = L.map('map').setView([22.8852478, 88.0174851], 15);

// OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
  maxZoom: 19
}).addTo(map);

// Markers
const markers = [
  {name: "Temple", coords:[22.8852478, 88.0174851], iconClass:"fa-solid fa-om", color:"#d00"},
  {name: "Police Station", coords:[22.8833067, 88.01783335], iconClass:"fa-solid fa-building-shield", color:"#000"},
  {name: "Hospital", coords:[22.8798743, 88.0263139], iconClass:"fa-solid fa-square-h", color:"#000"},
  {name: "Bus Stand", coords:[22.8806209, 88.0129270], iconClass:"fa-solid fa-bus", color:"#000"},
  {name: "Railway Station", coords:[22.8821589, 88.0144998], iconClass:"fa-solid fa-train", color:"#000"},
];

markers.forEach(m => {
  const icon = L.divIcon({
    html: `<i class="${m.iconClass}" style="color:${m.color};font-size:24px;"></i>`,
    className: '',
    iconSize: [24,24],
    iconAnchor: [12,24]
  });
  L.marker(m.coords, {icon}).addTo(map).bindPopup(m.name);
});

const destination = [22.8852478, 88.0174851];
let routingControl;

// Draw route function
function drawRoute(start) {
  if(routingControl) { map.removeControl(routingControl); }
  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(start[0], start[1]),
      L.latLng(destination[0], destination[1])
    ],
    routeWhileDragging: false,
    addWaypoints: false,
    draggableWaypoints: false,
    createMarker: function(i, wp, nWps){
      if(i === 0) return L.marker(wp.latLng).bindPopup("Your location").openPopup();
      if(i === nWps-1) return L.marker(wp.latLng).bindPopup("Tarakeswar Temple");
      return null;
    }
  }).addTo(map);
}

// GPS location button
document.getElementById("locateBtn").addEventListener("click", function(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      const loc = [pos.coords.latitude, pos.coords.longitude];
      console.log("User location:", loc); // debug
      map.setView(loc, 15);
      drawRoute(loc);
    }, err=>{
      console.error(err);
      alert("Access denied or location unavailable. Enter manually.");
    }, { enableHighAccuracy: true });
  } else { 
    alert("Geolocation not supported."); 
  }
});

// Optional menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if(toggle && navLinks){
    toggle.addEventListener('click', ()=> {
      navLinks.classList.toggle('show');
      toggle.classList.toggle('open');
    });
  }
});
