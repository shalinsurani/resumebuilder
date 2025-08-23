/**
 * Professional Notification Service
 * Provides elegant toast notifications for user feedback
 */

class NotificationService {
  constructor() {
    this.notifications = [];
    this.container = null;
    this.init();
  }

  /**
   * Initialize notification container
   */
  init() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.className = 'notification-container';
      this.container.innerHTML = `
        <style>
          .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
          }
          
          .notification {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            margin-bottom: 12px;
            padding: 16px 20px;
            min-width: 320px;
            max-width: 400px;
            pointer-events: auto;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-left: 4px solid #e5e7eb;
            display: flex;
            align-items: flex-start;
            gap: 12px;
          }
          
          .notification.show {
            transform: translateX(0);
          }
          
          .notification.success {
            border-left-color: #10b981;
          }
          
          .notification.error {
            border-left-color: #ef4444;
          }
          
          .notification.warning {
            border-left-color: #f59e0b;
          }
          
          .notification.info {
            border-left-color: #3b82f6;
          }
          
          .notification-icon {
            font-size: 20px;
            margin-top: 2px;
            flex-shrink: 0;
          }
          
          .notification-content {
            flex: 1;
          }
          
          .notification-title {
            font-weight: 600;
            font-size: 14px;
            color: #1f2937;
            margin-bottom: 4px;
          }
          
          .notification-message {
            font-size: 13px;
            color: #6b7280;
            line-height: 1.4;
          }
          
          .notification-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 16px;
            padding: 0;
            margin-left: 8px;
            flex-shrink: 0;
          }
          
          .notification-close:hover {
            color: #6b7280;
          }
          
          @media (max-width: 640px) {
            .notification-container {
              left: 20px;
              right: 20px;
              top: 20px;
            }
            
            .notification {
              min-width: auto;
              max-width: none;
            }
          }
        </style>
      `;
      document.body.appendChild(this.container);
    }
  }

  /**
   * Show notification
   */
  show(options) {
    const {
      type = 'info',
      title,
      message,
      duration = 5000,
      persistent = false
    } = options;

    const id = Date.now().toString();
    const notification = this.createNotification(id, type, title, message);
    
    this.container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Auto remove if not persistent
    if (!persistent && duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  }

  /**
   * Create notification element
   */
  createNotification(id, type, title, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('data-id', id);

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    notification.innerHTML = `
      <div class="notification-icon">${icons[type] || icons.info}</div>
      <div class="notification-content">
        ${title ? `<div class="notification-title">${title}</div>` : ''}
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" onclick="notificationService.remove('${id}')">&times;</button>
    `;

    return notification;
  }

  /**
   * Remove notification
   */
  remove(id) {
    const notification = this.container.querySelector(`[data-id="${id}"]`);
    if (notification) {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }

  /**
   * Clear all notifications
   */
  clear() {
    const notifications = this.container.querySelectorAll('.notification');
    notifications.forEach(notification => {
      const id = notification.getAttribute('data-id');
      this.remove(id);
    });
  }

  /**
   * Remove all notifications (alias for clear)
   */
  removeAll() {
    this.clear();
  }

  /**
   * Success notification
   */
  success(title, message, options = {}) {
    return this.show({
      type: 'success',
      title,
      message,
      ...options
    });
  }

  /**
   * Error notification
   */
  error(title, message, options = {}) {
    return this.show({
      type: 'error',
      title,
      message,
      duration: 8000, // Longer duration for errors
      ...options
    });
  }

  /**
   * Warning notification
   */
  warning(title, message, options = {}) {
    return this.show({
      type: 'warning',
      title,
      message,
      duration: 6000,
      ...options
    });
  }

  /**
   * Info notification
   */
  info(title, message, options = {}) {
    return this.show({
      type: 'info',
      title,
      message,
      ...options
    });
  }

  /**
   * Loading notification (persistent)
   */
  loading(title, message) {
    return this.show({
      type: 'info',
      title,
      message,
      persistent: true,
      duration: 0
    });
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// Make it globally available for onclick handlers
window.notificationService = notificationService;

// Export convenience functions
export const showSuccess = (title, message, options) => notificationService.success(title, message, options);
export const showError = (title, message, options) => notificationService.error(title, message, options);
export const showWarning = (title, message, options) => notificationService.warning(title, message, options);
export const showInfo = (title, message, options) => notificationService.info(title, message, options);
export const showLoading = (title, message) => notificationService.loading(title, message);
