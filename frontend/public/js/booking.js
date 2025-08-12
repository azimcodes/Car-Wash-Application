document.addEventListener("DOMContentLoaded", function(){
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = 'login.html';
      }
      document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = 'login.html';
      });
      const apiUrl = "/api/places";
      const placeSelect = document.getElementById("placeSelect");

      async function loadPlaces() {
        try {
          const res = await fetch(apiUrl, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error("Failed to fetch places");
          const places = await res.json();

          placeSelect.innerHTML = '<option value="">Select a place</option>';
          places.forEach(place => {
            const option = document.createElement("option");
            option.value = place.id;
            option.textContent = place.name;
            placeSelect.appendChild(option);
          });

          // Pre-select if coming from Show Places
          const selectedPlaceId = localStorage.getItem("selectedPlaceId");
          if (selectedPlaceId) {
            placeSelect.value = selectedPlaceId;
            localStorage.removeItem("selectedPlaceId");
            localStorage.removeItem("selectedPlaceName");
          }
        } catch (err) {
          placeSelect.innerHTML = '<option value="">Failed to load places</option>';
        }
      }
      loadPlaces();
});


  