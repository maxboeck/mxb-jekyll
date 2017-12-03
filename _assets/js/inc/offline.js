import Util from './util';

export default class OfflineSupport {
  constructor() {
    this.isOffline = false;
    this.elements = {
      pageLinks: document.querySelectorAll('a[href]'),
      cachedElement: document.querySelector('[data-cached]'),
    };
    window.addEventListener('load', () => this.init());
  }

  init() {
    this.updateStatus();
    this.cacheContents();

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
      const message = `
        ${Util.generateIcon('offline', 'Warning:')} 
        You appear to be offline right now. Some parts of this site may not be available until you come back on.
      `;
      window.Toast.show([{ message }]);
    }
  }

  cacheContents() {
    if (!this.elements.cachedElement) {
      return;
    }

    const cacheName = `mxb-${this.elements.cachedElement.id}`;
    const currentURL = `${window.location.pathname}index.html`;
    const resources = [currentURL];
    const resourceSelector = this.elements.cachedElement.querySelectorAll('img, video source[type="video/mp4"]');

    Array.from(resourceSelector).forEach((resource) => {
      if (resource.src) {
        resources.push(resource.src)
      }
    });

    caches.open(cacheName).then((cache) => {
      cache.addAll(resources).catch((error) => {
        console.warn('error while caching resources: %O', error);
      });
    });
  }
}
