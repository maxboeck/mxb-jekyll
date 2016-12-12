import FontFaceObserver from 'fontfaceobserver';

let state, el, bp;

const App = {

  init: function(){
    this.setInitialState();
    this.setElements();
    this.bindEvents();
    this.fontFaceObserver();
  },

  setElements: function(){
    el = {
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
    el.menuToggleBtn.addEventListener('click', this.toggleMenu.bind(this));
    window.addEventListener('throttledResize', this.setLayers.bind(this));
  },

  fontFaceObserver: function(){
    const playfairObserver = new FontFaceObserver('Playfair Display', {});
    playfairObserver.load().then(() => {
      document.documentElement.classList.add('wf-playfair');
    }, () => {
      document.documentElement.classList.remove('wf-playfair');
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

  toggleMenu: function(e){
    e.preventDefault();

    let scale = (state.isMenuOpen) ? 0 : 1;
    document.body.classList.toggle('menu-open');
    el.menuAnimationBg.style.transform = `scale(${scale})`;

    state.isMenuOpen = !state.isMenuOpen;
  }

};

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


App.init();