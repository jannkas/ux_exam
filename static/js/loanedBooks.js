document.addEventListener("DOMContentLoaded", function () {
    const loanedBooks = JSON.parse(localStorage.getItem("loanedBooks")) || [];
    const tableBody = document.querySelector(".loaned-books tbody");

    if (tableBody && loanedBooks.length > 0) {
        loanedBooks.forEach((book, index) => {
            const daysLeft = calculateDaysLeft(book.dueDate);

            // Create a new row for the book
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="book-title">${book.title}</td>
                <td class="book-author">${book.author}</td>
                <td class="days-left">${daysLeft} days</td>
                <td class="remove">
                    <button class="remove-book-btn" data-index="${index}">Remove</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Add event listeners to all "Remove" buttons
        const removeButtons = document.querySelectorAll(".remove-book-btn");
        removeButtons.forEach(button => {
            button.addEventListener("click", function () {
                const bookIndex = parseInt(this.getAttribute("data-index"), 10);
                removeLoanedBook(bookIndex);
            });
        });
    } else {
        console.log("No loaned books to display.");
    }
});

// Function to calculate days left
function calculateDaysLeft(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - now; // Milliseconds between now and dueDate
    return Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24))); // Convert to days
}

// Function to remove a loaned book
function removeLoanedBook(index) {
    const loanedBooks = JSON.parse(localStorage.getItem("loanedBooks")) || [];
    loanedBooks.splice(index, 1); // Remove the book at the specified index

    // Update localStorage
    localStorage.setItem("loanedBooks", JSON.stringify(loanedBooks));

    // Refresh the table
    refreshLoanedBooksTable();
}

// Function to refresh the loaned books table
function refreshLoanedBooksTable() {
    const tableBody = document.querySelector(".loaned-books tbody");
    tableBody.innerHTML = ""; // Clear existing rows
    document.dispatchEvent(new Event("DOMContentLoaded")); // Reload loaned books
}
