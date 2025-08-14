const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';
const apiUrl = "/api/bookings";
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});
async function loadBookings() {
  try {
    const res = await fetch(`${apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Bookings fetch status:', res.status);
    const bookings = await res.json();
    console.log('Bookings data:', bookings);
    const tbody = document.getElementById('bookingsList');
      tbody.innerHTML = '';
      bookings.forEach(b => {
      const tr = document.createElement('tr');
         tr.innerHTML = `
  <td class="booking-img">
    ${b.Place && b.Place.photo ? `<img src="${b.Place.photo}" alt="${b.Place.name}">` : ''}
  </td>
  <td class="booking-details">
    <h3>${b.Place ? b.Place.name : 'No place selected'}</h3>
    <p>${b.Place ? b.Place.description : 'N/A'}</p>
    <p>Car Info: ${b.carInfo}</p>
    <p> You have a Booking: ${new Date(b.bookingDateTime).toLocaleString()}</p>
    ${b.Place && b.Place.location ? `<a href="${b.Place.location}" target="_blank">View on Map</a>` : ''}
    <div class="booking-actions">
      <button class="btn edit-btn" onclick="editBooking('${b.id}')">Edit</button>
      <button class="btn delete-btn" onclick="deleteBooking('${b.id}')">Delete</button>
    </div>
  </td>
`;
;
  tbody.appendChild(tr);
});
  } catch (err) {
    document.getElementById('message').textContent = 'No bookings found';
  }
}
loadBookings();


async function deleteBooking(id) {
  if (!confirm('Are you sure you want to delete this booking?')) return;

  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(res)
    if (!res.ok) throw new Error('Failed to delete booking');
    document.getElementById('message').textContent = 'Booking deleted successfully!'; 
    loadBookings();  // Refresh the list
  } catch (err) {
    document.getElementById('message').textContent = err.message;
  }
}
async function editBooking(id) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`/api/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to fetch booking details');
    const booking = await res.json();

    const updateDate = prompt('Change date', booking.bookingDateTime)
    if (!updateDate) return; // User cancelled
    const updatedBooking ={
      carInfo: booking.carInfo,
      bookingDateTime: updateDate,
      status: booking.status,
      placeId: booking.placeId
    }
    const updateRes = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedBooking)
    });

    if (!updateRes.ok) throw new Error('Failed to update booking');
    document.getElementById('message').textContent = 'Booking updated successfully!';
  } catch (err) {
    document.getElementById('message').textContent = err.message;
  }
}

function fetchCars() {
  const token = localStorage.getItem('token');
  fetch('/api/car', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(cars => {
    const tbody = document.getElementById('carsList').querySelector('tbody');
    tbody.innerHTML = '';
    cars.forEach(car => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${car.make}</td>
        <td>${car.model}</td>
        <td>${car.year}</td>
        <td>${car.color}</td>
         <td>
          <button class="edit-btn" onclick="editCar(${car.id})">Edit</button>
          <button class="delete-btn" onclick="deleteCar(${car.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(err => {
    console.error('Error fetching cars:', err);
  });
}
fetchCars();
const createCarForm = document.getElementById('createCarForm');
createCarForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  
  const formData = new FormData(form);
  try {
    const res = await fetch(`/api/car`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    messageEl = document.getElementById('message');
    messageEl.textContent = '';
    const data = await res.json();
    if (res.ok) {
      messageEl.style.color = "green";
      messageEl.textContent = "Car was created successfully!";
      form.reset();
      fetchCars();  // refresh list
    } else {
      messageEl.style.color = "red";
      messageEl.textContent = data.message || "Failed to create car";
    }
  } catch (error) {
    messageEl.style.color = "red";
    messageEl.textContent = "Network or server error occurred";
  }
});

async function deleteCar(id) {
  if (!confirm('Are you sure you want to delete this car?')) return;

  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`/api/car/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to delete car');
    document.getElementById('message').textContent = 'Car deleted successfully!';
    fetchCars();  // Refresh the list
  } catch (err) {
    document.getElementById('message').textContent = err.message;
  }
}
async function editCar(id) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`/api/car/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to fetch car details');
    const car = await res.json();

    const make = prompt('Change make', car.make);
    const model = prompt('Change model', car.model);
    const year = prompt('Change year', car.year);
    const color = prompt('Change color', car.color);

    if (!make || !model || !year || !color) return; // User cancelled

    const updatedCar = {
      make,
      model,
      year,
      color
    };

    const updateRes = await fetch(`/api/car/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedCar)
    });

    if (!updateRes.ok) throw new Error('Failed to update car');
    document.getElementById('message').textContent = 'Car updated successfully!';
    fetchCars();  // Refresh the list
  } catch (err) {
    document.getElementById('message').textContent = err.message;
  }
}