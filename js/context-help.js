// context-help.js
const contextHelp = {
    // Help content dictionary
    content: {
        'default': {
            title: 'Help & Guidance',
            content: `
                <div class="help-section">
                    <h4>Getting Started</h4>
                    <p>Select an item from the navigation menu for specific guidance.</p>
                    <p>Each section provides relevant information and requirements.</p>
                </div>
            `
        },
        'BFMP': {
            title: 'Biofouling Management Plan',
            content: `
                <div class="help-section">
                    <h4>About BFMP</h4>
                    <p>The Biofouling Management Plan is a vessel-specific document required under Option 1 of the Australian Biofouling Management Requirements.</p>
                    
                    <h4>Key Requirements</h4>
                    <ul>
                        <li>Vessel particulars and operating profile</li>
                        <li>Description of anti-fouling systems</li>
                        <li>Inspection and cleaning schedules</li>
                        <li>Waste management procedures</li>
                    </ul>
                </div>
            `
        },
        'PreArrival': {
            title: 'Pre-arrival Reporting',
            content: `
                <div class="help-section">
                    <h4>Reporting Requirements</h4>
                    <p>Must be submitted between 12 and 96 hours before arrival.</p>
                    
                    <h4>Required Information</h4>
                    <ul>
                        <li>Vessel details and IMO number</li>
                        <li>Expected arrival date and time</li>
                        <li>Selected biofouling management option</li>
                        <li>Supporting documentation</li>
                    </ul>
                </div>
            `
        },
        'CleaningLogs': {
            title: 'Cleaning Records',
            content: `
                <div class="help-section">
                    <h4>Documentation Requirements</h4>
                    <p>Maintain complete records of all cleaning activities.</p>
                    
                    <h4>Required Details</h4>
                    <ul>
                        <li>Date and location of cleaning</li>
                        <li>Areas cleaned and methods used</li>
                        <li>Waste capture and disposal details</li>
                        <li>Photo documentation</li>
                    </ul>
                </div>
            `
        }
    },

    initialize() {
        console.log('Context help system initialized');
        this.updateHelp('default');
        this.setupFieldHelp();
    },

    updateHelp(section) {
        const contextContent = document.getElementById('contextContent');
        if (!contextContent) return;

        const helpContent = this.content[section] || this.content['default'];
        
        contextContent.innerHTML = `
            <h3 class="help-title">${helpContent.title}</h3>
            ${helpContent.content}
        `;
    },

    setupFieldHelp() {
        // Add field-specific help listeners
        document.addEventListener('focus', (e) => {
            if (e.target.hasAttribute('data-help')) {
                this.showFieldHelp(e.target.getAttribute('data-help'));
            }
        }, true);

        document.addEventListener('blur', () => {
            this.hideFieldHelp();
        }, true);
    },

    showFieldHelp(helpText) {
        let helpDiv = document.getElementById('fieldHelp');
        if (!helpDiv) {
            helpDiv = document.createElement('div');
            helpDiv.id = 'fieldHelp';
            helpDiv.className = 'field-help';
            document.body.appendChild(helpDiv);
        }
        helpDiv.innerHTML = helpText;
        helpDiv.style.display = 'block';
    },

    hideFieldHelp() {
        const helpDiv = document.getElementById('fieldHelp');
        if (helpDiv) {
            helpDiv.style.display = 'none';
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    contextHelp.initialize();
});

// Make contextHelp available globally
window.contextHelp = contextHelp;