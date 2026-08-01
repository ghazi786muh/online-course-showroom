document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      if (!email || !password) {
        return showAlert('alert-box', 'Please provide both email and password.', false);
      }

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showAlert('alert-box', data.message, true);
          setTimeout(() => {
            window.location.href = data.redirectUrl || 'courses.html';
          }, 1000);
        } else {
          showAlert('alert-box', data.message || 'Invalid Email or Password', false);
        }
      } catch (err) {
        console.error('Login error:', err);
        showAlert('alert-box', 'An error occurred. Please try again later.', false);
      }
    });
  }
});