import Util from './util';

export default class OfflineSupport {
  constructor() {
    this.isOffline = false;
    this.elements = {
      formFieldsets: document.querySelectorAll('form fieldset:not([disabled])'),
    };
    window.addEventListener('load', () => this.checkConnectivity());
  }

  checkConnectivity() {
    this.updateStatus();

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
    window.Toast.show([{
      message,
      timeout: 6000,
    }]);

    Array.from(this.elements.formFieldsets).forEach((fieldset) => {
      fieldset.disabled = true;
    });
  }

  onOnline() {
    Array.from(this.elements.formFieldsets).forEach((fieldset) => {
      fieldset.disabled = false;
    });
  }
}
