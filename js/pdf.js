// PDF Generation and handling
class PDFGenerator {
    constructor() {
        this.doc = null;
        this.pageHeight = 0;
        this.pageWidth = 0;
        this.margin = 20;
        this.lineHeight = 12;
    }

    initializeDocument() {
        const { jsPDF } = window.jspdf;
        this.doc = new jsPDF();
        this.pageHeight = this.doc.internal.pageSize.height;
        this.pageWidth = this.doc.internal.pageSize.width;
        
        // Add header
        this.addHeader();
    }

    addHeader() {
        const today = new Date().toLocaleDateString();
        this.doc.setFontSize(18);
        this.doc.text('Biofouling Management Documentation', this.margin, this.margin);
        this.doc.setFontSize(10);
        this.doc.text(`Generated: ${today}`, this.margin, this.margin + 10);
        this.doc.line(this.margin, this.margin + 12, this.pageWidth - this.margin, this.margin + 12);
        
        // Reset cursor position after header
        this.currentY = this.margin + 20;
    }

    addFooter(pageNumber) {
        const footer = `Page ${pageNumber}`;
        this.doc.setFontSize(10);
        this.doc.text(footer, this.pageWidth - this.margin - 20, this.pageHeight - 10);
    }

    addFormContent(formId) {
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        
        this.doc.setFontSize(12);
        
        for (let [key, value] of formData.entries()) {
            // Format the key for display
            const displayKey = key.replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
            
            // Check if we need a new page
            if (this.currentY > this.pageHeight - this.margin) {
                this.doc.addPage();
                this.currentY = this.margin;
                this.addHeader();
            }
            
            // Add the field and value
            this.doc.setFont(undefined, 'bold');
            this.doc.text(`${displayKey}:`, this.margin, this.currentY);
            this.doc.setFont(undefined, 'normal');
            this.doc.text(value.toString(), this.margin + 60, this.currentY);
            
            this.currentY += this.lineHeight;
        }
        
        this.addFooter(this.doc.internal.getNumberOfPages());
    }

    addSignatureSection() {
        this.currentY += 20;
        
        if (this.currentY > this.pageHeight - 50) {
            this.doc.addPage();
            this.currentY = this.margin;
        }
        
        this.doc.line(this.margin, this.currentY, this.margin + 60, this.currentY);
        this.currentY += 5;
        this.doc.text('Signature', this.margin, this.currentY);
        
        this.currentY += 15;
        this.doc.line(this.margin, this.currentY, this.margin + 60, this.currentY);
        this.currentY += 5;
        this.doc.text('Date', this.margin, this.currentY);
    }

    generateQRCode() {
        // Generate QR code for document verification
        const qr = `https://verification.example.com/${Date.now()}`;
        // Note: Actual QR code generation would require additional library
        return qr;
    }

    async generatePDF(formId, includeSignature = true) {
        this.initializeDocument();
        this.addFormContent(formId);
        
        if (includeSignature) {
            this.addSignatureSection();
        }
        
        // Add QR code for verification
        const qr = this.generateQRCode();
        
        // Save the PDF
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${formId}-${timestamp}.pdf`;
        this.doc.save(filename);
    }
}

// Initialize PDF generator
const pdfGenerator = new PDFGenerator();

// Function to generate PDF from form
function generatePDF(formId) {
    if (formHandler.validateForm(formId).isValid) {
        pdfGenerator.generatePDF(formId);
    } else {
        alert('Please complete all required fields before generating PDF');
    }
}