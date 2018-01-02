// Global Imports
import _Promise from 'promise-polyfill';

import Navigation from './inc/navigation';
import ProjectGrid from './inc/projectgrid';
import ContactForm from './inc/contactform';
import OfflineSupport from './inc/offline';

// Promise Polyfill
if (!window.Promise) {
  window.Promise = _Promise;
}

// Main App Object
/* eslint-disable no-new */
const App = {

  init() {
    document.documentElement.classList.remove('no-js');
    this.registerServiceWorker();

    this.Navigation = new Navigation();
    this.ProjectGrid = new ProjectGrid();
    this.ContactForm = new ContactForm();
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
App.init()
