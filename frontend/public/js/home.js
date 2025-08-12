// Redirect to login if no token
document.addEventListener("DOMContentLoaded", () => {
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

// Logout button clears token and redirects
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});
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
})
// No filepath: add to the end of your HTML files, after the nav
