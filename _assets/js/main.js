// Global Imports
import _Promise from 'promise-polyfill';
import FontFaceObserver from 'fontfaceobserver';
import Blazy from 'blazy';

import Navigation from './inc/navigation';
import ProjectList from './inc/projectlist';
import ContactForm from './inc/contactform';
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

    new Navigation();
    new ContactForm();

    ProjectList.init();
    this.asyncLoadFonts();
    this.lazyLoading();
    this.registerServiceWorker();
  },

  // init lazy loading of images
  lazyLoading() {
    new Blazy({
      selector: '.lazyload',
      successClass: 'loaded',
    });
  },

  // load Fonts via FontFaceObserver
  asyncLoadFonts() {
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

  // check for SW support and register
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(() => {
        return true;
      }).catch((err) => {
        console.warn('ServiceWorker registration failed: ', err);
      });
    }
  },
}

// Kick shit off
App.init();
