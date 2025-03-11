// Function to add event listeners to book links
function addBookLinkEventListeners() {
    const links = document.querySelectorAll(".bookLink");

    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent the default link behavior
            const book_id = this.getAttribute("data-id"); // Get the `book_id` from the data-id attribute

            console.log("Clicked Book ID:", book_id);

            handleRedirect(book_id);
        });
    });
}

function getCurrentUserEmail() {
    try {
        const userEmail = localStorage.getItem("user_email") || "";
        console.log("Current User Email:", userEmail);
        return userEmail;
    } catch (error) {
        console.error("Error retrieving user email:", error);
        return "";
    }
}

function handleRedirect(book_id) {
    try {
        const userEmail = getCurrentUserEmail(); //
        const isLoggedIn = userEmail !== ""; // Check if user is logged in
        let page;

        if (userEmail === "admin.library@mail.com") { 
            page = "book_info_admin.html";
        } else {
            page = isLoggedIn ? "book_info_logged.html" : "book_info.html";
        }

        console.log("Redirecting to:", page, "with Book ID:", book_id); // Debug log

        // Navigate to the new page with the book_id as a query parameter
        window.location.href = `${page}?book_id=${book_id}`;
    } catch (error) {
        console.error("Error handling redirect:", error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const carousels = [
        { 
            trackId: 'carouselTrackPopular', 
            apiUrl: 'http://127.0.0.1:8080/books?n=10', 
            prevSelector: 'button[data-carousel="popular"].prev', 
            nextSelector: 'button[data-carousel="popular"].next' 
        },
        { 
            trackId: 'carouselTrackRecommend', 
            apiUrl: 'http://127.0.0.1:8080/books?n=10', 
            prevSelector: 'button[data-carousel="recommend"].prev', 
            nextSelector: 'button[data-carousel="recommend"].next' 
        }
    ];

    carousels.forEach(({ trackId, apiUrl, prevSelector, nextSelector }) => {
        const carouselTrack = document.getElementById(trackId);
        const prevButton = document.querySelector(prevSelector);
        const nextButton = document.querySelector(nextSelector);
        let currentIndex = 0;

        // Function to fetch books from API
        async function fetchBooks() {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error('Failed to fetch books');
                const books = await response.json();
                if (!Array.isArray(books)) throw new Error('Invalid data format');
                console.log("Books fetched successfully:", books);
                injectBooksIntoCarousel(books);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        }

        function injectBooksIntoCarousel(books) {
            try {
                books.forEach(book => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('carousel-item');
                    listItem.innerHTML = `
                        <a href="#" class="carousel-link" data-id="${book.book_id}">
                            <h4>${book.title}</h4>
                            <p>By ${book.author} (${book.publishing_year})</p>
                        </a>
                    `;
                    carouselTrack.appendChild(listItem);
                });
                console.log("Books successfully injected into the carousel.");
                
                // Attach event listeners to the newly added book links
                const bookLinks = carouselTrack.querySelectorAll('.carousel-link');
                bookLinks.forEach(link => {
                    link.addEventListener("click", function (event) {
                        event.preventDefault(); // Prevent the default link behavior
                        const book_id = this.getAttribute("data-id"); // Get the `book_id` from the data-id attribute
                        handleRedirect(book_id);
                    });
                });
            } catch (error) {
                console.error("Error injecting books into carousel:", error);
            }
        }

        // Function to move the carousel left or right
        function moveCarousel(direction) {
            try {
                const items = document.querySelectorAll(`#${trackId} .carousel-item`);
                const itemWidth = items[0].offsetWidth + 16; // Width + margin
                const maxIndex = items.length - Math.floor(carouselTrack.offsetWidth / itemWidth);
    
                currentIndex += direction;
                if (currentIndex < 0) currentIndex = 0;
                if (currentIndex > maxIndex) currentIndex = maxIndex;
    
                const newTransform = -currentIndex * itemWidth;
                carouselTrack.style.transform = `translateX(${newTransform}px)`;
                console.log("Carousel moved to index:", currentIndex);
            } catch (error) {
                console.error("Error moving carousel:", error);
            }
        }

        // Attach event listeners to buttons
        prevButton.addEventListener('click', () => moveCarousel(-1));
        nextButton.addEventListener('click', () => moveCarousel(1));

        // Fetch books and initialize the carousel
        fetchBooks();
    });
});


// document.addEventListener('DOMContentLoaded', () => {
//     const carousels = [
//         { 
//             trackId: 'carouselTrackPopular', 
//             apiUrl: 'http://127.0.0.1:8080/books?n=10', 
//             prevSelector: 'button[data-carousel="popular"].prev', 
//             nextSelector: 'button[data-carousel="popular"].next' 
//         },
//         { 
//             trackId: 'carouselTrackRecommend', 
//             apiUrl: 'http://127.0.0.1:8080/books?n=10', 
//             prevSelector: 'button[data-carousel="recommend"].prev', 
//             nextSelector: 'button[data-carousel="recommend"].next' 
//         }
//     ];

//     carousels.forEach(({ trackId, apiUrl, prevSelector, nextSelector }) => {
//         const carouselTrack = document.getElementById(trackId);
//         const prevButton = document.querySelector(prevSelector);
//         const nextButton = document.querySelector(nextSelector);
//         let currentIndex = 0;

//         // Function to fetch books from API
//         async function fetchBooks() {
//             try {
//                 const response = await fetch(apiUrl);
//                 if (!response.ok) throw new Error('Failed to fetch books');
//                 const books = await response.json();
//                 if (!Array.isArray(books)) throw new Error('Invalid data format');
//                 injectBooksIntoCarousel(books);
//             } catch (error) {
//                 console.error('Error fetching books:', error);
//             }
//         }

//         function injectBooksIntoCarousel(books) {
//             books.forEach(book => {
//                 const listItem = document.createElement('li');
//                 listItem.classList.add('carousel-item');
//                 listItem.innerHTML = `
//                     <a href="book_info.html?book_id=${book.book_id}" class="carousel-link">
//                         <h4>${book.title}</h4>
//                         <p>By ${book.author} (${book.publishing_year})</p>
//                     </a>
//                 `;
//                 carouselTrack.appendChild(listItem);
//             });
//         }

//         // Function to move the carousel left or right
//         function moveCarousel(direction) {
//             const items = document.querySelectorAll(`#${trackId} .carousel-item`);
//             const itemWidth = items[0].offsetWidth + 16; // Width + margin
//             const maxIndex = items.length - Math.floor(carouselTrack.offsetWidth / itemWidth);

//             currentIndex += direction;
//             if (currentIndex < 0) currentIndex = 0;
//             if (currentIndex > maxIndex) currentIndex = maxIndex;

//             const newTransform = -currentIndex * itemWidth;
//             carouselTrack.style.transform = `translateX(${newTransform}px)`;
//         }

//         // Attach event listeners to buttons
//         prevButton.addEventListener('click', () => moveCarousel(-1));
//         nextButton.addEventListener('click', () => moveCarousel(1));

//         // Fetch books and initialize the carousel
//         fetchBooks();
//     });
// });
