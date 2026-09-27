/**
 * main.js - Core UI Interactions and Accessibility Logic
 * 
 * Features:
 * 1. Theme Management (Light / Dark mode persistence with localStorage & system preference)
 * 2. Accessible Mobile Navigation Menu (Hamburger toggle, ARIA attributes, keyboard support)
 * 3. ScrollSpy & Navigation State (IntersectionObserver for active link indicator)
 * 4. Client-side Form Validation & Accessible Alerts
 * 5. Dynamic Footer Year
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* =========================================================================
     1. THEME MANAGEMENT (Light / Dark Mode)
     ========================================================================= */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const THEME_STORAGE_KEY = 'portfolio_theme_preference';

  /**
   * Applies the chosen theme to the document and updates accessibility attributes.
   * @param {'light'|'dark'} theme 
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (themeToggleBtn) {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      themeToggleBtn.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
      themeToggleBtn.setAttribute('title', `Switch to ${nextTheme} mode`);
    }
  }

  /**
   * Determines the initial theme based on saved user preference or OS setting.
   * @returns {'light'|'dark'}
   */
  function getInitialTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  // Initialize Theme
  applyTheme(getInitialTheme());

  // Listen for Theme Toggle Click
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // Listen for System Color Scheme Changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't set an explicit preference
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /* =========================================================================
     2. MOBILE NAVIGATION MENU
     ========================================================================= */
  const menuToggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMobileMenu() {
    if (!menuToggleBtn || !navMenu) return;
    menuToggleBtn.classList.add('is-active');
    navMenu.classList.add('is-active');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    menuToggleBtn.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeMobileMenu() {
    if (!menuToggleBtn || !navMenu) return;
    menuToggleBtn.classList.remove('is-active');
    navMenu.classList.remove('is-active');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    menuToggleBtn.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (menuToggleBtn && navMenu) {
    menuToggleBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when any navigation link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-active')) {
          closeMobileMenu();
        }
      });
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
        closeMobileMenu();
        menuToggleBtn.focus(); // Return focus to toggle button for accessibility
      }
    });

    // Close menu when clicking outside of header
    document.addEventListener('click', (e) => {
      const header = document.getElementById('site-header');
      if (header && !header.contains(e.target) && navMenu.classList.contains('is-active')) {
        closeMobileMenu();
      }
    });
  }

  /* =========================================================================
     3. SCROLLSPY (Active Navigation Link Highlighting)
     ========================================================================= */
  const trackedSections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -65% 0px', // Trigger when section is in upper-mid viewport
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    trackedSections.forEach((section) => sectionObserver.observe(section));
  }

  /* =========================================================================
     4. ACCESSIBLE CONTACT FORM VALIDATION
     ========================================================================= */
  const contactForm = document.getElementById('contact-form');
  const formStatusAlert = document.getElementById('form-status-alert');

  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    /**
     * Clears error message and invalid styling for an input
     * @param {HTMLElement} inputElement 
     * @param {string} errorElementId 
     */
    function clearInputError(inputElement, errorElementId) {
      inputElement.classList.remove('is-invalid');
      const errEl = document.getElementById(errorElementId);
      if (errEl) errEl.textContent = '';
    }

    /**
     * Displays error message and invalid styling for an input
     * @param {HTMLElement} inputElement 
     * @param {string} errorElementId 
     * @param {string} message 
     */
    function setInputError(inputElement, errorElementId, message) {
      inputElement.classList.add('is-invalid');
      const errEl = document.getElementById(errorElementId);
      if (errEl) errEl.textContent = message;
    }

    // Input event listeners to clear errors on user typing
    if (nameInput) nameInput.addEventListener('input', () => clearInputError(nameInput, 'name-error'));
    if (emailInput) emailInput.addEventListener('input', () => clearInputError(emailInput, 'email-error'));
    if (subjectInput) subjectInput.addEventListener('input', () => clearInputError(subjectInput, 'subject-error'));
    if (messageInput) messageInput.addEventListener('input', () => clearInputError(messageInput, 'message-error'));

    const submitBtn = document.getElementById('contact-submit-btn');
    let isSubmitting = false;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (isSubmitting) return;

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        setInputError(nameInput, 'name-error', 'Please enter your name.');
        isValid = false;
      } else {
        clearInputError(nameInput, 'name-error');
      }

      // Validate Email with regex
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        setInputError(emailInput, 'email-error', 'Please enter your email address.');
        isValid = false;
      } else if (!emailPattern.test(emailInput.value.trim())) {
        setInputError(emailInput, 'email-error', 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearInputError(emailInput, 'email-error');
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        setInputError(subjectInput, 'subject-error', 'Please enter a subject.');
        isValid = false;
      } else {
        clearInputError(subjectInput, 'subject-error');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        setInputError(messageInput, 'message-error', 'Please enter your message.');
        isValid = false;
      } else {
        clearInputError(messageInput, 'message-error');
      }

      if (!isValid) {
        if (formStatusAlert) {
          formStatusAlert.hidden = false;
          formStatusAlert.className = 'form-status-alert is-error';
          formStatusAlert.textContent = 'Please correct the highlighted errors above.';
        }
        return;
      }

      // Prepare payload: name, email, message
      const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
      };

      // Set Submitting State
      isSubmitting = true;
      let originalBtnHTML = '';
      if (submitBtn) {
        submitBtn.disabled = true;
        originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending Message...</span>';
      }

      if (formStatusAlert) {
        formStatusAlert.hidden = false;
        formStatusAlert.className = 'form-status-alert';
        formStatusAlert.textContent = 'Sending message...';
      }

      try {
        if (!window.PortfolioAPI || typeof window.PortfolioAPI.sendContactMessage !== 'function') {
          throw new Error('API client is not available.');
        }

        const result = await window.PortfolioAPI.sendContactMessage(payload);

        // Success state
        if (formStatusAlert) {
          formStatusAlert.hidden = false;
          formStatusAlert.className = 'form-status-alert is-success';
          formStatusAlert.textContent = result && result.message ? result.message : 'Thank you! Your message has been sent successfully.';
        }

        // Reset form ONLY on success
        contactForm.reset();
      } catch (err) {
        // Error state
        if (formStatusAlert) {
          formStatusAlert.hidden = false;
          formStatusAlert.className = 'form-status-alert is-error';
          formStatusAlert.textContent = err.message || 'Unable to send message. Please try again later.';
        }
      } finally {
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          if (originalBtnHTML) {
            submitBtn.innerHTML = originalBtnHTML;
          }
        }
      }
    });
  }

  /* =========================================================================
     5. DYNAMIC FOOTER YEAR
     ========================================================================= */
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
