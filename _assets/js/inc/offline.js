import Util from './util';

export default class OfflineSupport {
  constructor() {
    this.isOffline = false;
    this.messageContainer = document.querySelector('#message');

    window.addEventListener('load', () => this.checkConnectivity());
  }

  checkConnectivity() {
    this.updateStatus();

    window.addEventListener('online', () => this.onOnline());
    window.addEventListener('offline', () => this.onOffline());
  }

  updateStatus() {
    this.isOffline = !navigator.onLine;
    document.documentElement.classList.toggle('offline', this.isOffline);
  }

  onOffline() {
    this.updateStatus();
    const message = `
      ${Util.generateIcon('offline')} 
      You appear to be offline right now. Some parts of this site may not be available until you come back on.
    `;
    this.messageContainer.innerHTML = message;
    this.messageContainer.hidden = false;
  }

  onOnline() {
    this.updateStatus();
    this.messageContainer.innerHTML = '';
    this.messageContainer.hidden = true;
  }
}
