// Example JavaScript for login form validation
document.querySelector('.login-form').addEventListener('submit', function(event) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === '' || password === '') {
        alert('Please fill in both fields');
        event.preventDefault(); // Prevent form submission
    }
});

// Example JavaScript for showing a success alert after login
if (window.location.pathname === '/service') {
    alert('Logged in successfully!');
}

// Enable/Disable the upload button based on login status (Mocked here)
const uploadButton = document.getElementById('uploadButton');
const isLoggedIn = true; // This should be dynamically checked on the server side

if (!isLoggedIn) {
    uploadButton.disabled = true;
} else {
    uploadButton.disabled = false;
}

// Example for handling logout button and showing alert
document.getElementById('logoutButton')?.addEventListener('click', function() {
    alert('You have logged out successfully!');
    window.location.href = '/'; // Redirect to the home page after logout
});
