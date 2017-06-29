// Global Imports
import _Promise from 'promise-polyfill';
import FontFaceObserver from 'fontfaceobserver';

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
const App = {

  init() {
    document.documentElement.classList.remove('no-js');

    /* eslint-disable no-new */
    new Navigation();
    new ContactForm();
    /* eslint-enable no-new */

    ProjectList.init();
    this.asyncLoadFonts();
    this.registerServiceWorker();
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
