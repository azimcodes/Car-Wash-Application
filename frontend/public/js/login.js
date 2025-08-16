const form = document.getElementById('loginForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const rememberMe = document.getElementById('rememberMe').checked;
    const res = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      message.textContent = 'Login successful!';
      if (rememberMe) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role); // Store user role
      } else {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('role', data.user.role); // Store user role
      }
      if (data.user.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'home.html';
      }
    } else {
      message.textContent = 'Error: ' + data.message;
    }
  } catch (error) {
    message.textContent = 'Network error';
  }
});