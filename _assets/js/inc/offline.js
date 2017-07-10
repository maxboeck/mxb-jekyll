import Util from './util';

export default class OfflineSupport {
  constructor() {
    this.isOffline = false;
    this.wasOffline = false;
    this.elements = {
      pageLinks: document.querySelectorAll('a[href]'),
      formFieldsets: document.querySelectorAll('form fieldset:not([disabled])'),
    };
    window.addEventListener('load', () => this.init());
  }

  init() {
    this.updateStatus();

    Array.from(this.elements.pageLinks).forEach((link) => {
      let path = link.href;
      if (path.slice(-1) === '/') {
        path += 'index.html';
      }
      caches.match(path, { ignoreSearch: true }).then((response) => {
        if (response) {
          link.classList.add('is-cached');
        }
      });
    });

    window.addEventListener('online', () => this.updateStatus());
    window.addEventListener('offline', () => this.updateStatus());
  }

  updateStatus() {
    this.isOffline = !navigator.onLine;
    document.documentElement.classList.toggle('offline', this.isOffline);
    if (this.isOffline) {
      this.onOffline();
    } else {
      this.onOnline();
    }
  }

  onOffline() {
    const message = `
      ${Util.generateIcon('offline', 'Warning:')} 
      You appear to be offline right now. Some parts of this site may not be available until you come back on.
    `;
    window.Toast.show([{ message }]);

    Array.from(this.elements.formFieldsets).forEach((fieldset) => {
      fieldset.disabled = true;
    });
    this.wasOffline = true;
  }

  onOnline() {
    if (this.wasOffline) {
      Array.from(this.elements.formFieldsets).forEach((fieldset) => {
        fieldset.disabled = false;
      });
    }
  }
}
