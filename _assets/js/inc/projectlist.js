import Blazy from 'blazy';
import Util from './util';

const SELECTORS = {
  projectLink: '.js-project-link',
  lazyload: '.lazyload',
}

const CLASSES = {
  lazyloadSuccess: 'loaded',
  pageTransition: 'pagetransition',
}

const ProjectList = {
  init() {
    const projects = document.querySelectorAll(SELECTORS.projectLink);
    if (projects.length < 1) {
      return;
    }

    for (let i = 0; i < projects.length; i += 1) {
      projects[i].addEventListener('click', this.showProject);
    }

    // eslint-disable-next-line no-unused-vars
    const lazyLoader = new Blazy({
      selector: SELECTORS.lazyload,
      successClass: CLASSES.lazyloadSuccess,
    });
  },

  showProject(e) {
    e.preventDefault();
    const link = Util.findParentByTagName(e.target || e.srcElement, 'A');

    const transition = () => {
      document.documentElement.classList.add(CLASSES.pageTransition);
      setTimeout(() => {
        window.location = link.href;
      }, 600);
    };

    Util.scrollToTop(400, transition);
  },
}

export default ProjectList;
