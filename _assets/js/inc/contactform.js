import NanoAjax from 'nanoajax';
import Util from './util';

const SELECTORS = {
  contactForm: '#contactform',
  feedbackArea: '#contactform-feedback',
  submitBtn: '#contactform-submit',
  formInput: '.form__input',
};

const CLASSES = {
  feedbackSuccess: 'form__feedback--success',
}

export default class ContactForm {
  constructor() {
    this.form = document.querySelector(SELECTORS.contactForm);
    if (!this.form) {
      return;
    }

    this.feedbackArea = this.form.querySelector(SELECTORS.feedbackArea);
    this.submitButton = this.form.querySelector(SELECTORS.submitBtn);

    this.data = {};
    this.errors = {};

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  handleSubmit() {
    this.validate();

    if (Object.keys(this.errors).length) {
      this.displayErrors();
    } else {
      this.submitButton.disabled = true;
      NanoAjax.ajax({
        url: this.form.action,
        method: 'POST',
        body: Util.serialize(this.data),
      }, this.handleResponse);
    }
  }

  handleResponse(code, responseText) {
    const isSuccess = (code === 200);
    const statusIcon = (isSuccess) ? Util.generateIcon('check') : Util.generateIcon('warning', 'Error:');

    if (isSuccess) {
      this.form.reset();
    }

    this.feedbackArea.classList.toggle(CLASSES.feedbackSuccess, isSuccess);
    this.feedbackArea.innerHTML = statusIcon + responseText;
    this.submitButton.disabled = false;
  }

  validate() {
    this.data = Util.captureForm(this.form);
    this.resetErrors();
    const errors = {};

    Object.keys(this.data).map((key) => {
      const value = this.data[key];
      switch (key) {
        case 'name':
        case 'message':
          if (!value.length) {
            errors[key] = 'This is a required field.';
          }
          break;

        case 'email':
          if (!Util.validateEmail(value)) {
            errors[key] = 'That email doesn\'t seem right.';
          }
          break;

        case '1m4b0t':
          if (value.length) {
            errors.bot = 1;
          }
          break;

        default :
          return false;
      }
    });

    this.errors = errors;
  }

  displayErrors() {
    const errorIcon = Util.generateIcon('warning', 'Error:');

    this.feedbackArea.classList.remove(CLASSES.feedbackSuccess);
    this.feedbackArea.innerHTML = `${errorIcon} Invalid form. Please check the fields and try again.`;

    Object.keys(this.errors).map((key) => {
      const field = document.getElementById(key);
      const fieldErrorArea = document.getElementById(`${key}-error`);
      if (field) {
        field.setAttribute('aria-invalid', 'true');
        fieldErrorArea.textContent = this.errors[key];
        fieldErrorArea.hidden = false;
      }
    });
  }

  resetErrors() {
    const fields = this.form.querySelectorAll(SELECTORS.formInput);

    for (let i = 0; i < fields.length; i++) {
      fields[i].setAttribute('aria-invalid', 'false');
      const fieldError = document.getElementById(`${fields[i].id}-error`);
      if (fieldError) {
        fieldError.textContent = '';
        fieldError.hidden = true;
      }
    }
  }
}
