import Util from './util'

const SELECTORS = {
  projectLink: '.js-project-link',
}

const CLASSES = {
  pagetransition: 'pagetransition',
}

export default class ProjectGrid {
  constructor() {
    this.projects = document.querySelectorAll(SELECTORS.projectLink)
    if (this.projects.length) {
      this.init()
    }
  }

  init() {
    const onProjectClick = (e) => {
      e.preventDefault()
      const link = Util.findParentByTagName(e.target || e.srcElement, 'A')

      const transition = () => {
        document.documentElement.classList.add(CLASSES.pagetransition)
        setTimeout(() => {
          window.location = link.href
        }, 600)
      }

      Util.scrollToTop(400, transition)
    }

    for (let i = 0; i < this.projects.length; i += 1) {
      this.projects[i].addEventListener('click', onProjectClick)
    }
  }
}
