import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { validateEmail, getErrorMessage } from '../../utils/helpers';
import { showSuccess, showError } from '../../services/notifications';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { forgotPassword, error, setError } = useAuth();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
    // Clear auth error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    if (!email) {
      setValidationError('Email address is required');
      return false;
    }
    
    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setEmailSent(true);
        showSuccess(
          'Reset Email Sent!', 
          `We've sent a password reset link to ${email}. Please check your inbox and follow the instructions.`
        );
      } else {
        showError(
          'Reset Failed', 
          result.error || 'Failed to send reset email. Please try again.'
        );
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      showError(
        'Reset Failed', 
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        showSuccess(
          'Email Resent!', 
          `We've sent another password reset link to ${email}.`
        );
      } else {
        showError(
          'Resend Failed', 
          result.error || 'Failed to resend email. Please try again.'
        );
      }
    } catch (error) {
      console.error('Resend email error:', error);
      showError(
        'Resend Failed', 
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Check Your Email</h2>
            <p>We've sent a password reset link to:</p>
            <div className="email-display">
              <strong>{email}</strong>
            </div>
          </div>

          <div className="auth-content">
            <div className="reset-instructions">
              <h3>What's Next?</h3>
              <ol>
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the reset link in the email</li>
                <li>Create a new password</li>
                <li>Sign in with your new password</li>
              </ol>
            </div>

            <div className="reset-actions">
              <Button
                variant="secondary"
                onClick={handleResendEmail}
                disabled={loading}
                className="resend-button"
              >
                {loading ? <LoadingSpinner size="small" /> : 'Resend Email'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="change-email-button"
              >
                Use Different Email
              </Button>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              Remember your password? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your email address and we'll send you a link to reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address"
              className={validationError || error ? 'error' : ''}
              autoFocus
            />
            {validationError && (
              <span className="error-message">{validationError}</span>
            )}
          </div>

          {error && (
            <div className="error-message auth-error">
              {getErrorMessage(error)}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="auth-button"
          >
            {loading ? <LoadingSpinner size="small" /> : 'Send Reset Link'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password? <Link to="/login">Sign in here</Link>
          </p>
          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
