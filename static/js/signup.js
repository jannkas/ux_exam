import { baseUrl } from "./apiFetchRequest.js";

document.addEventListener("DOMContentLoaded", () => {
    // Set the maximum date for the date picker to today
    const dateInput = document.getElementById("date_of_birth");
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    dateInput.setAttribute("max", today);

    const signupForm = document.getElementById("signup_frm");

    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Create a FormData object and append all form fields
        const formData = new FormData();
        formData.append("email", document.getElementById("email").value.trim());
        formData.append("password", document.getElementById("password").value.trim());
        formData.append("first_name", document.getElementById("first_name").value.trim());
        formData.append("last_name", document.getElementById("last_name").value.trim());
        formData.append("address", document.getElementById("address").value.trim());
        formData.append("phone_number", document.getElementById("phone_number").value.trim());
        formData.append("birth_date", dateInput.value.trim()); // Use date input directly

        // Log the formData entries for debugging
        console.log("FormData being sent:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Check for empty fields
        const hasEmptyFields = Array.from(formData.values()).some((value) => !value);
        if (hasEmptyFields) {
            alert("Please fill in all the fields.");
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/users`, {
                method: "POST",
                body: formData, // Send FormData directly
            });

            const data = await response.json();
            console.log("User creation response:", data);

            if (response.ok) {
                alert("User created successfully!");
                window.location.href = "login.html";
            } else {
                alert(data.error || "Failed to create user.");
            }
        } catch (error) {
            console.error("Error creating user:", error);
        }
    });
});