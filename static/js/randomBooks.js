import { baseUrl, fetchData } from "./apiFetchRequest.js";

async function getRandomBooks(amountOfBooks) {
    const url = `${baseUrl}/books?n=${amountOfBooks}`;
    try {
        const books = await fetchData(url);
        displayBookList(books);
    } catch (error) {
        console.error("Failed to fetch random books:", error.message);
    }
}

getRandomBooks(20);


// Reusable function for displaying data from ALL fetches
function displayBookList(books) {
    const bookList = document.querySelector(".book-list");
    const bookTemplate = document.querySelector("#book-template");

    // Clear existing content
    bookList.innerHTML = "";

    // Use a document fragment for better performance
    const fragment = document.createDocumentFragment();

    books.forEach(({ title, author, publishing_year, cover, book_id }) => {
        // Clone the template content
        const bookClone = bookTemplate.content.cloneNode(true);

        // Populate the cloned template with data
        const bookLink = bookClone.querySelectorAll(".bookLink");
        bookLink.forEach(link => link.setAttribute("data-id", book_id));

        // const imgElement = bookClone.querySelector("img");
        // imgElement.src = cover || "../assets/placeholderImg-9-16.png";
        // imgElement.alt = `${title} cover`;

        const titleLink = bookClone.querySelector("h4 a");
        titleLink.textContent = title;
        titleLink.setAttribute("data-id", book_id);

        const authorElement = bookClone.querySelector(".author-name");
        authorElement.textContent = author;

        const yearElement = bookClone.querySelector(".publishing-year");
        yearElement.textContent = publishing_year;

        // Append the populated template to the fragment
        fragment.appendChild(bookClone);
    });

    // Append the fragment to the book list
    bookList.appendChild(fragment);

    // Add event listeners to the dynamically generated links
    addBookLinkEventListeners();
}

// Function to add event listeners to book links
function addBookLinkEventListeners() {
    const links = document.querySelectorAll(".bookLink");

    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent the default link behavior
            const book_id = this.getAttribute("data-id"); // Get the `book_id` from the data-id attribute

            console.log("Clicked Book ID:", book_id);

            // Dynamically check login status and user role
            const isLoggedIn = checkUserLoginStatus();
            const user_id = getCurrentUserId(); // Assume this function gets the current user's ID
            console.log("Login status on click:", isLoggedIn); // Debug log
            console.log("User ID:", user_id); // Debug log

            // Determine the correct page based on user role and login status
            let page;
            if (user_id === 2679) {
                page = "book_info_admin.html";
            } else {
                page = isLoggedIn ? "book_info_logged.html" : "book_info.html";
            }
            console.log("Redirecting to:", page); // Debug log

            // Navigate to the new page with the book_id as a query parameter
            window.location.href = `${page}?book_id=${book_id}`;
        });
    });
}

// Example function to get the current user's ID
function getCurrentUserId() {
    // Mock implementation; replace with real logic to retrieve the user's ID
    return parseInt(localStorage.getItem("user_id") || "0", 10);
}

// Function to check if the user is logged in
function checkUserLoginStatus() {
    const loginStatus = localStorage.getItem("isLoggedIn");
    console.log("Login status:", loginStatus); // Debug log
    return loginStatus === "true"; // Ensure it returns 'true' when logged in
}
