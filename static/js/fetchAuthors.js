import { baseUrl, fetchData } from "./apiFetchRequest.js";

document.addEventListener("DOMContentLoaded", async () => {
    const authorResults = document.getElementById("authorResults");

    try {
        // Fetch all authors from the API
        const authors = await fetchData(`${baseUrl}/authors`);
        displayAuthors(authors);
    } catch (error) {
        console.error("Error fetching authors:", error);
        authorResults.innerHTML = "<p>Failed to load authors. Please try again later.</p>";
    }
});

// Function to display authors on the page
function displayAuthors(authors) {
    const authorResults = document.getElementById("authorResults");
    authorResults.innerHTML = ""; // Clear existing content

    authors.forEach(author => {
        // Create a card for each author
        const authorCard = document.createElement("div");
        authorCard.classList.add("author-card");
        authorCard.textContent = author.author_name;

        // Add event listener to the author card to fetch books by this author
        authorCard.addEventListener("click", () => fetchBooksByAuthor(author.author_id));

        // Append the card to the results section
        authorResults.appendChild(authorCard);
    });
}

// Function to fetch books by author ID
async function fetchBooksByAuthor(authorId) {
    const authorResults = document.getElementById("authorResults");
    try {
        const books = await fetchData(`${baseUrl}/books?a=${authorId}`);
        authorResults.innerHTML = "<h3>Books by this Author:</h3>"; // Update header

        // Display books in the author section
        books.forEach( book => {
            const bookElement = document.createElement("a");
            bookElement.href = `book_info.html?book_id=${book.book_id}`; // Book info URL with ID as query parameter
            bookElement.textContent = `${book.title} (${book.publishing_year})`; // Display book title and year

            authorResults.appendChild(bookElement);
        });
    } catch (error) {
        console.error("Error fetching books by author:", error);
        authorResults.innerHTML = "<p>Failed to fetch books for this author.</p>";
    }
}












// import { baseUrl, fetchData } from "./apiFetchRequest.js";

// document.addEventListener("DOMContentLoaded", async () => {
//     const authorResults = document.getElementById("authorResults");

//     try {
//         // Fetch all authors from the API
//         const authors = await fetchData(`${baseUrl}/authors`);
//         displayAuthors(authors);
//     } catch (error) {
//         console.error("Error fetching authors:", error);
//         authorResults.innerHTML = "<p>Failed to load authors. Please try again later.</p>";
//     }
// });

// // Function to display authors on the page
// function displayAuthors(authors) {
//     const authorResults = document.getElementById("authorResults");
//     authorResults.innerHTML = ""; // Clear existing content

//     authors.forEach(author => {
//         // Create a card for each author
//         const authorCard = document.createElement("div");
//         authorCard.classList.add("author-card");
//         authorCard.textContent = author.author_name;

//         // Append the card to the results section
//         authorResults.appendChild(authorCard);
//     });
// }

