let allCourses = [];

// Helper function to fetch WhatsApp number from backend config
async function getWhatsAppNumber() {
  try {
    const response = await fetch('/api/config');
    const data = await response.json();
    return data.whatsappNumber || '923001234567';
  } catch (err) {
    console.error('Error fetching WhatsApp number config:', err);
    return '923001234567'; // Fallback number if request fails
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const coursesGrid = document.getElementById('all-courses');
  const searchInput = document.getElementById('searchInput');

  async function loadCourses() {
    try {
      coursesGrid.innerHTML = '<p>Loading courses...</p>';
      const response = await fetch('/api/courses');
      const data = await response.json();

      if (data.success) {
        allCourses = data.courses;
        renderCourses(allCourses);
      } else {
        coursesGrid.innerHTML = '<p>Failed to load courses.</p>';
      }
    } catch (err) {
      console.error('Error loading courses:', err);
      coursesGrid.innerHTML = '<p>Error loading courses. Please refresh.</p>';
    }
  }

  async function renderCourses(courses) {
    if (courses.length === 0) {
      coursesGrid.innerHTML = '<p>No courses found matching your criteria.</p>';
      return;
    }

    const waNumber = await getWhatsAppNumber();

    coursesGrid.innerHTML = courses.map((course) => {
      const message = `Hello,\n\nI want to buy this course.\n\nCourse Name:\n${course.title}\n\nPrice:\nPKR ${course.price}\n\nPlease provide payment details.\n\nThank you.`;
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

      return `
        <div class="course-card">
          <img src="${course.image}" alt="${course.title}" class="course-image">
          <div class="course-body">
            <h3 class="course-title">${course.title}</h3>
            <div class="course-meta">
              <span><i class="fa-solid fa-user"></i> ${course.instructor}</span>
              <span><i class="fa-solid fa-clock"></i> ${course.duration}</span>
            </div>
            <p class="course-desc">${course.description}</p>
            <div class="course-footer">
              <span class="price">PKR ${course.price}</span>
              <a href="${waUrl}" target="_blank" class="buy-btn">
                <i class="fa-brands fa-whatsapp"></i> Buy via WhatsApp
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = allCourses.filter(
        (c) => c.title.toLowerCase().includes(query) || c.instructor.toLowerCase().includes(query)
      );
      renderCourses(filtered);
    });
  }

  loadCourses();
});