const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
  
}

const apiUrl = "/api/places";
const placesList = document.getElementById("placesList");
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});
async function fetchPlaces() {
  try {
    const res = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch places");
    const places = await res.json();
    placesList.innerHTML = "";

    places.forEach(place => {
     const li = document.createElement("li");
      li.classList.add("place-card");
      li.innerHTML = `
  <div class="place-photo">
    ${place.photo ? `<img src="${place.photo}" alt="${place.name}">` : ""}
  </div>
  <div class="place-info">
    <h3>${place.name}</h3>
    <p><strong>Availability:</strong> ${place.availability === "available" ? "Open now" : place.availability}</p>
    <p><strong>Address:</strong> ${place.address}</p>
    ${place.phone ? `<p><strong>Phone:</strong> ${place.phone}</p>` : ""}
    ${place.description ? `<p>${place.description}</p>` : ""}
    <div class="buttons">
      ${place.location ? `<button class="map-btn" onclick="window.open('${place.location}', '_blank')">View on Map</button>` : ""}
      <button class="book-btn" onclick="bookPlace(${place.id}, '${place.name}')">Book</button>
    </div>
  </div>
`;
placesList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to fetch places:", err);
    placesList.innerHTML = "<li>Failed to load places.</li>";
  }
}
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});
function bookPlace(id, name) {
  localStorage.setItem("selectedPlaceId", id);
  localStorage.setItem("selectedPlaceName", name);
  window.location.href = "booking.html";
}
// No filepath: add to the end of your HTML files, after the nav
document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  const nav = document.querySelector("nav");
  if (role === "admin" && nav) {
    // Check if Admin Panel link already exists
    if (!nav.querySelector('a[href="admin.html"]')) {
      const adminLink = document.createElement("a");
      adminLink.href = "admin.html";
      adminLink.textContent = "Admin Panel";
      // Insert after Home link or at desired position
      nav.insertBefore(adminLink, nav.children[1]);
    }
  } else {
    // Remove Admin Panel link if not admin
    const adminLink = nav.querySelector('a[href="admin.html"]');
    if (adminLink) adminLink.remove();
  }
});
fetchPlaces();
