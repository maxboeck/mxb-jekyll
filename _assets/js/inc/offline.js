import Util from './util';

export default class OfflineSupport {
  constructor() {
    this.isOffline = false;
    this.wasOffline = false;
    this.elements = {
      pageLinks: document.querySelectorAll('a[href]'),
      formFieldsets: document.querySelectorAll('form fieldset:not([disabled])'),
      cachedElement: document.querySelector('[data-cached]'),
    };
    window.addEventListener('load', () => this.init());
  }

  init() {
    this.updateStatus();
    this.cacheContents();

    Array.from(this.elements.pageLinks).forEach((link) => {
      caches.match(link.href, { ignoreSearch: true }).then((response) => {
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

  cacheContents() {
    if (!this.elements.cachedElement) {
      return;
    }

    const cacheName = `mxb-${this.elements.cachedElement.id}`;
    const resources = [window.location.pathname];
    const resourceSelector = this.elements.cachedElement.querySelectorAll('img, video source[type="video/mp4"]');

    Array.from(resourceSelector).forEach((resource) => {
      if (resource.src) {
        resources.push(resource.src)
      }
    });

    caches.open(cacheName).then((cache) => {
      cache.addAll(resources).then(() => {
        // console.log(`added ${resources.length} resources to cache '${cacheName}'`);
      }).catch((error) => {
        console.warn('error while caching resources: %O', error);
      });
    });
  }
}
