// Modal Management - Robust Version
class BetaModal {
    constructor() {
        console.log('BetaModal constructor called');
        
        // Get all elements
        this.modal = document.getElementById('betaModal');
        this.formState = document.getElementById('formState');
        this.successState = document.getElementById('successState');
        this.errorMessage = document.getElementById('errorMessage');
        this.form = document.getElementById('betaSignupForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.modalTitle = document.getElementById('modalTitle');
        
        // Debug element finding
        console.log('Modal elements found:', {
            modal: !!this.modal,
            formState: !!this.formState,
            successState: !!this.successState,
            errorMessage: !!this.errorMessage,
            form: !!this.form,
            submitBtn: !!this.submitBtn,
            modalTitle: !!this.modalTitle
        });
        
        // Check if all required elements exist
        if (!this.modal || !this.form || !this.submitBtn) {
            console.error('Required modal elements not found!');
            return;
        }
        
        this.init();
    }
    
    init() {
        console.log('Initializing modal...');
        
        try {
            // Bind modal triggers - all CTA buttons
            this.bindModalTriggers();
            
            // Bind close events
            this.bindCloseEvents();
            
            // Bind form submission
            this.bindFormSubmission();
            
            // Close on overlay click
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                    this.close();
                }
            });
            
            console.log('Modal initialization completed successfully');
        } catch (error) {
            console.error('Error during modal initialization:', error);
        }
    }
    
    bindModalTriggers() {
        console.log('Binding modal triggers...');
        
        // Find only the CTA buttons that should open the modal (exclude the form submit button)
        const ctaButtons = document.querySelectorAll('a[href="#demo"]');
        console.log('Found CTA buttons:', ctaButtons.length);
        
        ctaButtons.forEach((button, index) => {
            console.log(`Binding button ${index}:`, button);
            button.addEventListener('click', (e) => {
                console.log('CTA button clicked, opening modal');
                e.preventDefault();
                this.open();
            });
        });
    }
    
    bindCloseEvents() {
        console.log('Binding close events...');
        
        // Close button in modal header
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                console.log('Modal close button clicked');
                this.close();
            });
        }
        
        // Close button in success state
        const successClose = document.getElementById('successClose');
        if (successClose) {
            successClose.addEventListener('click', () => {
                console.log('Success close button clicked');
                this.close();
            });
        }
    }
    
    bindFormSubmission() {
        console.log('Binding form submission...');
        
        if (!this.form || !this.submitBtn) {
            console.error('Form or submit button not found!');
            return;
        }
        
        // Primary form submit handler
        this.form.addEventListener('submit', (e) => {
            console.log('=== FORM SUBMIT EVENT TRIGGERED ===');
            e.preventDefault();
            e.stopPropagation();
            this.handleSubmit();
        });
        
        console.log('Form submission binding completed');
    }
    
    handleSubmit() {
        console.log('=== HANDLE SUBMIT CALLED ===');
        
        // Don't allow multiple submissions
        if (this.isSubmitting) {
            console.log('Already submitting, ignoring');
            return;
        }
        
        this.isSubmitting = true;
        this.submitForm().finally(() => {
            this.isSubmitting = false;
        });
    }
    
    open() {
        console.log('Opening modal...');
        
        // Reset to form state
        this.resetToFormState();
        this.modal.classList.add('active');
        // Issue 9: Modal Body Scroll Lock
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            const firstInput = this.form.querySelector('input[type="text"]');
            if (firstInput) {
                firstInput.focus();
                console.log('Focused first input');
            }
        }, 300);
    }
    
    close() {
        console.log('Closing modal...');
        
        this.modal.classList.remove('active');
        // Issue 9: Restore body scroll when modal closes
        document.body.style.overflow = '';
        
        // Reset form after animation completes
        setTimeout(() => {
            this.resetForm();
            this.resetToFormState();
        }, 300);
    }
    
    resetToFormState() {
        console.log('Resetting to form state...');
        
        if (this.formState) this.formState.style.display = 'block';
        if (this.successState) this.successState.style.display = 'none';
        if (this.errorMessage) this.errorMessage.style.display = 'none';
        if (this.modalTitle) this.modalTitle.textContent = 'Join the Brandloop Beta';
    }
    
    resetForm() {
        console.log('Resetting form...');
        
        if (this.form) this.form.reset();
        this.setSubmittingState(false);
        
        // Clear any validation states
        if (this.form) {
            this.form.querySelectorAll('input').forEach(input => {
                input.style.borderColor = '';
                input.title = '';
            });
        }
    }
    
    async submitForm() {
        console.log('=== SUBMIT FORM STARTED ===');
        
        try {
            // Get form data
            const formData = new FormData(this.form);
            const data = {
                fullName: formData.get('fullName'),
                companyName: formData.get('companyName'),
                workEmail: formData.get('workEmail'),
                companyWebsite: formData.get('companyWebsite')
            };
            
            console.log('Form data collected:', data);
            
            // Validate form
            const isValid = this.validateForm(data);
            console.log('Form validation result:', isValid);
            
            if (!isValid) {
                console.log('Form validation failed - stopping submission');
                return;
            }
            
            console.log('Form validation passed - proceeding with submission');
            
            // Show submitting state
            this.setSubmittingState(true);
            this.hideError();
            
            console.log('Starting REAL email sending via EmailJS...');
            
            // Send real emails via EmailJS
            await this.sendEmails(data);
            
            console.log('Real emails sent successfully - showing success');
            
            // Show success state
            this.showSuccess();
            
        } catch (error) {
            console.error('=== FORM SUBMISSION ERROR ===');
            console.error('Error object:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            this.showError();
            this.setSubmittingState(false);
        }
    }
    
    validateForm(data) {
        console.log('Validating form data:', data);
        
        let isValid = true;
        const errors = [];
        
        // Validate required fields
        Object.entries(data).forEach(([key, value]) => {
            if (!value || value.trim() === '') {
                console.log(`Field ${key} is empty`);
                errors.push(`${key} is required`);
                isValid = false;
            }
        });
        
        // Validate email format
        if (data.workEmail) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(data.workEmail)) {
                console.log('Invalid email format:', data.workEmail);
                errors.push('Invalid email format');
                isValid = false;
            }
        }
        
        // Validate URL format
        if (data.companyWebsite) {
            const urlPattern = /^https?:\/\/.+/;
            if (!urlPattern.test(data.companyWebsite)) {
                console.log('Invalid URL format:', data.companyWebsite);
                errors.push('Invalid URL format');
                isValid = false;
            }
        }
        
        console.log('Validation errors:', errors);
        console.log('Form is valid:', isValid);
        
        return isValid;
    }
    
    setSubmittingState(isSubmitting) {
        console.log('Setting submitting state:', isSubmitting);
        
        if (!this.submitBtn) return;
        
        if (isSubmitting) {
            this.submitBtn.classList.add('submitting');
            this.submitBtn.innerHTML = 'Submitting...';
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.classList.remove('submitting');
            this.submitBtn.innerHTML = 'Create Your First Week of Posts <span class="free-pill">FREE</span>';
            this.submitBtn.disabled = false;
        }
    }
    
    async sendEmails(data) {
        console.log('Sending real emails via EmailJS for:', data);
        
        try {
            // Initialize EmailJS with your actual public key
            emailjs.init("GQfrVGKMJznloBnLl");
            
            // Prepare template data with all possible variable names
            const templateData = {
                // User info - multiple naming conventions
                from_name: data.fullName,
                name: data.fullName,
                user_name: data.fullName,
                to_name: data.fullName,
                
                // Company info
                from_company: data.companyName,
                company: data.companyName,
                company_name: data.companyName,
                
                // Email info
                from_email: data.workEmail,
                email: data.workEmail,
                user_email: data.workEmail,
                to_email: data.workEmail,
                reply_to: data.workEmail,
                
                // Website info
                company_website: data.companyWebsite,
                website: data.companyWebsite,
                
                // Additional info
                date: new Date().toLocaleDateString(),
                message: `New beta signup from ${data.fullName} at ${data.companyName}`
            };
            
            // Send notification email to your team
            console.log('Sending notification to team...');
            await emailjs.send("service_xz4ehuw", "template_d4oal7h", templateData);
            
            // Send confirmation email to user
            console.log('Sending confirmation to user...');
            await emailjs.send("service_xz4ehuw", "template_uablpag", templateData);
            
            console.log('Both emails sent successfully!');
            return true;
            
        } catch (error) {
            console.error('Email sending failed:', error);
            console.error('Error details:', error.text || error.message || error);
            throw new Error('Failed to send emails. Please try again.');
        }
    }
    
    showSuccess() {
        console.log('Showing success state...');
        
        if (this.formState) this.formState.style.display = 'none';
        if (this.successState) this.successState.style.display = 'block';
        if (this.modalTitle) this.modalTitle.textContent = 'Welcome to Brandloop!';
        
        console.log('Success state displayed');
    }
    
    showError() {
        console.log('Showing error state...');
        if (this.errorMessage) this.errorMessage.style.display = 'block';
    }
    
    hideError() {
        if (this.errorMessage) this.errorMessage.style.display = 'none';
    }
}

// Initialize modal when DOM is loaded
console.log('Script loaded, waiting for DOM...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing modal...');
    
    try {
        window.betaModal = new BetaModal();
        console.log('Modal instance created and stored in window.betaModal');
    } catch (error) {
        console.error('Error creating modal instance:', error);
    }
});

// Smooth Scrolling for Navigation Links (keeping existing functionality)
document.addEventListener('DOMContentLoaded', () => {
    console.log('Setting up smooth scrolling...');
    
    document.querySelectorAll('.nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Only prevent default if the modal won't be opened
            if (!this.classList.contains('btn-primary')) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});