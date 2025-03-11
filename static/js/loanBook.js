import { baseUrl, fetchData } from "./apiFetchRequest.js";

document.addEventListener("DOMContentLoaded", function () {
    const loanButton = document.querySelector(".loan-book-btn");
    const bookId = getBookIdFromUrl();

    // Get book ID from URL
    function getBookIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        console.log("book id from URL:", urlParams);
        return urlParams.get("book_id");
    }

    if (loanButton && bookId) {
        loanButton.addEventListener("click", async function () {
            console.log("Loan button clicked");

            try {
                const loanedBooks = JSON.parse(localStorage.getItem("loanedBooks")) || [];
                console.log("Books you have loaned:", loanedBooks);  // Log current loanedBooks array

                // Ensure we are comparing the same types for ID (String)
                const alreadyLoaned = loanedBooks.some(book => String(book.id) === String(bookId));  // Compare 'id' directly
                console.log("Already loaned check:", alreadyLoaned);  // Log the check result

                if (alreadyLoaned) {
                    alert("You have already loaned this book.");
                    return;
                }

                // Fetch the book details
                const bookDetails = await fetchBookDetails(bookId);
                console.log("Fetched book details:", bookDetails);

                // Ensure the book details contain an id
                if (!bookDetails || !bookDetails.title) {
                    console.error("Book details are missing required fields", bookDetails);
                    alert("Error: Book details could not be retrieved.");
                    return;
                }

                const loanDate = new Date();
                const dueDate = new Date(loanDate);
                dueDate.setDate(loanDate.getDate() + 30);

                // Use the bookId from the URL as the unique identifier
                loanedBooks.push({
                    id: bookId,  // Use the bookId from URL directly since the id isn't passed with the objects
                    title: bookDetails.title,
                    author: bookDetails.author,
                    loanDate: loanDate.toISOString(), // Date as ISO string
                    dueDate: dueDate.toISOString(),
                });

                // Save back to localStorage
                localStorage.setItem("loanedBooks", JSON.stringify(loanedBooks));
                alert(`You have successfully loaned "${bookDetails.title}". A link has been sent to your email with the link for the book`);

            } catch (error) {
                console.error("Failed to loan the book:", error.message);
            }
        });
    } else {
        console.error("Loan button or book ID is missing.");
    }

    // Fetch book details from API
    async function fetchBookDetails(bookId) {
        const url = `${baseUrl}/books/${bookId}`;
        const bookDetails = await fetchData(url);
        console.log("Fetched book details:", bookDetails);  // Log the fetched book object
        return bookDetails;
    }
});
