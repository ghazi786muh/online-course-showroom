document.addEventListener('DOMContentLoaded', () => {
  const authForm = document.getElementById('authForm');
  const addCourseForm = document.getElementById('addCourseForm');
  const authGate = document.getElementById('auth-gate');
  const adminDashboard = document.getElementById('admin-dashboard');
  let verifiedCode = '';

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = document.getElementById('securityCode').value.trim();

      if (!code) {
        return showAlert('auth-alert', 'Security code required.', false);
      }

      verifiedCode = code;
      authGate.style.display = 'none';
      adminDashboard.style.display = 'block';
    });
  }

  if (addCourseForm) {
    addCourseForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = document.getElementById('courseTitle').value.trim();
      const instructor = document.getElementById('instructor').value.trim();
      const price = document.getElementById('price').value.trim();
      const duration = document.getElementById('duration').value.trim();
      const image = document.getElementById('image').value.trim();
      const description = document.getElementById('description').value.trim();

      const courseData = {
        securityCode: verifiedCode,
        title,
        instructor,
        price,
        duration,
        image,
        description
      };

      try {
        const response = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showAlert('admin-alert', 'Course added successfully!', true);
          addCourseForm.reset();
        } else {
          showAlert('admin-alert', data.message || 'Failed to add course.', false);
          if (response.status === 403) {
            // Reset gate on unauthorized
            adminDashboard.style.display = 'none';
            authGate.style.display = 'block';
          }
        }
      } catch (err) {
        console.error('Add course error:', err);
        showAlert('admin-alert', 'An error occurred while publishing course.', false);
      }
    });
  }
});