'use strict';

// Global Imports
import Promise from 'promise-polyfill';
import FontFaceObserver from 'fontfaceobserver';
import Blazy from 'blazy';
import NanoAjax from 'nanoajax';

import OfflineSupport from './lib/offline';
import Util from './lib/util';

// Promise Polyfill
if (!window.Promise) {
  window.Promise = Promise;
}

// Throttled Events
(function() {
  const throttle = function(type, name, obj) {
    obj = obj || window;
    let running = false;
    const func = function() {
      if (running) { return; }
      running = true;
      requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };
  throttle('resize', 'throttledResize');
})();

// Main App Object
(function() {

  let state = {}, 
      el = {};

  const App = {

    init: function(){
      document.documentElement.classList.remove('no-js');

      this.setInitialState();
      this.setElements();
      this.setLayers();
      this.bindEvents();

      this.lazyLoading();
      this.fontFaceObserver();
      this.checkOfflineSupport();
    },

    setElements: function(){
      const d = document;
      el = {
        menu: d.getElementById('menu'),
        menuToggleBtn: d.getElementById('menu-toggle'),
        menuAnimationBg: d.getElementById('menu-animation-bg'),
        projectList: d.getElementById('projectlist'),
        contactForm: d.getElementById('contactform')
      };
    },

    setInitialState: function(){
      state = {
        isMenuOpen: false
      };
    },

    bindEvents: function(){
      window.addEventListener('throttledResize', this.setLayers.bind(this));

      //menu toggle
      el.menuToggleBtn.addEventListener('click', this.toggleMenu);

      //project links
      const projects = document.querySelectorAll('.js-project-link');
      for (var i = 0; i < projects.length; i++) {
        projects[i].addEventListener('click', this.showProject);
      }

      //contact form submit
      if(!!el.contactForm){
        el.contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleContactFormSubmit();
        });
      }
    },

    fontFaceObserver: function(){
      if(sessionStorage.getItem('fontsLoaded')){
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

    lazyLoading: function(){
      new Blazy({
        selector: '.lazyload',
        successClass: 'loaded'
      });
    },

    setLayers: function(){
      const screen = Util.getWindowDimensions();
      const diameter = (Math.sqrt( Math.pow(screen.height, 2) + Math.pow(screen.width, 2))*2);

      el.menuAnimationBg.style.width = diameter + 'px';
      el.menuAnimationBg.style.height = diameter + 'px';
      el.menuAnimationBg.style.top = -(diameter/2) + 'px';
      el.menuAnimationBg.style.left = -(diameter/2) + 'px';
    },

    toggleMenu: function(e){
      e.preventDefault();
      const scale = (state.isMenuOpen) ? 0 : 1;

      document.body.classList.toggle('menu-open');
      window.setTimeout(function(){
        el.menu.classList.toggle('nav__list--visible');
      }, 50);

      el.menuAnimationBg.style.transform = `scale(${scale})`;
      el.menuToggleBtn.setAttribute('aria-expanded', String(!state.isMenuOpen));

      state.isMenuOpen = !state.isMenuOpen;
    },

    showProject: function(e){
      e.preventDefault();
      let link = Util.findParentByTagName(e.target || e.srcElement, 'A'),
          timeout = 600;

      const transition = function(){
        document.documentElement.classList.add('pagetransition');
        window.setTimeout(() => {
          window.location = link.href;
        }, timeout);
      };

      Util.scrollToTop(400, transition);
    },

    handleContactFormSubmit: function(){
      let data = Util.captureForm(el.contactForm),
          errors = this.validateContactForm(data),
          errorIcon = this.generateIcon('warning', 'Error:'),
          successIcon = this.generateIcon('check'),
          feedbackArea = document.getElementById('contactform-feedback'),
          submitButton = document.getElementById('contactform-submit');

      if(Object.keys(errors).length){
        //display errors
        feedbackArea.classList.remove('form__feedback--success');
        feedbackArea.innerHTML =  `${errorIcon} Invalid form. `;
        feedbackArea.innerHTML += 'Please check the fields and try again.';
        this.displayFormErrors(errors);
      }

      else {
        //send ajax request
        submitButton.disabled = true;

        NanoAjax.ajax({
          url: el.contactForm.action, 
          method: 'POST', 
          body: Util.serialize(data)
        }, 
        function (code, responseText) {
          let icon = errorIcon,
              isSuccess = (code === 200);

          if(isSuccess) {
            el.contactForm.reset();
            icon = successIcon;
          }
          feedbackArea.classList.toggle('form__feedback--success', isSuccess);
          feedbackArea.innerHTML = icon + responseText;
          submitButton.disabled = false;
        });
      }
    },

    validateContactForm: function(data){
      this.resetFormErrors();
      let errors = {};

      Object.keys(data).map(key => {
        let value = data[key];
        switch(key){
          case 'name':
          case 'message':
            if(!value.length){
              errors[key] = 'This is a required field.';
            }
          break;

          case 'email':
            if (!Util.validateEmail(value)){
              errors[key] = 'That email doesn\'t seem right.';
            }
          break;

          case '1m4b0t':
            if (value.length){
              errors.bot = 1;
            }
          break;
        }
      });

      return errors;
    },

    displayFormErrors: function(errors){
      Object.keys(errors).map(key => {
        let field = document.getElementById(key);
        let fieldErrorArea = document.getElementById(`${key}-error`);
        if(!!field){
          field.setAttribute('aria-invalid', 'true');
          fieldErrorArea.textContent = errors[key];
          fieldErrorArea.hidden = false;
        }
      });
    },

    resetFormErrors: function(){
      let fields = el.contactForm.querySelectorAll('.form__input');
      for (var i = 0; i < fields.length; i++) {
        fields[i].setAttribute('aria-invalid', 'false');
        let fieldError = document.getElementById(`${fields[i].id}-error`);
        if(!!fieldError){
          fieldError.textContent = '';
          fieldError.hidden = true;
        }
      }
    },

    generateIcon: function(name, label = false){
      const ariaLabel = label ? `aria-label="${label}"` : '';
      return `
        <span class="icon icon--${name}">
          <svg role="img" ${ariaLabel}>
            <use xlink:href="/assets/icons/sprite.svg#${name}"></use>
          </svg>
        </span>
      `;
    },

    checkOfflineSupport: function(){      
      if ('serviceWorker' in navigator) {
        OfflineSupport.init();
      }
    }

  };

  // Kick shit off
  App.init();

})();