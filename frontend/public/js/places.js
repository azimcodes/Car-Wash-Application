// auth-check.js ensures user is logged in and redirects otherwise

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'index.html';
}
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});
const apiUrl = "/api/places";

const placesList = document.getElementById("placesList");
const createPlaceForm = document.getElementById("createPlaceForm");
const messageEl = document.getElementById("message");

// Fetch and render all places
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
      li.innerHTML = `
        <strong>${place.name}</strong> (${place.availability})<br />
        ${place.address}<br />
        ${place.phone ? "Phone: " + place.phone + "<br />" : ""}
        ${place.description ? place.description + "<br />" : ""}
        ${place.location ? `<a href="${place.location}" target="_blank" rel="noopener" style="color:#4a90e2;">View on Map</a><br />` : ""}
        <button onclick="editPlace(${place.id})">Edit</button>
        <button onclick="deletePlace(${place.id})">Delete</button>
      `;
      placesList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to fetch places:", err);
    placesList.innerHTML = "<li>Failed to load places.</li>";
  }
}

// Handle create place form submission
createPlaceForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  // convert checkbox to string "true" or "false"
  formData.set("isOpen", form.isOpen.checked ? "true" : "false");
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // don't set Content-Type for FormData
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      messageEl.style.color = "green";
      messageEl.textContent = "Place created successfully!";
      form.reset();
      fetchPlaces();  // refresh list
    } else {
      messageEl.style.color = "red";
      messageEl.textContent = data.message || "Failed to create place";
    }
  } catch (error) {
    console.error("Error creating place:", error);
    messageEl.style.color = "red";
    messageEl.textContent = "Network or server error occurred";
  }
});

// Delete place
async function deletePlace(id) {
  if (!confirm("Delete this place?")) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      fetchPlaces();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to delete place");
    }
  } catch (err) {
    alert("Network error");
  }
}

// Edit place (prompt-based)
async function editPlace(id) {
  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      alert("Place not found");
      return;
    }
    const place = await res.json();

    const updatedName = prompt("Edit name:", place.name);
    if (!updatedName) return;

    const updatedAddress = prompt("Edit address:", place.address);
    if (!updatedAddress) return;

    const updatedPhone = prompt("Edit phone:", place.phone || "");
    const updatedDescription = prompt("Edit description:", place.description || "");
    const updatedAvailability = prompt("Edit availability (available, busy, closed):", place.availability);

    const updatedPlace = {
      name: updatedName,
      address: updatedAddress,
      phone: updatedPhone,
      description: updatedDescription,
      availability: updatedAvailability,
    };

    const updateRes = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedPlace)
    });

    if (updateRes.ok) {
      fetchPlaces();
    } else {
      const data = await updateRes.json();
      alert(data.message || "Failed to update place");
    }
  } catch (err) {
    alert("Network error");
  }
}

// Initial fetch
fetchPlaces();
