/**
 * AURA™ — Creative Studio Interactive Engine
 * Handles theme toggling, interactive cursor glow, portfolio filters,
 * counter animations, accordion interactions, testimonials carousel, and contact validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Cursor Glow & Pointer Follower
  const cursorGlow = document.getElementById('cursorGlow');
  const cursorDot = document.getElementById('cursorDot');

  if (cursorGlow && cursorDot && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    });

    document.querySelectorAll('a, button, .project-card, .service-row, .chip').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.3)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1.8)';
      });
      el.addEventListener('mouseleave', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }

  // 2. Theme Toggle (Dark / Light) with LocalStorage Memory
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('aura-theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', targetTheme);
      localStorage.setItem('aura-theme', targetTheme);
    });
  }

  // 3. Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 4. Scroll Reveal Animations & Number Counter Trigger
  const revealElements = document.querySelectorAll('.reveal');
  const metricNumbers = document.querySelectorAll('.metric-number');
  let metricsAnimated = false;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Counter Animation
  const animateCounters = () => {
    metricNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1600; // ms
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(current);
        }
      }, stepTime);
    });
  };

  const metricsSection = document.querySelector('.hero-metrics');
  if (metricsSection) {
    const metricsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !metricsAnimated) {
          metricsAnimated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });
    metricsObserver.observe(metricsSection);
  }

  // 5. Portfolio Category Filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 6. Capabilities / Services Accordion
  const serviceRows = document.querySelectorAll('.service-row');
  serviceRows.forEach(row => {
    row.addEventListener('click', () => {
      const isOpen = row.classList.contains('open');
      serviceRows.forEach(r => r.classList.remove('open'));
      if (!isOpen) {
        row.classList.add('open');
      }
    });
  });

  // Open first service by default
  if (serviceRows.length > 0) {
    serviceRows[0].classList.add('open');
  }

  // 7. Testimonials Carousel
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot-indicator');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  let currentTestimonial = 0;

  const showTestimonial = (index) => {
    testimonialCards.forEach((c, i) => {
      c.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    currentTestimonial = index;
  };

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      let prevIndex = currentTestimonial - 1;
      if (prevIndex < 0) prevIndex = testimonialCards.length - 1;
      showTestimonial(prevIndex);
    });

    nextBtn.addEventListener('click', () => {
      let nextIndex = (currentTestimonial + 1) % testimonialCards.length;
      showTestimonial(nextIndex);
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = +dot.getAttribute('data-index');
        showTestimonial(idx);
      });
    });

    // Auto rotate every 7 seconds
    setInterval(() => {
      let nextIndex = (currentTestimonial + 1) % testimonialCards.length;
      showTestimonial(nextIndex);
    }, 7000);
  }

  // 8. Interactive Chip Selection
  const chips = document.querySelectorAll('#serviceChips .chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
    });
  });

  // 9. Budget Slider Dynamic Label
  const budgetRange = document.getElementById('budgetRange');
  const budgetValue = document.getElementById('budgetValue');
  const budgetLevels = {
    '1': '$10k - $25k',
    '2': '$25k - $50k',
    '3': '$50k - $100k',
    '4': '$100k+'
  };

  if (budgetRange && budgetValue) {
    budgetRange.addEventListener('input', (e) => {
      budgetValue.textContent = budgetLevels[e.target.value] || '$25k - $50k';
    });
  }

  // 10. Contact Form Submission & Validation Simulation
  const projectForm = document.getElementById('projectForm');
  const submitBtn = document.getElementById('submitBtn');
  const formFeedback = document.getElementById('formFeedback');

  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('clientName');
      const emailInput = document.getElementById('clientEmail');
      const messageInput = document.getElementById('projectMessage');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        nameInput.parentElement.classList.remove('has-error');
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        emailInput.parentElement.classList.remove('has-error');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        messageInput.parentElement.classList.remove('has-error');
      }

      if (!isValid) return;

      // Simulate sending inquiry
      submitBtn.classList.add('loading');
      formFeedback.style.display = 'none';

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = '✨ <strong>Inquiry Received!</strong> Thank you for reaching out. We will review your project and get back to you within 24 hours.';
        formFeedback.style.display = 'block';

        projectForm.reset();
        if (budgetValue) budgetValue.textContent = '$25k - $50k';
      }, 1200);
    });
  }

  // 11. Live NYC Time Clock in Footer
  const liveTimeEl = document.getElementById('liveTime');
  const updateNYCTime = () => {
    if (!liveTimeEl) return;
    const now = new Date();
    const options = {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    liveTimeEl.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
  };
  updateNYCTime();
  setInterval(updateNYCTime, 1000);
});
