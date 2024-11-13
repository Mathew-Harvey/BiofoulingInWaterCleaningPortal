// form-handler.js
const FormManager = {
    autoSaveTimeout: null,

    initialize() {
        this.initializeForms();
        this.attachEventListeners();
        console.log('Form manager initialized');
    },

    initializeForms() {
        // Load saved form data for all forms
        document.querySelectorAll('form').forEach(form => {
            const formId = form.id;
            const savedData = this.loadFormData(formId);
            if (savedData) {
                this.populateForm(form, savedData);
            }
        });
    },

    attachEventListeners() {
        // Form submission handling
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            }
        });

        // Auto-save on form changes
        document.addEventListener('input', (e) => {
            if (e.target.closest('form')) {
                this.autoSaveForm(e.target.closest('form'));
            }
        });

        // Clear form button handling
        document.querySelectorAll('.clear-form-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const formId = e.target.dataset.formId;
                this.clearForm(formId);
            });
        });
    },

    handleFormSubmit(form) {
        if (this.validateForm(form)) {
            const formData = new FormData(form);
            this.saveFormData(form.id, formData);
            this.showSuccessMessage(form);
            
            // Generate PDF if requested
            if (form.dataset.generatePdf) {
                this.generatePDF(form);
            }
        }
    },

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                this.showFieldError(field, 'This field is required');
            } else {
                this.clearFieldError(field);
            }
        });

        return isValid;
    },

    showFieldError(field, message) {
        field.classList.add('is-invalid');
        let errorDiv = field.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('error-message')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
        errorDiv.textContent = message;
    },

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.remove();
        }
    },

    autoSaveForm(form) {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            const formData = new FormData(form);
            this.saveFormData(form.id, formData);
            this.showAutoSaveIndicator();
        }, 1000);
    },

    loadFormData(formId) {
        const saved = localStorage.getItem(`form_${formId}`);
        return saved ? JSON.parse(saved) : null;
    },

    saveFormData(formId, formData) {
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        localStorage.setItem(`form_${formId}`, JSON.stringify(data));
    },

    populateForm(form, data) {
        Object.entries(data).forEach(([name, value]) => {
            const field = form.querySelector(`[name="${name}"]`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = value === 'true' || value === true;
                } else {
                    field.value = value;
                }
            }
        });
    },

    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            localStorage.removeItem(`form_${formId}`);
            this.showClearMessage(form);
        }
    },

    showSuccessMessage(form) {
        this.showMessage(form, 'Form submitted successfully', 'success-message');
    },

    showClearMessage(form) {
        this.showMessage(form, 'Form cleared', 'info-message');
    },

    showMessage(form, text, className) {
        const message = document.createElement('div');
        message.className = className;
        message.textContent = text;
        
        const container = form.querySelector('.message-container') || form;
        container.insertBefore(message, container.firstChild);
        
        setTimeout(() => message.remove(), 3000);
    },

    showAutoSaveIndicator() {
        const indicator = document.getElementById('autoSaveIndicator');
        if (indicator) {
            indicator.textContent = 'Changes saved automatically';
            indicator.classList.remove('hidden');
            setTimeout(() => indicator.classList.add('hidden'), 2000);
        }
    },

    generatePDF(form) {
        console.log('Generating PDF for form:', form.id);
        // PDF generation logic to be implemented
        window.generatePDF(form.id);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    FormManager.initialize();
});

// Make FormManager available globally
window.FormManager = FormManager;