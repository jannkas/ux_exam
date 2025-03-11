'use strict';

document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    const userId = localStorage.getItem("user_id"); // localStorage instead of sessionStorage because you want to able to refresh the page and the user not be logged out. 

    if (!userId) {
        // Redirect to login page if user is not authenticated
        window.location.href = "login.html";
        return; // Prevent further execution
    } else {
        console.log(`User is logged in with ID: ${userId}`);
        // You can use `userId` here to personalize the admin page
    }

    // Add click event for logout link
    const logoutLink = document.querySelector(".logout");
    if (logoutLink) {
        logoutLink.addEventListener("click", (event) => {
            event.preventDefault();
            // Clear user data and redirect to login
            localStorage.removeItem("user_id");
            localStorage.setItem("isLoggedIn", "false");

            window.location.href = "login.html";

            // Prevent back navigation to this page
            setTimeout(() => {
                window.history.replaceState(null, null, "login.html");
            }, 0);
        });
    }
});
