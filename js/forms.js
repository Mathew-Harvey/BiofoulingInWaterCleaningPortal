// forms.js
const FormHandler = {
    formData: new Map(),

    initialize() {
        this.setupLocalStorage();
        this.attachEventListeners();
        console.log('Form handler initialized');
    },

    setupLocalStorage() {
        // Load any saved form data
        const savedData = localStorage.getItem('biofoulingForms');
        if (savedData) {
            try {
                this.formData = new Map(JSON.parse(savedData));
            } catch (error) {
                console.error('Error loading saved form data:', error);
                this.formData = new Map();
            }
        }
    },

    attachEventListeners() {
        // Handle form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                e.preventDefault();
                this.submitForm(e.target.id);
            }
        });

        // Handle form field validation
        document.addEventListener('input', (e) => {
            if (e.target.hasAttribute('required')) {
                this.validateField(e.target);
            }
        });
    },

    saveFormData(formId, data) {
        this.formData.set(formId, data);
        try {
            localStorage.setItem('biofoulingForms', 
                JSON.stringify(Array.from(this.formData.entries())));
        } catch (error) {
            console.error('Error saving form data:', error);
            this.showMessage('Error saving form data', 'error');
        }
    },

    loadFormData(formId) {
        return this.formData.get(formId);
    },

    validateField(field) {
        const isValid = field.value.trim() !== '';
        field.classList.toggle('error', !isValid);
        
        // Update error message
        let errorSpan = field.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains('error-message')) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            field.parentNode.insertBefore(errorSpan, field.nextSibling);
        }
        
        errorSpan.textContent = isValid ? '' : `${field.name} is required`;
        return isValid;
    },

    validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return { isValid: false, errors: ['Form not found'] };

        let isValid = true;
        const errors = [];

        // Validate all required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
                errors.push(`${field.name} is required`);
            }
        });

        // Validate field types
        form.querySelectorAll('input').forEach(field => {
            switch (field.type) {
                case 'email':
                    if (field.value && !field.value.includes('@')) {
                        isValid = false;
                        errors.push('Invalid email address');
                        field.classList.add('error');
                    }
                    break;
                case 'tel':
                    if (field.value && !/^\+?[\d\s-]{8,}$/.test(field.value)) {
                        isValid = false;
                        errors.push('Invalid phone number');
                        field.classList.add('error');
                    }
                    break;
            }
        });

        return { isValid, errors };
    },

    submitForm(formId) {
        const { isValid, errors } = this.validateForm(formId);
        
        if (!isValid) {
            this.showErrors(errors);
            return false;
        }

        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        this.saveFormData(formId, data);
        this.showMessage('Form submitted successfully', 'success');
        return true;
    },

    showErrors(errors) {
        const errorDiv = document.getElementById('formErrors');
        if (errorDiv) {
            errorDiv.innerHTML = errors.map(error => 
                `<p class="error-message">${error}</p>`
            ).join('');
            errorDiv.scrollIntoView({ behavior: 'smooth' });
        }
    },

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 3000);
    },

    populateForm(formId) {
        const savedData = this.loadFormData(formId);
        if (!savedData) return;

        const form = document.getElementById(formId);
        if (!form) return;

        Object.entries(savedData).forEach(([key, value]) => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = value === 'true' || value === true;
                } else if (field.type === 'radio') {
                    const radio = form.querySelector(`[name="${key}"][value="${value}"]`);
                    if (radio) radio.checked = true;
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
            this.formData.delete(formId);
            this.saveFormData(formId, null);
            this.showMessage('Form cleared', 'info');
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    FormHandler.initialize();
});

// Make FormHandler available globally
window.FormHandler = FormHandler;