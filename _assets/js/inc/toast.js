// Toast Messages Component

const SELECTORS = {
  toast: '#toast',
  messageContainer: '.toast__message',
};

const CLASSES = {
  active: 'toast--active',
};

export default class Toast {
  constructor() {
    this.element = document.querySelector(SELECTORS.toast);
    if (!this.element) {
      return;
    }

    this.messageContainer = this.element.querySelector(SELECTORS.messageContainer);
    this.queuedMessages = [];
    this.defaultTimeout = 5000;
    this.reset();

    // make this available on the global scope
    window.Toast = this;
  }

  show(messages) {
    if (Array.isArray(messages) && messages.length > 0) {
      for (const msg of messages) {
        if (typeof msg.message !== 'undefined') {
          this.loadMessage(msg);
        }
      }
    }
  }

  loadMessage(msg) {
    if (this.isActive) {
      this.queuedMessages.push(msg);
    } else {
      const timeout = (typeof msg.timeout === 'number') ? msg.timeout : this.defaultTimeout;

      this.isActive = true;
      this.data = msg;
      this.action = () => this.dismiss();
      this.timeoutID = setTimeout(this.action, timeout);

      this.display();
    }
  }

  display() {
    this.element.setAttribute('aria-hidden', 'true');
    this.messageContainer.innerHTML = this.data.message;
    this.element.classList.add(CLASSES.active);
    this.element.setAttribute('aria-hidden', 'false');
  }

  dismiss() {
    if (this.isActive) {
      if (typeof this.data.callback === 'function') {
        this.data.callback();
      }
      this.hide();
    }
  }

  hide() {
    this.element.classList.remove(CLASSES.active);

    // wait for the slideout animation to finish first
    setTimeout(() => {
      this.element.setAttribute('aria-hidden', 'true');
      this.messageContainer.innerHTML = '';

      this.reset();
      this.checkQueue();
    }, 450);
  }

  reset() {
    this.isActive = false;
    this.data = undefined;
    this.action = undefined;

    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
      this.timeoutID = undefined;
    }
  }

  checkQueue() {
    if (this.queuedMessages.length > 0) {
      this.loadMessage(this.queuedMessages.shift());
    }
  }
}
