document.addEventListener('DOMContentLoaded', () => {

  // Google Sheets Apps Script Web App URL configuration
  // Set your deployed Web App URL here to save inquiries to your Google Spreadsheet.
  const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxBjN51_lgEA9g0MxetkBM9gaZLghCxyhHYBSSGwzrqBEXfi5al5MCwRtLp56qAe3ag/exec';

  /* ==========================================
     THEME TOGGLE (COLLAR STYLE)
     ========================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Check saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  /* ==========================================
     CUSTOM INVERTING CURSOR
     ========================================== */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorCircle = document.getElementById('cursor-circle');
  let mouseX = 0, mouseY = 0;
  let circleX = 0, circleY = 0;

  // Move cursor dot instantly, save coordinates for circle lag
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Position dot
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth lerp (interpolation) for the trailing cursor circle
  function animateCircle() {
    const ease = 0.15; // Speed of tracking
    circleX += (mouseX - circleX) * ease;
    circleY += (mouseY - circleY) * ease;

    cursorCircle.style.left = `${circleX}px`;
    cursorCircle.style.top = `${circleY}px`;

    requestAnimationFrame(animateCircle);
  }
  animateCircle();

  // Add hover state class for clickable items
  const clickables = document.querySelectorAll('.clickable');
  clickables.forEach(item => {
    item.addEventListener('mouseenter', () => {
      cursorCircle.classList.add('hovering');
      cursorDot.classList.add('hovering');
    });
    item.addEventListener('mouseleave', () => {
      cursorCircle.classList.remove('hovering');
      cursorDot.classList.remove('hovering');
    });
  });

  /* ==========================================
     HEADER SCROLL DETECTOR
     ========================================== */
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ==========================================
     INTERSECTION OBSERVER (REVEAL ON SCROLL)
     ========================================== */
  const revealElements = document.querySelectorAll('.timeline-item, .practice-card');
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* ==========================================
     MOBILE NAVIGATION HAMBURGER
     ========================================== */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close nav on link click (mobile optimization)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  /* ==========================================
     WHATSAPP CONTACT FORM SUBMISSION
     ========================================== */
  const form = document.getElementById('consultation-form');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Extract input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Opening WhatsApp...';
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;

    // Construct WhatsApp Message
    const whatsappText = `New Consultation Inquiry
Name: ${name}
Email: ${email}
Subject: ${subject}

Matter Description:
${message}`;
    
    const whatsappUrl = `https://wa.me/919236545454?text=${encodeURIComponent(whatsappText)}`;
    
    // Open WhatsApp in a new tab immediately to avoid popup blockers
    window.open(whatsappUrl, '_blank');
    
    // Optional: Still try to save to Google Sheets in the background (fire and forget)
    if (GOOGLE_SHEET_WEB_APP_URL) {
      fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({ name, email, subject, message })
      }).catch(err => console.error("Sheets sync failed:", err));
    }
    
    // Reset form UI
    setTimeout(() => {
      submitBtn.textContent = 'Submission Sent';
      submitBtn.style.backgroundColor = '#27ae60';
      submitBtn.style.borderColor = '#27ae60';
      submitBtn.style.color = '#ffffff';
      
      form.reset();
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.backgroundColor = '';
        submitBtn.style.borderColor = '';
        submitBtn.style.color = '';
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
      }, 3000);
      
    }, 1500);
  });

  /* ==========================================
     PRACTICE CARD MOBILE TOGGLE
     ========================================== */
  const practiceCards = document.querySelectorAll('.practice-card');
  practiceCards.forEach(card => {
    card.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        // Toggle the description card
        const wasActive = card.classList.contains('show-desc');
        // Close all cards
        practiceCards.forEach(c => c.classList.remove('show-desc'));
        // If it wasn't active, open it
        if (!wasActive) {
          card.classList.add('show-desc');
        }
      }
    });
  });

  /* ==========================================
     VIEW ALL PRACTICE AREAS TOGGLE
     ========================================== */
  const viewAllBtn = document.getElementById('view-all-practice');
  const practiceGridElement = document.querySelector('.practice-grid');
  
  if (viewAllBtn && practiceGridElement) {
    viewAllBtn.addEventListener('click', () => {
      practiceGridElement.classList.toggle('expanded');
      if (practiceGridElement.classList.contains('expanded')) {
        viewAllBtn.textContent = 'Show Less';
      } else {
        viewAllBtn.textContent = 'View All Practice Areas';
      }
    });
  }
});
