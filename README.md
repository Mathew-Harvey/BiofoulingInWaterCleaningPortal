# BiofoulingInWaterCleaningPortal
A simple UI for navigating requirements for inwater cleaning

# Biofouling Management System Development Context

## Project Overview
We are developing a web-based system to help vessel operators comply with Australian Biofouling Management Requirements. The system uses vanilla JavaScript, HTML, and CSS to create a comprehensive documentation and compliance tracking system.

## Current Implementation
The system consists of the following structure:

```
project/
├── css/
│   ├── context-help.css
│   ├── print.css
│   ├── style.css
│   └── timeline.css
├── forms/
│   
│   ├── audit.html
│   ├── bfmp.html
│   ├── cleaning.html
│   
│  
│   ├── pre-arrival.html
│   └── risk-assessment.html
├── js/
│   ├── context-help.js
│   ├── form-handler.js
│   ├── forms.js
│   ├── main.js
│   ├── navigation.js
│   ├── pdf.js
│   ├── timeline.js
│   └── validation.js
├── index.html
├── README.md
└── timeline.html
```

## Key Features Implemented
1. Form system for all required documentation
2. Context-sensitive help system
3. Timeline tracking for deadlines and requirements
4. PDF generation capabilities
5. Validation system for form inputs
6. Navigation system for document management

## Technical Requirements
- Vanilla JavaScript only (no frameworks or modern JS features requiring transpilation)
- Client-side only functionality
- Print-friendly formatting
- Accessible design
- Compliant with Australian Biofouling Management Requirements

## Integration Points
1. AI Assistant integration via external URL
2. PDF generation using jsPDF library
3. Local storage for form data persistence
4. Context-sensitive help system
5. Timeline tracking system

## Current Status
The basic structure and core functionality are implemented. The system includes:
- Navigation system
- Form templates
- Validation logic
- Timeline tracking
- Context help
- Print styling

## Next Steps
Areas that need attention:

2. Additional form validations
3. Enhanced data persistence
4. User feedback systems
5. Form state management

8. Testing and validation

## Regulatory Compliance
The system must maintain compliance with:
- Biosecurity Act 2015
- Australian Biofouling Management Requirements 2023
- Anti-Fouling and In-Water Cleaning Guidelines

## Source Documents
The implementation is based on the following source documents (previously provided):
1. Biofouling_Cleaning_Log_Form
2. Biofouling_Waste_Disposal_Confirmation_Form
3. Biofouling_Training_and_Maintenance_Records
4. Detailed_Biofouling_Compliance_Audit_Checklist
5. Master Biofouling Standard Operating Procedure
6. Australian-biofouling-management-requirements.pdf

## Design Principles
1. User-centric interface
2. Clear navigation
3. Context-sensitive help
4. Regulatory compliance
5. Data persistence
6. Print-friendly output
7. Accessible design
8. Intuitive form completion

Please continue development maintaining these principles and technical requirements while ensuring all new features align with the existing implementation and regulatory requirements.

End of Context