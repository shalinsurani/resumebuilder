/**
 * Professional PDF Export Service
 * Handles high-quality PDF generation from resume preview
 */

export class PDFExportService {
  constructor() {
    this.isLibrariesLoaded = false;
    this.checkLibraries();
  }

  /**
   * Check if required libraries are loaded
   */
  checkLibraries() {
    this.isLibrariesLoaded = !!(window.html2canvas && window.jspdf);
    return this.isLibrariesLoaded;
  }

  /**
   * Wait for libraries to load
   */
  async waitForLibraries(timeout = 10000) {
    const startTime = Date.now();
    
    while (!this.checkLibraries() && (Date.now() - startTime) < timeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!this.isLibrariesLoaded) {
      throw new Error('PDF libraries failed to load. Please refresh the page and try again.');
    }
    
    return true;
  }

  /**
   * Export resume as PDF with high quality
   */
  async exportToPDF(options = {}) {
    try {
      // Wait for libraries to load
      await this.waitForLibraries();

      const {
        elementId = 'resume-preview',
        filename = 'resume.pdf',
        quality = 2,
        format = 'a4',
        orientation = 'portrait',
        margin = 10
      } = options;

      // Get the resume preview element
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Resume preview not found. Please ensure the resume is loaded.');
      }

      // Show loading state
      this.showLoadingState(true);

      // Configure html2canvas options for high quality
      const canvasOptions = {
        scale: quality,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        // Set fixed dimensions for A4 format (in pixels at 96 DPI)
        width: 794, // A4 width at 96 DPI
        height: 1123, // A4 height at 96 DPI
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794, // A4 width at 96 DPI
        windowHeight: 1123, // A4 height at 96 DPI
        onclone: (clonedDoc) => {
          // Ensure proper styling for PDF export
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            clonedElement.style.overflow = 'visible';
            clonedElement.style.height = 'auto';
            // Set fixed width for consistent export
            clonedElement.style.width = '794px';
            clonedElement.style.maxWidth = '794px';
          }
          
          // Apply print media styles
          const mediaStyle = clonedDoc.createElement('style');
          mediaStyle.type = 'text/css';
          mediaStyle.innerHTML = `
            @media print {
              * {
                overflow: visible !important;
              }
              body {
                zoom: 1 !important;
                transform: none !important;
                width: 794px !important;
                max-width: 794px !important;
              }
              .resume-template, .t12-container, .template1-resume, .modern69-container, .modern21-container, .howard-template, .daniel-template, .t31-container {
                width: 794px !important;
                max-width: 794px !important;
                min-width: 794px !important;
              }
            }
          `;
          clonedDoc.head.appendChild(mediaStyle);
        }
      };

      // Generate canvas from HTML
      const canvas = await window.html2canvas(element, canvasOptions);
      
      // Get image data
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Calculate PDF dimensions
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: format,
        compress: true
      });

      // Get PDF page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image dimensions to fit page with margins
      const availableWidth = pageWidth - (margin * 2);
      const availableHeight = pageHeight - (margin * 2);
      
      // Calculate scaling factor to fit content to A4 page
      const scaleX = availableWidth / canvas.width;
      const scaleY = availableHeight / canvas.height;
      const scale = Math.min(scaleX, scaleY, 1); // Don't scale up
      
      const imgWidth = canvas.width * scale;
      const imgHeight = canvas.height * scale;
      
      // Center the image on the page
      const xPos = margin + (availableWidth - imgWidth) / 2;
      const yPos = margin + (availableHeight - imgHeight) / 2;

      // Check if image fits on one page
      if (imgHeight <= availableHeight) {
        // Single page
        pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
      } else {
        // Multiple pages - split the canvas into pages
        const pageHeightInCanvas = (availableHeight / imgHeight) * canvas.height;
        let currentCanvasY = 0;
        let pageNumber = 1;

        while (currentCanvasY < canvas.height) {
          if (pageNumber > 1) {
            pdf.addPage();
          }

          // Calculate how much of the canvas fits on this page
          const remainingCanvasHeight = canvas.height - currentCanvasY;
          const canvasPageHeight = Math.min(pageHeightInCanvas, remainingCanvasHeight);

          // Create a temporary canvas for this page
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvasPageHeight;
          
          const tempCtx = tempCanvas.getContext('2d');
          tempCtx.drawImage(
            canvas,
            0, currentCanvasY, canvas.width, canvasPageHeight,
            0, 0, canvas.width, canvasPageHeight
          );

          // Scale the page image to fit the PDF page
          const pageImgData = tempCanvas.toDataURL('image/png', 1.0);
          pdf.addImage(pageImgData, 'PNG', xPos, yPos, imgWidth,
            (canvasPageHeight / canvas.height) * imgHeight);

          currentCanvasY += pageHeightInCanvas;
          pageNumber++;
        }
      }

      // Add metadata
      pdf.setProperties({
        title: 'Professional Resume',
        subject: 'Resume Document',
        author: 'Resume Builder',
        creator: 'Resume Builder App',
        producer: 'Resume Builder PDF Export'
      });

      // Save the PDF
      pdf.save(filename);

      // Hide loading state
      this.showLoadingState(false);

      return {
        success: true,
        message: 'Resume exported successfully!',
        filename: filename
      };

    } catch (error) {
      this.showLoadingState(false);
      console.error('PDF Export Error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to export PDF. Please try again.',
        details: error
      };
    }
  }

  /**
   * Show/hide loading state
   */
  showLoadingState(show) {
    // You can implement a loading overlay here
    const loadingElement = document.getElementById('pdf-loading');
    if (loadingElement) {
      loadingElement.style.display = show ? 'flex' : 'none';
    }
  }

  /**
   * Validate resume data before export
   */
  validateResumeData(resumeData) {
    const errors = [];

    if (!resumeData.personalInfo?.fullName?.trim()) {
      errors.push('Full name is required');
    }

    if (!resumeData.personalInfo?.email?.trim()) {
      errors.push('Email is required');
    }

    if (errors.length > 0) {
      throw new Error(`Please complete the following fields before exporting:\n${errors.join('\n')}`);
    }

    return true;
  }

  /**
   * Get suggested filename based on resume data
   */
  getSuggestedFilename(resumeData) {
    const name = resumeData.personalInfo?.fullName?.trim();
    if (name) {
      const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = new Date().toISOString().split('T')[0];
      return `${cleanName}_Resume_${timestamp}.pdf`;
    }
    return `Resume_${new Date().toISOString().split('T')[0]}.pdf`;
  }

  /**
   * Export with automatic filename and validation
   */
  async exportResumeWithValidation(resumeData, customOptions = {}) {
    try {
      // Validate resume data
      this.validateResumeData(resumeData);

      // Generate filename
      const filename = this.getSuggestedFilename(resumeData);

      // Export with suggested filename
      return await this.exportToPDF({
        filename,
        ...customOptions
      });

    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }
}

// Create singleton instance
export const pdfExportService = new PDFExportService();

// Export utility function for easy use
export const exportResumeToPDF = async (resumeData, options = {}) => {
  return await pdfExportService.exportResumeWithValidation(resumeData, options);
};
