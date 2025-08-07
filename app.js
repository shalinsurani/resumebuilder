// React Firebase Resume Builder Download Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initCopyStructure();
    initDownloadTracking();
    initScrollAnimations();
    initTooltips();
});

// Copy file structure functionality
function initCopyStructure() {
    const copyButton = document.getElementById('copyStructure');
    const fileStructure = document.getElementById('fileStructure');
    
    if (copyButton && fileStructure) {
        copyButton.addEventListener('click', function() {
            copyToClipboard(fileStructure.textContent, copyButton);
        });
    }
}

// Copy text to clipboard with visual feedback
function copyToClipboard(text, button) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            showCopySuccess(button);
        }).catch(function(err) {
            console.error('Failed to copy text: ', err);
            fallbackCopyTextToClipboard(text, button);
        });
    } else {
        fallbackCopyTextToClipboard(text, button);
    }
}

// Fallback copy method for older browsers
function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(button);
        } else {
            console.error('Fallback: Copying text command was unsuccessful');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

// Show copy success feedback
function showCopySuccess(button) {
    const originalText = button.textContent;
    const originalClass = button.className;
    
    button.textContent = 'Copied!';
    button.classList.add('copy-success');
    
    setTimeout(function() {
        button.textContent = originalText;
        button.className = originalClass;
    }, 2000);
}

// Download tracking and analytics
function initDownloadTracking() {
    const downloadButton = document.getElementById('downloadBtn');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', function(e) {
            // Track download event
            trackDownload();
            
            // Add visual feedback
            const originalText = downloadButton.innerHTML;
            downloadButton.innerHTML = '<span>📥 Downloading...</span>';
            downloadButton.style.pointerEvents = 'none';
            
            // Reset button after delay
            setTimeout(function() {
                downloadButton.innerHTML = originalText;
                downloadButton.style.pointerEvents = 'auto';
            }, 3000);
        });
    }
}

// Track download events (can be extended with analytics)
function trackDownload() {
    const downloadData = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        page: 'download-page',
        action: 'download-zip'
    };
    
    // Log to console (can be replaced with actual analytics)
    console.log('Download tracked:', downloadData);
    
    // Could integrate with analytics services here
    // Example: gtag('event', 'download', { event_category: 'engagement' });
}

// Scroll animations for sections
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, options);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
}

// Initialize tooltips for interactive elements
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

// Show tooltip
function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.position = 'absolute';
    tooltip.style.top = rect.bottom + 10 + 'px';
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.backgroundColor = 'var(--color-text)';
    tooltip.style.color = 'var(--color-surface)';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '1000';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.2s ease-in-out';
    
    // Fade in
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
    
    e.target.tooltipElement = tooltip;
}

// Hide tooltip
function hideTooltip(e) {
    if (e.target.tooltipElement) {
        e.target.tooltipElement.style.opacity = '0';
        setTimeout(() => {
            if (e.target.tooltipElement && e.target.tooltipElement.parentNode) {
                e.target.tooltipElement.parentNode.removeChild(e.target.tooltipElement);
            }
        }, 200);
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Feature cards hover effect
function initFeatureCards() {
    const featureItems = document.querySelectorAll('.feature-item');
    
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
            this.style.borderColor = 'var(--color-primary)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.borderColor = 'var(--color-card-border)';
        });
    });
}

// Tech stack items animation
function initTechStackAnimation() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Setup steps progress tracking
function initSetupStepsTracking() {
    const setupSteps = document.querySelectorAll('.setup-step');
    
    setupSteps.forEach((step, index) => {
        step.addEventListener('click', function() {
            // Toggle completed state
            this.classList.toggle('completed');
            
            // Update step number styling
            const stepNumber = this.querySelector('.setup-step__number');
            if (this.classList.contains('completed')) {
                stepNumber.textContent = '✓';
                stepNumber.style.backgroundColor = 'var(--color-success)';
            } else {
                stepNumber.textContent = index + 1;
                stepNumber.style.backgroundColor = 'var(--color-primary)';
            }
        });
    });
}

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initCopyStructure();
    initDownloadTracking();
    initScrollAnimations();
    initTooltips();
    initSmoothScrolling();
    initFeatureCards();
    initTechStackAnimation();
    initSetupStepsTracking();
});

// Utility functions
const utils = {
    // Debounce function for performance optimization
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Format file size
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

// Performance monitoring
const performance = {
    start: Date.now(),
    
    mark: function(name) {
        console.log(`Performance mark: ${name} - ${Date.now() - this.start}ms`);
    },
    
    measure: function(name, startTime) {
        const endTime = Date.now();
        console.log(`Performance measure: ${name} - ${endTime - startTime}ms`);
    }
};

// Initialize performance monitoring
performance.mark('Page Load Complete');