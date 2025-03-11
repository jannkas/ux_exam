import { baseUrl } from "./apiFetchRequest.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login_frm");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        const formData = new FormData(); // formData instead of application/json since the content-type the server expects is multipart/form-data
        formData.append("email", email);
        formData.append("password", password);

        try {
            const response = await fetch(`${baseUrl}/users/login`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                const userId = data.user_id;

                // Save the user ID and login status to localStorage
                localStorage.setItem("user_id", userId); // Store the user ID in localStorage
                localStorage.setItem("isLoggedIn", "true"); // Store the login status as 'true'

                // Redirect based on user ID
                if (userId === 2679) {
                    // Redirect to admin page if the user is an admin
                    alert("Welcome, Admin!");
                    window.location.href = "admin.html";
                } else {
                    // Redirect to user page for other users
                    alert(`Welcome, ${email}`);
                    window.location.href = "user.html"; // Replace with the actual user page
                }
            } else {
                alert(data.error || "Login failed.");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});
