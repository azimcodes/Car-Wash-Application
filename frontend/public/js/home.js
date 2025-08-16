import isAuth from './isAuth.js';
document.addEventListener("DOMContentLoaded", () => {
const token = isAuth.requireAuth(); // Redirects if not logged in
console.log("Token available for API calls:", token);


// Logout button clears token and redirects
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token') || sessionStorage.removeItem('token');
  localStorage.removeItem('role') || sessionStorage.removeItem('role');
  window.location.href = 'login.html';
});
 const role = localStorage.getItem("role") || sessionStorage.getItem("role");
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
})
// No filepath: add to the end of your HTML files, after the nav
