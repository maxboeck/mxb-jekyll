import Util from './util';

export default class OfflineSupport {
  constructor() {
    this.isOffline = false;
    this.messageContainer = document.getElementById('messages');

    window.addEventListener('load', () => {
      window.addEventListener('online', () => this.updateStatus());
      window.addEventListener('offline', () => this.updateStatus());
      this.updateStatus();
    });
  }

  updateStatus() {
    this.isOffline = !navigator.onLine;
    document.documentElement.classList.toggle('offline', this.isOffline);

    if (this.isOffline) {
      const message = `
        ${Util.generateIcon('offline')} 
        You appear to be offline right now. Some parts of this site may not be available until you come back on.
      `;
      this.messageContainer.innerHTML = message;
    } else {
      this.messageContainer.innerHTML = '';
    }
  }
}
