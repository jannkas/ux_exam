import { baseUrl, fetchData } from "./apiFetchRequest.js";

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const authorResults = document.getElementById("authorResults");

    // Event listener for searching authors
    searchInput.addEventListener("input", debounce(async (event) => {
        const query = event.target.value.trim();
        if (!query) {
            authorResults.innerHTML = ""; // Clear results
            return;
        }

        try {
            // Fetch authors
            const authors = await fetchData(`${baseUrl}/authors`);
            const matchedAuthors = authors.filter(author =>
                author.author_name.toLowerCase().includes(query.toLowerCase())
            );

            // Display authors
            displayAuthors(matchedAuthors);
        } catch (error) {
            console.error("Error fetching authors:", error);
            authorResults.innerHTML = `<p class="error">Failed to fetch authors.</p>`;
        }
    }, 300)); // Debounce to limit API calls
});

// Function to display authors
function displayAuthors(authors) {
    const authorResults = document.getElementById("authorResults");
    authorResults.innerHTML = ""; // Clear previous results

    if (authors.length === 0) {
        authorResults.innerHTML = "<p>No authors found.</p>";
        return;
    }

    authors.forEach(author => {
        const authorCard = document.createElement("div");
        authorCard.classList.add("author-card");

        const authorImage = document.createElement("img");
        authorImage.src = "../assets/placeholderImg-circle.png";
        authorImage.alt = `${author.author_name} profile picture`;

        const authorName = document.createElement("p");
        authorName.textContent = author.author_name;

        // Event listener to fetch books by this author
        authorCard.addEventListener("click", () => {
            fetchBooksByAuthor(author.author_id); // Call to fetch and display books
        });

        authorCard.appendChild(authorImage);
        authorCard.appendChild(authorName);
        authorResults.appendChild(authorCard);
    });
}

// Function to fetch and display books by the clicked author
async function fetchBooksByAuthor(authorId) {
    const authorResults = document.getElementById("authorResults");

    // Clear previous results and books section
    authorResults.innerHTML = "";

    try {
        // Fetch books for the selected author
        const books = await fetchData(`${baseUrl}/books?a=${authorId}`);

        // Create a section for displaying books
        const booksSection = document.createElement("section");
        booksSection.classList.add("inline-results");
        booksSection.innerHTML = "<h3>Books by this Author:</h3>"; // Title for books list

        books.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("author-card");

            // Create a clickable link for the book title
            const bookLink = document.createElement("a");
            bookLink.href = `book_info.html?book_id=${book.book_id}`; // Book info URL with ID as query parameter
            bookLink.textContent = `${book.title} (${book.publishing_year})`; // Display book title and year

            bookCard.appendChild(bookLink);
            booksSection.appendChild(bookCard);
        });

        authorResults.appendChild(booksSection);
    } catch (error) {
        console.error("Error fetching books for this author:", error);
        authorResults.innerHTML = "<p>Failed to fetch books for this author.</p>";
    }
}

// Debounce function to limit API calls
function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
