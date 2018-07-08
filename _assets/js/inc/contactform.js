import NanoAjax from 'nanoajax'
import Util from './util'

const SELECTORS = {
    contactForm: '#contactform',
    feedbackArea: '#contactform-feedback',
    submitBtn: '#contactform-submit',
    formInput: '.form__input'
}

const CLASSES = {
    feedbackSuccess: 'form__feedback--success'
}

export default class ContactForm {
    constructor() {
        this.id = 'contactform'
        this.form = document.querySelector(SELECTORS.contactForm)
        if (!this.form) {
            return
        }

        this.feedbackArea = this.form.querySelector(SELECTORS.feedbackArea)
        this.submitButton = this.form.querySelector(SELECTORS.submitBtn)

        this.data = {}
        this.errors = {}
        this.loading = false

        this.form.addEventListener('submit', e => this.handleSubmit(e))
        window.addEventListener('online', () => this.checkStorage())
        window.addEventListener('load', () => this.checkStorage())
    }

    handleSubmit(e) {
        e.preventDefault()
        this.validate()

        if (Object.keys(this.errors).length) {
            this.displayErrors()
            return
        }
        if (!navigator.onLine && this.storeData()) {
            const offlineMsg = `
        You appear to be offline right now. 
        Your message was saved and will be sent once you come back online.
      `
            this.handleResponse(false, offlineMsg)
            return
        }

        this.submitButton.disabled = true
        this.sendData()
    }

    sendData() {
        this.loading = true

        const responseCallback = (code, response) => {
            this.loading = false
            this.handleResponse(code, response)
        }

        NanoAjax.ajax(
            {
                url: this.form.action,
                method: 'POST',
                body: Util.serialize(this.data)
            },
            responseCallback
        )
    }

    storeData() {
        if (typeof Storage !== 'undefined') {
            const entry = {
                time: new Date().getTime(),
                data: this.data
            }
            localStorage.setItem(this.id, JSON.stringify(entry))
            return true
        }
        return false
    }

    handleResponse(code, response) {
        const isSuccess = code === 200
        const statusIcon = isSuccess
            ? Util.generateIcon('check')
            : Util.generateIcon('warning', 'Error:')

        if (isSuccess) {
            this.form.reset()
            localStorage.removeItem(this.id)
        }

        this.feedbackArea.classList.toggle(CLASSES.feedbackSuccess, isSuccess)
        this.feedbackArea.innerHTML = statusIcon + response
        this.submitButton.disabled = false
    }

    validate() {
        this.data = Util.captureForm(this.form)
        this.resetErrors()
        const errors = {}

        Object.keys(this.data).map(key => {
            const value = this.data[key]
            switch (key) {
                case 'name':
                case 'message':
                    if (!value.length) {
                        errors[key] = 'This is a required field.'
                    }
                    break

                case 'email':
                    if (!Util.validateEmail(value)) {
                        errors[key] = "That email doesn't seem right."
                    }
                    break

                case '1m4b0t':
                    if (value.length) {
                        errors.bot = 1
                    }
                    break

                default:
                    break
            }
        })

        this.errors = errors
    }

    displayErrors() {
        const errorIcon = Util.generateIcon('warning', 'Error:')

        this.feedbackArea.classList.remove(CLASSES.feedbackSuccess)
        this.feedbackArea.innerHTML = `${errorIcon} Invalid form. Please check the fields and try again.`

        Object.keys(this.errors).map(key => {
            const field = document.getElementById(key)
            const fieldErrorArea = document.getElementById(`${key}-error`)
            if (field) {
                field.setAttribute('aria-invalid', 'true')
                fieldErrorArea.textContent = this.errors[key]
                fieldErrorArea.hidden = false
            }
        })
    }

    resetErrors() {
        const fields = this.form.querySelectorAll(SELECTORS.formInput)

        for (let i = 0; i < fields.length; i++) {
            fields[i].setAttribute('aria-invalid', 'false')
            const fieldError = document.getElementById(`${fields[i].id}-error`)
            if (fieldError) {
                fieldError.textContent = ''
                fieldError.hidden = true
            }
        }
    }

    checkStorage() {
        if (typeof Storage !== 'undefined') {
            const entry = localStorage.getItem(this.id)
            const submission = entry && JSON.parse(entry)

            if (submission) {
                // only allow submissions newer than one day
                const now = new Date().getTime()
                const day = 24 * 60 * 60 * 1000
                if (now - day > submission.time) {
                    localStorage.removeItem(this.id)
                    return
                }

                this.data = submission.data
                this.sendData()
            }
        }
    }
}
