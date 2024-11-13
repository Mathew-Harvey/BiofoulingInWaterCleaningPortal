// Validation and Data Handling System
class ValidationSystem {
    constructor() {
        this.validationRules = {
            // Vessel identification rules
            vesselName: {
                required: true,
                minLength: 2,
                maxLength: 100,
                pattern: /^[A-Za-z0-9\s\-\.]+$/,
                message: "Vessel name must be between 2-100 characters and contain only letters, numbers, spaces, hyphens, and periods"
            },
            imoNumber: {
                required: true,
                pattern: /^[0-9]{7}$/,
                message: "IMO number must be exactly 7 digits"
            },
            
            // Date validation rules
            dates: {
                preArrival: {
                    validate: (date) => {
                        const now = new Date();
                        const arrivalDate = new Date(date);
                        const hoursDiff = (arrivalDate - now) / (1000 * 60 * 60);
                        return hoursDiff >= 12 && hoursDiff <= 96;
                    },
                    message: "Pre-arrival report must be submitted between 12 and 96 hours before arrival"
                },
                cleaning: {
                    validate: (date) => {
                        const now = new Date();
                        const cleaningDate = new Date(date);
                        const daysDiff = (now - cleaningDate) / (1000 * 60 * 60 * 24);
                        return daysDiff <= 30;
                    },
                    message: "Cleaning must have been performed within the last 30 days"
                }
            },

            // Measurement validation rules
            measurements: {
                percentage: {
                    min: 0,
                    max: 100,
                    message: "Percentage must be between 0 and 100"
                },
                length: {
                    min: 0,
                    max: 500,
                    message: "Length must be between 0 and 500 meters"
                }
            },

            // Document validation rules
            documents: {
                fileSize: 10 * 1024 * 1024, // 10MB
                allowedTypes: {
                    images: ['image/jpeg', 'image/png', 'image/gif'],
                    documents: ['application/pdf', 'application/msword', 
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                    spreadsheets: ['application/vnd.ms-excel',
                                 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
                }
            }
        };

        this.initializeValidation();
    }

    initializeValidation() {
        // Attach validation to all forms
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                if (!this.validateForm(e.target)) {
                    e.preventDefault();
                }
            }
        });

        // Real-time validation on input
        document.addEventListener('input', (e) => {
            if (e.target.hasAttribute('data-validate')) {
                this.validateField(e.target);
            }
        });
    }

    validateForm(form) {
        let isValid = true;
        const formData = new FormData(form);
        const errors = [];

        for (const [name, value] of formData.entries()) {
            const field = form.querySelector(`[name="${name}"]`);
            if (!this.validateField(field)) {
                isValid = false;
            }
        }

        // Special validation for file uploads
        const fileInputs = form.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            if (!this.validateFileUpload(input)) {
                isValid = false;
            }
        });

        // Form-specific validation rules
        if (form.id === 'preArrivalForm') {
            isValid = isValid && this.validatePreArrivalForm(form);
        } else if (form.id === 'cleaningLogForm') {
            isValid = isValid && this.validateCleaningLog(form);
        }

        if (!isValid) {
            this.showFormErrors(form, errors);
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value;
        const rules = this.validationRules[field.name] || {};
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${field.name} is required`;
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.message;
        }

        // Length validation
        if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `Minimum length is ${rules.minLength} characters`;
        }

        // Custom validation functions
        if (rules.validate && !rules.validate(value)) {
            isValid = false;
            errorMessage = rules.message;
        }

        this.updateFieldValidationUI(field, isValid, errorMessage);
        return isValid;
    }

    validateFileUpload(input) {
        const files = input.files;
        const rules = this.validationRules.documents;
        let isValid = true;
        let errorMessage = '';

        for (let file of files) {
            // Size validation
            if (file.size > rules.fileSize) {
                isValid = false;
                errorMessage = `File ${file.name} exceeds maximum size of 10MB`;
                break;
            }

            // Type validation
            const fileType = file.type;
            const allowedTypes = [
                ...rules.allowedTypes.images,
                ...rules.allowedTypes.documents,
                ...rules.allowedTypes.spreadsheets
            ];

            if (!allowedTypes.includes(fileType)) {
                isValid = false;
                errorMessage = `File type ${fileType} is not allowed`;
                break;
            }
        }

        this.updateFieldValidationUI(input, isValid, errorMessage);
        return isValid;
    }

    validatePreArrivalForm(form) {
        const arrivalDate = form.querySelector('#expectedArrival').value;
        return this.validationRules.dates.preArrival.validate(arrivalDate);
    }

    validateCleaningLog(form) {
        const cleaningDate = form.querySelector('#cleaningDate').value;
        return this.validationRules.dates.cleaning.validate(cleaningDate);
    }

    updateFieldValidationUI(field, isValid, errorMessage) {
        // Remove existing error messages
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Update field styling
        field.classList.toggle('is-invalid', !isValid);
        field.classList.toggle('is-valid', isValid);

        // Add error message if invalid
        if (!isValid) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-red-500 text-sm mt-1';
            errorDiv.textContent = errorMessage;
            field.parentElement.appendChild(errorDiv);
        }
    }

    showFormErrors(form, errors) {
        const errorContainer = form.querySelector('.error-container');
        if (errorContainer) {
            errorContainer.innerHTML = errors.map(error => 
                `<div class="error-message bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-2">
                    ${error}
                </div>`
            ).join('');
        }
    }
}

// Data Handling System
class DataHandler {
    constructor() {
        this.storageKey = 'biofoulingData';
        this.data = this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : {};
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    saveForm(formId, formData) {
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        this.data[formId] = {
            ...this.data[formId],
            lastUpdated: new Date().toISOString(),
            data: data
        };
        
        this.saveData();
    }

    loadForm(formId) {
        return this.data[formId]?.data || null;
    }

    exportData(formId) {
        const formData = this.loadForm(formId);
        if (!formData) return null;

        return {
            formId,
            data: formData,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    clearForm(formId) {
        if (this.data[formId]) {
            delete this.data[formId];
            this.saveData();
        }
    }
}

// Initialize systems
const validationSystem = new ValidationSystem();
const dataHandler = new DataHandler();

export { validationSystem, dataHandler };