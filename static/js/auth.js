// AppSync Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Login form validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            let isValid = true;
            
            // Clear previous error messages
            clearValidationErrors();
            
            // Validate username
            if (!usernameInput.value.trim()) {
                displayError(usernameInput, 'Username is required');
                isValid = false;
            }
            
            // Validate password
            if (!passwordInput.value.trim()) {
                displayError(passwordInput, 'Password is required');
                isValid = false;
            }
            
            if (!isValid) {
                event.preventDefault();
            }
        });
    }
    
    // Registration form validation
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            const usernameInput = document.getElementById('username');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirm_password');
            let isValid = true;
            
            // Clear previous error messages
            clearValidationErrors();
            
            // Validate username
            if (!usernameInput.value.trim()) {
                displayError(usernameInput, 'Username is required');
                isValid = false;
            } else if (usernameInput.value.length < 2 || usernameInput.value.length > 20) {
                displayError(usernameInput, 'Username must be between 2 and 20 characters');
                isValid = false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                displayError(emailInput, 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value)) {
                displayError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate password
            if (!passwordInput.value.trim()) {
                displayError(passwordInput, 'Password is required');
                isValid = false;
            } else if (passwordInput.value.length < 6) {
                displayError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            }
            
            // Validate confirm password
            if (passwordInput.value !== confirmPasswordInput.value) {
                displayError(confirmPasswordInput, 'Passwords do not match');
                isValid = false;
            }
            
            if (!isValid) {
                event.preventDefault();
            }
        });
    }
    
    // Settings form validation
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(event) {
            const emailInput = document.getElementById('email');
            const currentPasswordInput = document.getElementById('current_password');
            const newPasswordInput = document.getElementById('new_password');
            const confirmNewPasswordInput = document.getElementById('confirm_new_password');
            let isValid = true;
            
            // Clear previous error messages
            clearValidationErrors();
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                displayError(emailInput, 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value)) {
                displayError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate password change (if attempted)
            if (newPasswordInput.value.trim() || confirmNewPasswordInput.value.trim()) {
                if (!currentPasswordInput.value.trim()) {
                    displayError(currentPasswordInput, 'Current password is required to set a new password');
                    isValid = false;
                }
                
                if (newPasswordInput.value.length < 6) {
                    displayError(newPasswordInput, 'New password must be at least 6 characters');
                    isValid = false;
                }
                
                if (newPasswordInput.value !== confirmNewPasswordInput.value) {
                    displayError(confirmNewPasswordInput, 'New passwords do not match');
                    isValid = false;
                }
            }
            
            if (!isValid) {
                event.preventDefault();
            }
        });
    }
    
    // Helper function to display validation errors
    function displayError(input, message) {
        const formGroup = input.closest('.mb-3');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback d-block';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
        input.classList.add('is-invalid');
    }
    
    // Helper function to clear validation errors
    function clearValidationErrors() {
        document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    }
    
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
                this.setAttribute('title', 'Hide password');
            } else {
                passwordInput.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
                this.setAttribute('title', 'Show password');
            }
        });
    });
});
