document.addEventListener('DOMContentLoaded', () => {
    const correctPassword = '2428';
    const timeoutDuration = 3 * 60 * 1000;
    let logoutTimer;
    const loginCard = document.getElementById('login');
    const linksCard = document.getElementById('links');
    const errorMessage = document.getElementById('error-message');
    const loginForm = document.querySelector('#login form');
    const logoutBtn = document.getElementById('logout-btn');
    const redirectBtn = document.getElementById('redirect-btn');
    const links = document.querySelectorAll('#links a');
    const feedbackForm = document.getElementById('feedback-form'); // Added

    logout();

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const passwordInput = document.getElementById('password');
        const password = passwordInput.value.trim();

        if (password === '') {
            errorMessage.innerText = 'Please enter a password';
            return;
        }

        if (password === correctPassword) {
            localStorage.setItem('user', 'success');
            loginCard.style.display = 'none';
            linksCard.style.display = 'block';
            errorMessage.innerText = '';
            startLogoutTimer();
        } else {
            errorMessage.innerText = 'Incorrect password. Please retry.';
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault();
        logout();
    });

    redirectBtn.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = "https://ecampus.psgtech.ac.in/studzone2/AttWfLoginPage.aspx"; 
    });

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const password = prompt("Please re-enter your password to redirect to the link:");
            if (password === correctPassword) {
                window.open(link.href, '_blank');  // Open link in a new tab/window
                logout();  // Call logout after opening the link
            } else {
                logout();  // Call logout if the password is incorrect
            }
        });
    });

    if (localStorage.getItem('user') === 'success') {
        loginCard.style.display = 'none';
        linksCard.style.display = 'block';
        startLogoutTimer();
    } else {
        loginCard.style.display = 'block';
        linksCard.style.display = 'none';
    }

    function startLogoutTimer() {
        clearTimeout(logoutTimer);
        logoutTimer = setTimeout(logout, timeoutDuration);
    }

    function logout() {
        localStorage.removeItem('user');
        loginCard.style.display = 'block';
        linksCard.style.display = 'none';
        document.getElementById('password').value = '';
        errorMessage.innerText = '';

        // Clear message textarea in feedback form
        feedbackForm.reset();
    }

    $('#feedback-form').submit(function(event) {
        event.preventDefault();
        const formData = $(this).serialize();
        linksCard.style.display = 'none';
        const confirmed = confirm("Are you sure you want to submit the form?");

        if (confirmed) {
            $.ajax({
                method: 'POST',
                url: 'https://formsubmit.co/ajax/028c0178033f578a8d3a6d57b4d06376',
                dataType: 'json',
                accepts: 'application/json',
                data: formData,
                success: function(data) {
                    logout();
                    alert("Form submitted successfully!");

                },
                error: function(err) {
                    logout();
                    console.log(err);
                    alert("Exit!");
                }
            });
        }
    });
});
