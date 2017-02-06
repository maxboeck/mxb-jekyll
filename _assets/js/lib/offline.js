'use strict';

const OfflineSupport = {

  init: function(){
    //Register Service Worker
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      //this.setOfflineButton();
    }).catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  },

  getResources: function(){
    //scrape current page for resources (images)
    let resources = [window.location.pathname];
    let images = document.querySelectorAll('img');

    for (var i = 0; i < images.length; i++) {
      resources.push(images[i].src);
    }

    return resources;
  },

  addToCache: function(){
    //push page resources into its own cache
    const resources = this.getResources();

    caches.open(`cache-${window.location.pathname}`).then(cache => {
      const updateCache = cache.addAll(resources);

      updateCache.then(() => {
        this.updateOfflineButton('success');
      }).catch(error => {
        this.updateOfflineButton('error');
        console.warn(error.msg);
      });
    });
  },

  setOfflineButton: function(){
    //initialize the "save for offline" button

    const path = window.location.pathname;
    const btn = document.getElementById('offline-cache-btn');

    if(btn){
      //check if current page has already been saved
      caches.open(`cache-${path}`).then(cache => {
        cache.match(path).then(response => {
          !!response && this.updateOfflineButton('success');
        });
      });

      //event listener for the button
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.addToCache();
      });

      //show it
      btn.removeAttribute('hidden');
    }
  },

  updateOfflineButton: function(state){
    //update UI on success/error

    const btn = document.getElementById('offline-cache-btn');
    const status = document.getElementById('offline-cache-status');
    let label = 'error while saving for offline';
    
    if(state === 'success'){
      label = 'This article can be read offline.';
      status.textContent = label;
      btn.disabled = true;
    }

    btn.classList.add(`offlinebtn--${state}`);
    btn.setAttribute('aria-label', label);
    btn.setAttribute('tooltip', label);
  }

};

export default OfflineSupport;