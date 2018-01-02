import debounce from 'lodash/debounce';
import Util from './util';

const SELECTORS = {
  nav: '#nav',
  menu: '#menu',
  navLink: '.nav__link',
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

    this.nav = document.querySelector(SELECTORS.nav);
    this.menu = this.nav.querySelector(SELECTORS.menu);
    this.toggleBtn = this.nav.querySelector(SELECTORS.toggleBtn);
    this.navLinks = this.menu.querySelectorAll(SELECTORS.navLink);
    this.animationCircle = document.querySelector(SELECTORS.animationCircle);

    this.toggleBtn.addEventListener('click', () => this.toggleMenu());
    this.nav.addEventListener('keydown', e => this.handleTabPress(e));
    window.addEventListener('resize', debounce(() => this.setCircleSize(), 200));

    this.setCircleSize();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    window.setTimeout(() => {
      this.menu.classList.toggle(CLASSES.menuListVisible);
    }, 50);

    this.toggleBtn.setAttribute('aria-expanded', String(this.isMenuOpen));
    document.body.classList.toggle(CLASSES.menuOpen);
  }

  setCircleSize() {
    const screen = Util.getWindowDimensions();
    const diameter = Math.sqrt((screen.height ** 2) + (screen.width ** 2));

    this.animationCircle.style.width = `${diameter * 2}px`;
    this.animationCircle.style.height = `${diameter * 2}px`;
    this.animationCircle.style.top = `${-diameter}px`;
    this.animationCircle.style.left = `${-diameter}px`;
  }

  handleTabPress(e) {
    if (!this.isMenuOpen || e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }

    const lastLink = this.navLinks[(this.navLinks.length - 1)];
    switch (e.keyCode) {
      case 27: // ESC

        this.toggleMenu();
        this.toggleBtn.focus();
        break;

      case 9: // TAB

        if (e.shiftKey) {
          if (document.activeElement === this.toggleBtn) {
            lastLink.focus();
            e.preventDefault();
          }
        } else if (document.activeElement === lastLink) {
          this.toggleBtn.focus();
          e.preventDefault();
        }
        break;

      default: break;
    }
  }
}
