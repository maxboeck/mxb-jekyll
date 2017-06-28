// Global Imports
import Promise from 'promise-polyfill';
import FontFaceObserver from 'fontfaceobserver';
import Blazy from 'blazy';
import NanoAjax from 'nanoajax';

import Util from './inc/util';

// Promise Polyfill
if (!window.Promise) {
  window.Promise = Promise;
}

// Throttled Events
(function () {
  function throttle(type, name) {
    let running = false;
    const func = () => {
      if (running) { return; }
      running = true;
      window.requestAnimationFrame(() => {
        dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    window.addEventListener(type, func);
  }
  throttle('resize', 'throttledResize');
}());

// Main App Object
(function () {
  const state = { isMenuOpen: false };
  let el = {};

  const App = {

    init() {
      document.documentElement.classList.remove('no-js');

      this.setElements();
      this.setLayers();
      this.bindEvents();

      this.lazyLoading();
      this.fontFaceObserver();
      this.checkServiceWorkerSupport();
    },

    setElements() {
      const d = document;
      el = {
        menu: d.getElementById('menu'),
        menuToggleBtn: d.getElementById('menu-toggle'),
        menuAnimationBg: d.getElementById('menu-animation-bg'),
        projectList: d.getElementById('projectlist'),
        contactForm: d.getElementById('contactform'),
      };
    },

    bindEvents() {
      window.addEventListener('throttledResize', this.setLayers.bind(this));

      // menu toggle
      el.menuToggleBtn.addEventListener('click', this.toggleMenu);

      // project links
      const projects = document.querySelectorAll('.js-project-link');
      for (let i = 0; i < projects.length; i++) {
        projects[i].addEventListener('click', this.showProject);
      }

      // contact form submit
      if (el.contactForm) {
        el.contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleContactFormSubmit();
        });
      }
    },

    fontFaceObserver() {
      if (sessionStorage.getItem('fontsLoaded')) {
        return;
      }

      const playfairObserver = new FontFaceObserver('Playfair Display', {});
      playfairObserver.load().then(() => {
        document.documentElement.classList.add('fonts-loaded');
        sessionStorage.setItem('fontsLoaded', true);
      }, () => {
        document.documentElement.classList.remove('fonts-loaded');
      });
    },

    lazyLoading() {
      new Blazy({
        selector: '.lazyload',
        successClass: 'loaded',
      });
    },

    setLayers() {
      const screen = Util.getWindowDimensions();
      const diameter = Math.sqrt(Math.pow(screen.height, 2) + Math.pow(screen.width, 2));

      el.menuAnimationBg.style.width = `${diameter * 2}px`;
      el.menuAnimationBg.style.height = `${diameter * 2}px`;
      el.menuAnimationBg.style.top = `${-diameter}px`;
      el.menuAnimationBg.style.left = `${-diameter}px`;
    },

    toggleMenu(e) {
      e.preventDefault();
      const scale = (state.isMenuOpen) ? 0 : 1;

      document.body.classList.toggle('menu-open');
      window.setTimeout(() => {
        el.menu.classList.toggle('nav__list--visible');
      }, 50);

      el.menuAnimationBg.style.transform = `scale(${scale})`;
      el.menuToggleBtn.setAttribute('aria-expanded', String(!state.isMenuOpen));

      state.isMenuOpen = !state.isMenuOpen;
    },

    showProject(e) {
      e.preventDefault();
      const link = Util.findParentByTagName(e.target || e.srcElement, 'A');
      const timeout = 600;

      const transition = function () {
        document.documentElement.classList.add('pagetransition');
        setTimeout(() => {
          window.location = link.href;
        }, timeout);
      };

      Util.scrollToTop(400, transition);
    },

    handleContactFormSubmit() {
      const data = Util.captureForm(el.contactForm);
      const errors = this.validateContactForm(data);
      const errorIcon = this.generateIcon('warning', 'Error:');
      const successIcon = this.generateIcon('check');
      const feedbackArea = document.getElementById('contactform-feedback');
      const submitButton = document.getElementById('contactform-submit');

      if (Object.keys(errors).length) {
        // display errors
        feedbackArea.classList.remove('form__feedback--success');
        feedbackArea.innerHTML = `${errorIcon} Invalid form. `;
        feedbackArea.innerHTML += 'Please check the fields and try again.';
        this.displayFormErrors(errors);
      } else {
        // send ajax request
        submitButton.disabled = true;

        NanoAjax.ajax({
          url: el.contactForm.action,
          method: 'POST',
          body: Util.serialize(data),
        },
        (code, responseText) => {
          let icon = errorIcon;
          const isSuccess = (code === 200);

          if (isSuccess) {
            el.contactForm.reset();
            icon = successIcon;
          }
          feedbackArea.classList.toggle('form__feedback--success', isSuccess);
          feedbackArea.innerHTML = icon + responseText;
          submitButton.disabled = false;
        });
      }
    },

    validateContactForm(data) {
      this.resetFormErrors();
      const errors = {};

      Object.keys(data).map((key) => {
        const value = data[key];
        switch (key) {
          case 'name':
          case 'message':
            if (!value.length) {
              errors[key] = 'This is a required field.';
            }
            break;

          case 'email':
            if (!Util.validateEmail(value)) {
              errors[key] = 'That email doesn\'t seem right.';
            }
            break;

          case '1m4b0t':
            if (value.length) {
              errors.bot = 1;
            }
            break;

          default : 
            return false;
        }
      });

      return errors;
    },

    displayFormErrors(errors) {
      Object.keys(errors).map((key) => {
        const field = document.getElementById(key);
        const fieldErrorArea = document.getElementById(`${key}-error`);
        if (field) {
          field.setAttribute('aria-invalid', 'true');
          fieldErrorArea.textContent = errors[key];
          fieldErrorArea.hidden = false;
        }
      });
    },

    resetFormErrors() {
      const fields = el.contactForm.querySelectorAll('.form__input');
      for (let i = 0; i < fields.length; i++) {
        fields[i].setAttribute('aria-invalid', 'false');
        const fieldError = document.getElementById(`${fields[i].id}-error`);
        if (fieldError) {
          fieldError.textContent = '';
          fieldError.hidden = true;
        }
      }
    },

    generateIcon(name, label = false) {
      const ariaLabel = label ? `aria-label="${label}"` : '';
      return `
        <span class="icon icon--${name}">
          <svg role="img" ${ariaLabel}>
            <use xlink:href="/assets/icons/sprite.svg#${name}"></use>
          </svg>
        </span>
      `;
    },

    checkServiceWorkerSupport() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch((err) => {
          console.warn('ServiceWorker registration failed: ', err);
        });
      }
    },

  };

  // Kick shit off
  App.init();
}());
