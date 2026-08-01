document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const countryCode = document.getElementById('countryCode').value;
      const phoneInput = document.getElementById('phone').value.trim();

      // Email Validation Regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return showAlert('alert-box', 'Please enter a valid email address.', false);
      }

      if (password.length < 8) {
        return showAlert('alert-box', 'Password must be at least 8 characters long.', false);
      }

      if (!phoneInput || isNaN(phoneInput)) {
        return showAlert('alert-box', 'Please enter a valid phone number.', false);
      }

      const fullPhone = `${countryCode}${phoneInput}`;

      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password, phone: fullPhone })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showAlert('alert-box', data.message, true);
          signupForm.reset();
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 2000);
        } else {
          showAlert('alert-box', data.message || 'Signup failed.', false);
        }
      } catch (err) {
        console.error('Signup Error:', err);
        showAlert('alert-box', 'An error occurred. Please try again later.', false);
      }
    });
  }
});