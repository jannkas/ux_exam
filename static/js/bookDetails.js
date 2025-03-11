import { baseUrl, fetchData } from "./apiFetchRequest.js";

// Function to fetch book details
async function getBookDetails(bookId) {
    const url = `${baseUrl}/books/${bookId}`;
    console.log("Fetching book details from:", url);  // Log the URL

    try {
        const book = await fetchData(url);
        console.log("Book details fetched:", book);  // Log the fetched book details
        displayBookDetails(book);
        displayLoanHistory(book); // Pass the full book object to displayLoanHistory
    } catch (error) {
        console.error("Failed to fetch book details:", error.message);
    }
}

// Function to fetch loan history
async function getLoanHistory(bookId) {
    const url = `${baseUrl}/admin/books/${bookId}`;
    console.log("Fetching loan history from:", url);  // Log the URL

    try {
        const loanHistory = await fetchData(url);
        console.log("Loan history fetched:", loanHistory);  // Log the fetched loan history
        displayLoanHistory(loanHistory);
    } catch (error) {
        console.error("Failed to fetch loan history:", error.message);
    }
}

// Function to extract book_id from the URL
function getBookIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('book_id');
}

// Function to display book details in the DOM
function displayBookDetails(book) {
    const { title, author, publishing_year, cover, publishing_company } = book;

    const bookCoverImg = document.querySelector(".book-cover-img");
    const bookTitle = document.querySelector(".book-title");
    const bookAuthor = document.querySelector(".book-author");
    const publishingCompany = document.querySelector(".publishing-company");
    bookCoverImg.src = cover || 'static/img/placeholder_cover.png';
    bookCoverImg.alt = `${title} cover`;
    bookTitle.textContent = title;
    bookAuthor.textContent = `by ${author} (${publishing_year})`;
    publishingCompany.textContent = publishing_company || "N/A";
}

// Function to display loan history in the Admin DOM
async function displayLoanHistory(book) {
    const loanHistoryTableBody = document.querySelector(".loan-history tbody");

    // Clear any existing rows
    loanHistoryTableBody.innerHTML = "";

    // Extract loans from the book object
    const loans = book.loans;

    if (!Array.isArray(loans) || loans.length === 0) {
        console.warn("No loans found in the book data.");
        loanHistoryTableBody.innerHTML = "<tr><td colspan='3'>No loan history available.</td></tr>";
        return;
    }

    // Populate table with loan history data
    for (const loan of loans) {
        const { user_id, loan_date, return_date } = loan;

        try {
            // Fetch user details using user_id
            const user = await fetchUserById(user_id);
            const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unknown";

            const row = document.createElement("tr");
            row.classList.add("loaned-book");

            row.innerHTML = `
                <td class="user-name">${fullName}</td>
                <td class="loan-date">${loan_date || "N/A"}</td>
            `;

            loanHistoryTableBody.appendChild(row);
        } catch (error) {
            console.error(`Failed to fetch user details for user_id ${user_id}:`, error.message);

            // Fallback if user details can't be fetched
            const row = document.createElement("tr");
            row.classList.add("loaned-book");

            row.innerHTML = `
                <td class="user-name">Unknown User</td>
                <td class="loan-date">${loan_date || "N/A"}</td>
            `;

            loanHistoryTableBody.appendChild(row);
        }
    }
}

// Fetch users so you can display their first_name & last_name

async function fetchUserById(userId) {
    const url = `${baseUrl}/users/${userId}`; // Adjust the endpoint if necessary
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch user with ID ${userId}`);
    }

    return response.json(); 
}



// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
    const bookId = getBookIdFromUrl();
    if (bookId) {
        getBookDetails(bookId);
        getLoanHistory(bookId);
    } else {
        console.error("No book_id found in URL.");
    }
});