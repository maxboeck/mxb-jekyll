import FontFaceObserver from 'fontfaceobserver';
import Blazy from 'blazy';

(function() {
  'use-strict';

  let state, el, bp;
  const App = {

    init: function(){
      this.setInitialState();
      this.setElements();
      this.bindEvents();

      this.lazyLoading();
      this.fontFaceObserver();

      document.documentElement.classList.remove('no-js');
    },

    setElements: function(){
      el = {
        menu: document.getElementById('menu'),
        menuToggleBtn: document.getElementById('menu-toggle'),
        menuAnimationBg: document.getElementById('menu-animation-bg')
      };
    },

    setInitialState: function(){
      state = {
        isMenuOpen: false
      }
    },

    bindEvents: function(){
      this.setLayers();
      window.addEventListener('throttledResize', this.setLayers.bind(this));

      el.menuToggleBtn.addEventListener('click', this.toggleMenu);
    },

    fontFaceObserver: function(){
      const playfairObserver = new FontFaceObserver('Playfair Display', {});
      playfairObserver.load().then(() => {
        document.documentElement.classList.add('fonts-loaded');
        this.setCookie('fonts-loaded', '1', 1);
      }, () => {
        document.documentElement.classList.remove('fonts-loaded');
      });
    },

    lazyLoading: function(){
      const blazy = new Blazy({
        selector: '.lazyload',
        successClass: 'loaded'
      });
    },

    getWindowDimensions(){
      let w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0],
          x = w.innerWidth || e.clientWidth || g.clientWidth,
          y = w.innerHeight|| e.clientHeight|| g.clientHeight;

      return {
        width: x,
        height: y
      }
    },

    setLayers: function(){
      const screen = this.getWindowDimensions();
      const diameter = (Math.sqrt( Math.pow(screen.height, 2) + Math.pow(screen.width, 2))*2);

      el.menuAnimationBg.style.width = diameter + 'px';
      el.menuAnimationBg.style.height = diameter + 'px';
      el.menuAnimationBg.style.top = -(diameter/2) + 'px';
      el.menuAnimationBg.style.left = -(diameter/2) + 'px';
    },

    setCookie: function( name, value, expires ) {
      var today = new Date();
      today.setTime( today.getTime() );
      if ( expires ) {
        expires = expires * 1000 * 60 * 60 * 24;
      }
      var expires_date = new Date( today.getTime() + (expires) );
      document.cookie = name+'='+escape( value ) +
        ( ( expires ) ? ';expires='+expires_date.toGMTString() : '' );
    },

    toggleMenu: function(e){
      e.preventDefault();
      let scale = (state.isMenuOpen) ? 0 : 1;

      document.body.classList.toggle('menu-open');
      window.setTimeout(function(){
        el.menu.classList.toggle('nav__list--visible');
      }, 50);

      el.menuAnimationBg.style.transform = `scale(${scale})`;
      el.menuToggleBtn.setAttribute('aria-expanded', String(!state.isMenuOpen));

      state.isMenuOpen = !state.isMenuOpen;
    }

  };

  App.init();

})();

//throttled resize event
(function() {
  var throttle = function(type, name, obj) {
      obj = obj || window;
      var running = false;
      var func = function() {
          if (running) { return; }
          running = true;
           requestAnimationFrame(function() {
              obj.dispatchEvent(new CustomEvent(name));
              running = false;
          });
      };
      obj.addEventListener(type, func);
  };
  throttle("resize", "throttledResize");
})();