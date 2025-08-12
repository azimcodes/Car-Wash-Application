// Check if token exists on protected pages, else redirect
document.addEventListener("DOMContentLoaded", () => {
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html'; // your login page
  alert("You must be logged in to view this page.");
  }
})

