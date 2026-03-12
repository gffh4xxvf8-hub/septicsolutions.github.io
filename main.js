import { createIcons, Menu, Wrench, Activity, ClipboardCheck, Phone, Mail, MapPin, CheckCircle2, Star } from 'lucide';

// Initialize Lucide Icons
createIcons({
  icons: {
    Menu, Wrench, Activity, ClipboardCheck, Phone, Mail, MapPin, CheckCircle2, Star
  }
});

document.addEventListener('DOMContentLoaded', () => {
  setupHeaderScroll();
  setupMobileNav();
  setupScrollReveal();
  setupFormSubmission();
});

// Header scroll effect
function setupHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Mobile Nav Toggle (Simple Implementation for now)
function setupMobileNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  
  menuToggle.addEventListener('click', () => {
    // If we wanted a full mobile menu we'd add a class here
    // For this simple template, we just toggle display
    if (nav.style.display === 'block') {
      nav.style.display = '';
    } else {
      nav.style.display = 'block';
      nav.style.position = 'absolute';
      nav.style.top = '100%';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = 'white';
      nav.style.padding = '1rem';
      nav.style.boxShadow = 'var(--shadow-md)';
    }
  });
}

// Scroll Reveal Animations using Intersection Observer
function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.fade-in-up, .reveal-up, .reveal-left, .reveal-right');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the visible class to trigger the CSS transition
        entry.target.classList.add('is-visible');
        // Unobserve once it has been revealed
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

// Form Submission Handler
function setupFormSubmission() {
  const form = document.getElementById('quote-form');
  const messageDiv = document.getElementById('form-message');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    messageDiv.className = 'form-message hidden'; // Reset classes

    // Gather form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:3000/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Success
        form.reset();
        messageDiv.textContent = 'Thank you! Your quote request has been sent successfully.';
        messageDiv.className = 'form-message success';
      } else {
        // Server error (e.g., missing fields)
        messageDiv.textContent = result.error || 'An error occurred. Please try again.';
        messageDiv.className = 'form-message error';
      }
    } catch (error) {
      // Network error (server offline, etc.)
      console.error('Submission Error:', error);
      messageDiv.textContent = 'Unable to connect to the server. Please try submitting again later.';
      messageDiv.className = 'form-message error';
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Request';
      
      // Clear message after 5 seconds if it was successful
      if (messageDiv.classList.contains('success')) {
        setTimeout(() => {
          messageDiv.classList.add('hidden');
        }, 5000);
      }
    }
  });
}
