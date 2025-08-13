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

    if (!res.ok) throw new Error('Failed to delete booking');
    document.getElementById('message').textContent = 'Booking deleted successfully!'; 
    loadBookings();  // Refresh the list
  } catch (err) {
    document.getElementById('message').textContent = err.message;
  }
}

