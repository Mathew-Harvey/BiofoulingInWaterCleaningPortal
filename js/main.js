// main.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized');
    
    // Initialize navigation
    const navElement = document.getElementById('mainNav');
    if (navElement) {
        buildNavigationMenu();
    }
});

// Navigation structure
const navigationStructure = {
    "Master Biofouling SOP": {
        "1. Purpose": {
            path: "/forms/purpose.html",
            description: "Defines the purpose of the biofouling SOP"
        },
        "2. Scope": {
            path: "/forms/scope.html",
            description: "Outlines the SOP scope, applicable to all personnel and vessels under biosecurity control"
        },
        "3. Regulatory Framework": {
            path: "/forms/regulatory-framework.html",
            description: "Lists regulatory compliance requirements"
        },
        "4. Roles and Responsibilities": {
            path: "/forms/roles-responsibilities.html",
            description: "Defines responsibilities for Vessel Master, Environmental Officer, and crew"
        },
        "5. Biofouling Management Plan (BFMP)": {
            path: "/forms/bfmp.html",
            description: "Details vessel-specific biofouling management plans"
        },
        "6. Biofouling Record Book (BFRB)": {
            path: "/forms/bfrb.html",
            description: "Documents all biofouling management activities"
        },
        "7. Inspection and Cleaning Procedures": {
            path: "/forms/inspection-cleaning.html",
            description: "Outlines approved inspection and cleaning methods"
        },
        "8. Waste Management Procedures": {
            path: "/forms/waste-management.html",
            description: "Describes waste containment and disposal procedures"
        },
        "9. Equipment Maintenance and Calibration": {
            path: "/forms/equipment-maintenance.html",
            description: "Defines maintenance requirements for biofouling equipment"
        },
        "10. Personnel Training Standards": {
            path: "/forms/training.html",
            description: "Covers training standards for biofouling management"
        },
        "11. Client Communication and Education": {
            path: "/forms/client-communication.html",
            description: "Guidelines for client communication and biofouling education"
        },
        "12. Continuous Improvement": {
            path: "/forms/continuous-improvement.html",
            description: "Outlines feedback collection and SOP review process"
        },
    }
};

function buildNavigationMenu() {
    const navElement = document.getElementById('mainNav');
    
    function createNavItem(key, value) {
        const li = document.createElement('li');
        li.className = 'nav-item';
        
        if (typeof value === 'object' && !value.path) {
            // This is a category
            const span = document.createElement('span');
            span.textContent = key;
            span.className = 'nav-category';
            li.appendChild(span);
            
            const subUl = document.createElement('ul');
            subUl.className = 'nav-submenu';
            Object.entries(value).forEach(([subKey, subValue]) => {
                subUl.appendChild(createNavItem(subKey, subValue));
            });
            li.appendChild(subUl);
        } else {
            // This is a link
            const link = document.createElement('a');
            link.textContent = key;
            link.href = '#';
            link.className = 'nav-link';
            
            if (value.path) {
                link.setAttribute('data-path', value.path);
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadContent(value.path, key, value.description);
                });
            }
            
            li.appendChild(link);
        }
        
        return li;
    }

    // Clear existing navigation
    navElement.innerHTML = '';
    
    // Build navigation structure
    Object.entries(navigationStructure).forEach(([key, value]) => {
        navElement.appendChild(createNavItem(key, value));
    });
}

async function loadContent(path, title, description) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        
        const contentArea = document.getElementById('contentArea');
        if (contentArea) {
            contentArea.innerHTML = `
                <h2 class="content-title">${title}</h2>
                <p class="content-description">${description || ''}</p>
                <div class="content-body">${content}</div>
            `;
        }

        // Update context help if available
        if (window.contextHelp && typeof window.contextHelp.updateHelp === 'function') {
            window.contextHelp.updateHelp(title);
        }
    } catch (error) {
        console.error('Error loading content:', error);
        const contentArea = document.getElementById('contentArea');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="error-message">
                    <h3>Error Loading Content</h3>
                    <p>Unable to load the requested content. Please try again later.</p>
                </div>
            `;
        }
    }
}

// Utility functions
function generatePDF(formId) {
    console.log('Generating PDF for form:', formId);
    alert('PDF generation functionality coming soon');
}

function addVoyageRow() {
    const tableBody = document.querySelector('.voyage-history tbody');
    if (tableBody) {
        const newRow = tableBody.insertRow();
        newRow.innerHTML = `
            <td><input type="text" class="form-control" name="port[]"></td>
            <td><input type="date" class="form-control" name="arrivalDate[]"></td>
            <td><input type="date" class="form-control" name="departureDate[]"></td>
            <td><input type="text" class="form-control" name="activities[]"></td>
            <td><button type="button" class="btn btn-danger" onclick="this.closest('tr').remove()">Remove</button></td>
        `;
    }
}

// Make utility functions globally available
window.generatePDF = generatePDF;
window.addVoyageRow = addVoyageRow;
window.loadContent = loadContent;