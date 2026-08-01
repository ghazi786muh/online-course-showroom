// Utility Functions
function showAlert(elementId, message, isSuccess = true) {
  const alertEl = document.getElementById(elementId);
  if (!alertEl) return;
  alertEl.className = `alert ${isSuccess ? 'alert-success' : 'alert-error'}`;
  alertEl.textContent = message;
  alertEl.style.display = 'block';

  setTimeout(() => {
    alertEl.style.display = 'none';
  }, 5000);
}

// Fetch Global WhatsApp Number
async function getWhatsAppNumber() {
  try {
    const res = await fetch('/api/config');
    const data = await res.json();
    return data.whatsappNumber || '923001234567';
  } catch (err) {
    return '923001234567';
  }
}

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
});