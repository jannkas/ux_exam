document.querySelector(".edit-profile-btn").addEventListener('click', function (e) {
    e.preventDefault(); // Prevent the default form submission behavior
 
    // Retrieve logged-in user ID from session storage
    const user_id = localStorage.getItem("user_id");
 
    //Check if user_id exists (user is logged in)
    if (!user_id) {
        alert("You must be logged in to edit your information.");
        return; // Stop further execution of the function
    }
 
    // Get values from the forms
    const email = document.getElementById("email").value;
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const address = document.getElementById("address").value;
    const phone_number = document.getElementById("phone_number").value;
    const birth_date = document.getElementById("birth_date").value;
 
    const formData = new FormData();
    formData.append("email", email);
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("address", address); // TODO: VIRKER IKKE
    formData.append("phone_number", phone_number);
    formData.append("birth_date", birth_date);
 
    // Put info into the database
    fetch(`http://localhost:8080/users/${user_id}`, {
        method: "PUT",
        body: formData, // Send FormData directly
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to edit information");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Information edited:", data);
            alert("Edit added successfully!");
 
            // Redirect back to user_profile.html
            window.location.href = "user_profile.html";
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Failed to edit. Please check the console for details.");
        });
});
 
document.addEventListener("DOMContentLoaded", () => {
    const user_id = localStorage.getItem("user_id");
 
    fetch(`http://localhost:8080/users/${user_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch user data.");
            }
            return response.json();
        })
        .then((data) => {
            console.log("User data retrieved:", data); // Log the fetched data
            const your_name = document.getElementById("your-name-title");
            // set you_name as data for first name
            your_name.textContent = data.first_name
            // concatenate your_date with spacing for layout purposes
            your_date.textContent = '\u00A0' + data.membership_date; // '\u00A0' is a white space which is always respected
 
 
            // Set values for the corresponding input fields
            const user = [
                { id: "email", value: data.email },
                // Todo: unnecesarry first name duplication, pick one approach and stick to it.
                { id: "first_name", value: data.first_name },
                { id: "last_name", value: data.last_name },
                { id: "address", value: data.address },
                { id: "phone_number", value: data.phone_number },
                { id: "birth_date", value: data.birth_date },
                { id: "your_date", value: data.membership_date },
            ];
            
            
            console.log(data.address)
            user.forEach(({ id, value }) => {
                const input = document.getElementById(id);
                if (input && value) {
                    input.value = value; // Set the input field's value
                    console.log(`Input value set for #${id}:`, value);
                } else {
                    console.error(`Input element for #${id} not found or value missing.`);
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
});
 
 
 
document.getElementById("dlt-profile").addEventListener("click", () => {
    const confirmation = confirm("Are you sure you want to delete your user?");
    
    if (!confirmation) {
        // If the user cancels, simply return and do nothing
        return;
    }
 
    const user_id = localStorage.getItem("user_id");
 
    // Perform a soft delete by updating a "deleted" or "is_active" field
    fetch(`http://localhost:8080/users/${user_id}`, { // Update the endpoint as needed
        method: "DELETE", // PATCH is commonly used for partial updates
        headers: {
            "Content-Type": "application/json",
        },
        // body: JSON.stringify({ is_active: false }), // Send the soft-delete payload
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to delete user.");
            }
            return response.json();
        })
        .then((data) => {
            console.log("User deleted successfully:", data); // Confirm in console
 
            // Optionally, display a message or update the UI
            const yourName = document.getElementById("your-name-title");
            if (yourName) {
                yourName.textContent = `${data.first_name} (Deleted)`; // Indicate delete in the UI
            }
 
            // Clear input fields or mark them as read-only
            const userFields = [
                "email",
                "first_name",
                "last_name",
                "address",
                "phone_number",
                "birth_date",
            ];
 
            userFields.forEach((id) => {
                const input = document.getElementById(id);
                if (input) {
                    input.value = ""; // Clear the input field
                    input.disabled = true; // Optionally disable the field
                }
            });
 
            alert("User deleted successfully!");
            localStorage.clear(); // Clear localStorage on logout
            window.location.href = "../index.html"; // Redirect to homepage
        })
        .catch((error) => {
            console.error("Error during delete:", error);
            alert("Failed to delete the user. Please try again.");
        });
});