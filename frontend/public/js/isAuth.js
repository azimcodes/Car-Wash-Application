// js/auth.js
export default {
  getToken() {
    // Returns the token if exists, otherwise null
    return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  requireAuth(redirectUrl = 'login.html') {
    if (!this.isAuthenticated()) {
      window.location.href = redirectUrl;
      alert('You must be logged in to access this page.');
    }
    return this.getToken(); // also returns token for convenience
  }
  //   updateNavForRole(navSelector = 'nav') {
  //   const role = localStorage.getItem('role') || sessionStorage.getItem('role');
  //   const nav = document.querySelector(navSelector);
  //   if (!nav) return;

  //   // Admin link handling
  //   const adminLink = nav.querySelector('a[href="admin.html"]');
  //   if (role === 'admin') {
  //     if (!adminLink) {
  //       const link = document.createElement('a');
  //       link.href = 'admin.html';
  //       link.textContent = 'Admin Panel';
  //       // Insert after Home link (index 1)
  //       nav.insertBefore(link, nav.children[1]);
  //     }
  //   } else {
  //     if (adminLink) adminLink.remove();
  //   }
  // }
};
