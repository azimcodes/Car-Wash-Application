import isAuth from './isAuth.js';
const token = isAuth.requireAuth(); 
document.getElementById('logoutBtn').addEventListener('click', (e) => {
e.preventDefault();
  localStorage.removeItem('token') || sessionStorage.removeItem('token');
  localStorage.removeItem('role') || sessionStorage.removeItem('role');
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
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const placeId = document.getElementById('placeSelect').value;
  const carInfo = document.getElementById('carInfo').value;
  const bookingDateTime = document.getElementById('bookingDateTime').value;

  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ placeId, carInfo, bookingDateTime })
    });

    if (!res.ok) throw new Error('Failed to create booking');

    const data = await res.json(); // this should include booking ID
    document.getElementById('message').textContent = 'Booking created successfully!';

    e.target.reset();

    // **Call the payment modal with the new booking ID**
    showPaymentModal(data.id);

  } catch (err) {
    document.getElementById('message').textContent = err.message;
  }
});

          // Show the modal after booking is created
function showPaymentModal(bookingId) {
  const modal = document.getElementById("paymentModal");
  modal.style.display = "flex";

  // Pay Now
  document.getElementById("payNowBtn").onclick = async () => {
  try {
    // Call your backend to create a Stripe checkout session
    const res = await fetch("/api/payments/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bookingId,          // Pass the booking ID
        amount: 5000        // Example amount in cents ($50), adjust accordingly
      }),
    });

    if (!res.ok) throw new Error("Failed to create payment session");
    const data = await res.json();

    // Redirect to Stripe checkout
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else {
      throw new Error("Checkout URL not received");
    }
  } catch (err) {
    alert(err.message);
  }
};


  // Pay at Place
  document.getElementById("payAtPlaceBtn").onclick = async () => {
    try {
      const res = await fetch(`/api/payments/pay-later`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId })
      });

      if (!res.ok) throw new Error("Could not set Pay at Place");
      alert("Booking marked as Pay at Place!");
      modal.style.display = "none";
    } catch (err) {
      alert(err.message);
    }
  };

  // Cancel button
  document.getElementById("closeModalBtn").onclick = () => {
    modal.style.display = "none";
  };
}




  