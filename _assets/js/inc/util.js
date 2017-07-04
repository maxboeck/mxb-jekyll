const Util = {

  // get window width and height
  getWindowDimensions() {
    const w = window;
    const d = document;
    const e = d.documentElement;
    const g = d.getElementsByTagName('body')[0];

    const x = w.innerWidth || e.clientWidth || g.clientWidth;
    const y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    return {
      width: x,
      height: y,
    };
  },

  // basic form data to array
  captureForm(form) {
    let field;
    let i;
    const s = {};

    if (typeof form === 'object' && form.nodeName === 'FORM') {
      const len = form.elements.length;
      for (i = 0; i < len; i += 1) {
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

  // serialize an object to a string
  serialize(obj) {
    return Object.keys(obj).reduce((a, k) => {
      a.push(`${k}=${encodeURIComponent(obj[k])}`);
      return a;
    }, []).join('&');
  },

  // check if string is a correct email adress
  validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  },

  // find a parent element by its tag
  findParentByTagName(element, tagName) {
    let parent = element;
    while (parent !== null && parent.tagName !== tagName.toUpperCase()) {
      parent = parent.parentNode;
    }
    return parent;
  },

  // animate the scrollposition back to 0
  scrollToTop(duration, cb) {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const speed = duration || 600;
    let currentTime = 0;

    const time = Math.max(0.1, Math.min(Math.abs(scrollY - 0) / speed, 0.8));
    const easeOutCirc = (pos) => {
      return Math.sqrt(1 - Math.pow((pos - 1), 2));
    };

    const tick = () => {
      currentTime += 1 / 60;

      const p = currentTime / time;
      const t = easeOutCirc(p);

      if (p < 1) {
        requestAnimationFrame(tick);
        window.scrollTo(0, scrollY + ((0 - scrollY) * t));
      } else {
        window.scrollTo(0, 0);
        cb();
      }
    }

    tick();
  },

  generateIcon(name, label = null) {
    const aria = label ? `aria-label="${label}"` : 'aria-hidden="true"';
    return `
      <span class="icon icon--${name}">
        <svg role="img" ${aria}>
          <use xlink:href="/assets/icons/sprite.svg#${name}"></use>
        </svg>
      </span>
    `;
  },

  // Throttled Events
  throttle(type, name) {
    let running = false;
    const func = () => {
      if (running) { return; }
      running = true;
      window.requestAnimationFrame(() => {
        dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    window.addEventListener(type, func);
  },
}

export default Util;
