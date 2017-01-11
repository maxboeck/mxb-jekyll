'use strict';

const Util = {

  //get window width and height
  getWindowDimensions: function(){
    let w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    return {
      width: x,
      height: y
    };
  },

  //basic form data to array
  captureForm: function(form) {
    var field, i, s = {};
    if (typeof form === 'object' && form.nodeName === 'FORM') {
      var len = form.elements.length;
      for (i=0; i<len; i++) {
        field = form.elements[i];
        if (field.name && 
            !field.disabled && 
            field.type !== 'file' && 
            field.type !== 'reset' && 
            field.type !== 'submit' && 
            field.type !== 'button'
        ) {
          s[field.name] = field.value || '';
        }
      }
    }
    return s;
  },

  serialize: function(obj) {
    return Object.keys(obj).reduce(function(a,k){
      a.push(k+'='+encodeURIComponent(obj[k]));
      return a;
    },[]).join('&');
  },

  validateEmail: function(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },

  findParentByTagName: function(element, tagName) {
    let parent = element;
    while (parent !== null && parent.tagName !== tagName.toUpperCase()) {
      parent = parent.parentNode;
    }
    return parent;
  },

  scrollToTop: function(duration, cb){
    let scrollY = window.scrollY || document.documentElement.scrollTop,
        speed = duration || 600,
        currentTime = 0;

    let time = Math.max(0.1, Math.min(Math.abs(scrollY - 0) / speed, 0.8));
    let easeOutCirc = function(pos) {
      return Math.sqrt(1 - Math.pow((pos-1), 2));
    };

    function tick() {
      currentTime += 1 / 60;

      let p = currentTime / time;
      let t = easeOutCirc(p);

      if (p < 1) {
        requestAnimationFrame(tick);
        window.scrollTo(0, scrollY + ((0 - scrollY) * t));
      } else {
        window.scrollTo(0, 0);
        cb();
      }
    }

    tick();
  }

};

export default Util;