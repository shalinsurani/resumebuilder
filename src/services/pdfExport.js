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
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
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
      
      const imgWidth = availableWidth;
      const imgHeight = (canvas.height * availableWidth) / canvas.width;

      // Check if image fits on one page
      if (imgHeight <= availableHeight) {
        // Single page
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      } else {
        // Multiple pages
        let remainingHeight = imgHeight;
        let currentY = 0;
        let pageNumber = 1;

        while (remainingHeight > 0) {
          const pageImgHeight = Math.min(availableHeight, remainingHeight);
          
          if (pageNumber > 1) {
            pdf.addPage();
          }

          // Calculate source coordinates for cropping
          const sourceY = (currentY / imgHeight) * canvas.height;
          const sourceHeight = (pageImgHeight / imgHeight) * canvas.height;

          // Create a temporary canvas for this page
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = sourceHeight;
          
          const tempCtx = tempCanvas.getContext('2d');
          tempCtx.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,
            0, 0, canvas.width, sourceHeight
          );

          const pageImgData = tempCanvas.toDataURL('image/png', 1.0);
          pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, pageImgHeight);

          remainingHeight -= pageImgHeight;
          currentY += pageImgHeight;
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
