document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "http://127.0.0.1:8080/admin";

    const addAuthorBtn = document.getElementById("addAuthorBtn");
    const addPublisherBtn = document.getElementById("addPublisherBtn");
    const addBookBtn = document.getElementById("addBookBtn");

    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popupTitle");
    const popupForm = document.getElementById("popupForm");
    const closePopup = document.getElementById("closePopup");

    // Attach click event listeners to the add buttons
    addAuthorBtn.addEventListener("click", () => openPopup("Add Author", "author"));
    addPublisherBtn.addEventListener("click", () => openPopup("Add Publisher", "publisher"));
    addBookBtn.addEventListener("click", () => openPopup("Add Book", "book"));

    closePopup.addEventListener("click", () => {
        popup.classList.add("hidden");
        popupForm.innerHTML = '';
    });

    /**
     * Opens the popup form with the appropriate form fields
     * @param {string} title - The title of the popup
     * @param {string} formType - The type of form ('author', 'publisher', 'book')
     */
    function openPopup(title, formType) {
        popupTitle.textContent = title;
        popup.classList.remove("hidden");

        const formTemplates = {
            author: `
                <input type="text" name="first_name" placeholder="First Name" required>
                <input type="text" name="last_name" placeholder="Last Name" required>
                <button type="submit" class="submit-button">Add Author</button>
            `,
            publisher: `
                <input type="text" name="name" placeholder="Publisher Name" required>
                <button type="submit" class="submit-button">Add Publisher</button>
            `,
            book: `
                <input type="text" name="title" placeholder="Book Title" required>
                <input type="text" name="author_name" placeholder="Author Name" required>
                <input type="text" name="publisher_name" placeholder="Publisher Name" required>
                <input type="number" name="publishing_year" placeholder="Publishing Year" required>
                <button type="submit" class="submit-button">Add Book</button>
            `
        };

        popupForm.innerHTML = formTemplates[formType];

        // Attach form submission handler for the dynamically added form
        popupForm.onsubmit = async (event) => {
            event.preventDefault();
            if (formType === 'book') {
                await handleBookFormSubmit(popupForm);
            } else {
                await handleFormSubmit(popupForm, `/${formType}s`, formType);
            }
        };
    }

    /**
     * Handles form submission for adding authors and publishers
     * @param {HTMLFormElement} form - The form element
     * @param {string} endpoint - The API endpoint to send the form data
     * @param {string} formType - The type of form ('author', 'publisher')
     */
    async function handleFormSubmit(form, endpoint, formType) {
        const formData = new FormData(form);
        const messageElement = document.createElement("p");

        try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                messageElement.textContent = "Successfully Added!";
                messageElement.style.color = "green";

                // Reset the form
                form.reset();
                popup.classList.add("hidden");

                // Add the item to the Recently Added list
                const formValues = Object.fromEntries(formData.entries());
                if (formType === 'author') {
                    const authorName = `${formValues.first_name} ${formValues.last_name}`;
                    addToRecentlyAddedList('authorList', authorName);
                } else if (formType === 'publisher') {
                    addToRecentlyAddedList('publisherList', formValues.name);
                }
            } else {
                const errorData = await response.json();
                messageElement.textContent = `Error: ${errorData.error || 'Something went wrong'}`;
                messageElement.style.color = "red";
            }
        } catch (error) {
            messageElement.textContent = "Failed to submit. Please try again later.";
            messageElement.style.color = "red";
        }

        form.appendChild(messageElement);
    }

    /**
     * Handles form submission for adding a book
     * @param {HTMLFormElement} form - The form element
     */
    async function handleBookFormSubmit(form) {
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());

        const { title, author_name, publisher_name, publishing_year } = formValues;

        try {
            // Step 1: Check if the author exists
            let authorId = await getAuthorIdByName(author_name);
            if (!authorId) {
                // If the author doesn't exist, add them
                authorId = await addAuthor(author_name);
            }

            // Step 2: Check if the publisher exists
            let publisherId = await getPublisherIdByName(publisher_name);
            if (!publisherId) {
                // If the publisher doesn't exist, add them
                publisherId = await addPublisher(publisher_name);
            }

            // Step 3: Add the book using the author and publisher IDs
            const response = await fetch(`${baseUrl}/books`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    title,
                    author_id: authorId,
                    publisher_id: publisherId,
                    publishing_year
                }).toString()
            });

            if (response.ok) {
                const messageElement = document.createElement("p");
                messageElement.textContent = "Successfully Added!";
                messageElement.style.color = "green";
                form.appendChild(messageElement);

                // Reset the form
                form.reset();
                popup.classList.add("hidden");

                // Add the book to the Recently Added list
                addToRecentlyAddedList('bookList', title);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong');
            }
        } catch (error) {
            const messageElement = document.createElement("p");
            messageElement.textContent = `Error: ${error.message}`;
            messageElement.style.color = "red";
            form.appendChild(messageElement);
        }
    }

    /**
     * Gets the author ID by name
     * @param {string} authorName - The full name of the author
     * @returns {number|null} - The author ID or null if not found
     */
    async function getAuthorIdByName(authorName) {
        const [firstName, lastName] = authorName.split(' ');
        const response = await fetch(`${baseUrl}/authors?first_name=${firstName}&last_name=${lastName}`);
        if (response.ok) {
            const data = await response.json();
            return data.author_id || null;
        }
        return null;
    }

    /**
     * Adds a new author and returns their ID
     * @param {string} authorName - The full name of the author
     * @returns {number} - The new author ID
     */
    async function addAuthor(authorName) {
        const [firstName, lastName] = authorName.split(' ');
        const response = await fetch(`${baseUrl}/authors`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ first_name: firstName, last_name: lastName }).toString()
        });
        const data = await response.json();
        return data.author_id;
    }

    /**
     * Gets the publisher ID by name
     * @param {string} publisherName - The name of the publisher
     * @returns {number|null} - The publisher ID or null if not found
     */
    async function getPublisherIdByName(publisherName) {
        const response = await fetch(`${baseUrl}/publishers?name=${publisherName}`);
        if (response.ok) {
            const data = await response.json();
            return data.publisher_id || null;
        }
        return null;
    }

    /**
     * Adds a new publisher and returns their ID
     * @param {string} publisherName - The name of the publisher
     * @returns {number} - The new publisher ID
     */
    async function addPublisher(publisherName) {
        const response = await fetch(`${baseUrl}/publishers`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ name: publisherName }).toString()
        });
        const data = await response.json();
        return data.publisher_id;
    }

    /**
     * Adds a new item to the Recently Added section
     * @param {string} listId - The ID of the list where the item will be added ('authorList', 'publisherList', 'bookList')
     * @param {string} itemName - The name of the item to add (Author name, Publisher name, Book title)
     */
    function addToRecentlyAddedList(listId, itemName) {
        const list = document.getElementById(listId);
        const listItem = document.createElement("p");
        listItem.textContent = itemName;
        list.appendChild(listItem);
    }
});