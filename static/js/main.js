// Main JavaScript for AppSync

document.addEventListener('DOMContentLoaded', function() {
    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert:not(.alert-info)');
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    });

    // Password confirmation validator for registration form
    const registrationForm = document.querySelector('form[action="/register"]');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            
            if (password !== confirmPassword) {
                event.preventDefault();
                const errorMessage = document.createElement('div');
                errorMessage.className = 'alert alert-danger alert-dismissible fade show mt-3';
                errorMessage.innerHTML = 'Passwords do not match! <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                
                // Remove any existing error messages
                const existingErrors = document.querySelectorAll('.alert-danger');
                existingErrors.forEach(error => error.remove());
                
                // Add the new error message
                registrationForm.prepend(errorMessage);
                
                // Scroll to the top of the form
                registrationForm.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // IDOR vulnerability demonstration
    const demonstrateIdorBtn = document.getElementById('demonstrate-idor');
    if (demonstrateIdorBtn) {
        demonstrateIdorBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/users');
                const users = await response.json();
                
                if (users.length > 0) {
                    // Find a different user than the current one
                    const otherUsers = users.filter(user => user.id !== parseInt(currentUserId));
                    
                    if (otherUsers.length > 0) {
                        const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
                        window.location.href = `/notes/${randomUser.id}`;
                    } else {
                        alert('No other users found. Create another account to test IDOR vulnerabilities.');
                    }
                } else {
                    alert('No users found. Please try again later.');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                alert('Error demonstrating IDOR vulnerability. See console for details.');
            }
        });
    }
});

// Function to test IDOR vulnerability from console
function testIdor(noteId) {
    fetch(`/api/note/${noteId}`)
        .then(response => response.json())
        .then(data => {
            console.log('IDOR Test Result:', data);
            console.log('If you can see the note details and this note is not yours, the IDOR vulnerability exists.');
        })
        .catch(error => {
            console.error('Error testing IDOR:', error);
        });
}

// Expose testIdor function to the global scope
window.testIdor = testIdor;
