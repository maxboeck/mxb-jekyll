// Global Imports
import _Promise from 'promise-polyfill';
import Blazy from 'blazy';

import Navigation from './inc/navigation';
import ContactForm from './inc/contactform';
import Toast from './inc/toast';
import OfflineSupport from './inc/offline';
import Util from './inc/util';

// Promise Polyfill
if (!window.Promise) {
  window.Promise = _Promise;
}

// Throttled Resize Event
Util.throttle('resize', 'throttledResize');

// Main App Object
/* eslint-disable no-new */
const App = {

  init() {
    document.documentElement.classList.remove('no-js');

    this.lazyLoading();
    this.projectList();
    this.registerServiceWorker();

    this.Navigation = new Navigation();
    this.ContactForm = new ContactForm();
    this.Toast = new Toast();
  },

  projectList() {
    const projects = document.querySelectorAll('.js-project-link');
    if (!projects.length) {
      return;
    }

    const projectClickHandler = (e) => {
      e.preventDefault();
      const link = Util.findParentByTagName(e.target || e.srcElement, 'A');

      const transition = () => {
        document.documentElement.classList.add('pagetransition');
        setTimeout(() => {
          window.location = link.href;
        }, 600);
      };

      Util.scrollToTop(400, transition);
    };

    for (let i = 0; i < projects.length; i += 1) {
      projects[i].addEventListener('click', projectClickHandler);
    }
  },

  // init lazy loading of images
  lazyLoading() {
    new Blazy({
      selector: '.lazyload',
      successClass: 'loaded',
    });
  },

  // check for SW support and register
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' });
      new OfflineSupport();
    }
  },
};

// Kick shit off
(() => {
  App.init()
})()

