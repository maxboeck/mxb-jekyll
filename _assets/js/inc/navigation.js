import Util from './util';

const SELECTORS = {
  menu: '#menu',
  toggleBtn: '#menu-toggle',
  animationCircle: '#animation-circle',
}

const CLASSES = {
  menuListVisible: 'nav__list--visible',
  menuOpen: 'menu-open',
}

export default class Navigation {
  constructor() {
    this.isMenuOpen = false;

    this.menu = document.querySelector(SELECTORS.menu);
    this.toggleBtn = document.querySelector(SELECTORS.toggleBtn);
    this.animationCircle = document.querySelector(SELECTORS.animationCircle);

    this.toggleBtn.addEventListener('click', e => this.toggleMenu(e));
    window.addEventListener('throttledResize', () => this.setCircleSize());
  }

  toggleMenu(e) {
    e.preventDefault();
    this.isMenuOpen = !this.isMenuOpen;

    window.setTimeout(() => {
      this.menu.classList.toggle(CLASSES.menuListVisible);
    }, 50);

    this.toggleBtn.setAttribute('aria-expanded', String(this.isMenuOpen));
    document.body.classList.toggle(CLASSES.menuOpen);
  }

  setCircleSize() {
    const screen = Util.getWindowDimensions();
    const diameter = Math.sqrt(Math.pow(screen.height, 2) + Math.pow(screen.width, 2));

    this.animationCircle.style.width = `${diameter * 2}px`;
    this.animationCircle.style.height = `${diameter * 2}px`;
    this.animationCircle.style.top = `${-diameter}px`;
    this.animationCircle.style.left = `${-diameter}px`;
  }
}
