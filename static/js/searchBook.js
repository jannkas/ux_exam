document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const popup = document.getElementById('searchPopup');
    const popupResults = document.getElementById('popupResults');
    const closeBtn = document.querySelector('.close-btn');

    // Funktion til at vise popup'en
    function showPopup() {
        popup.style.display = 'flex';
    }

    // Funktion til at skjule popup'en
    function hidePopup() {
        popup.style.display = 'none';
    }

    // Funktion til at vise resultater i popup med links
    function displayResults(data) {
        popupResults.innerHTML = ''; // Tøm tidligere resultater

        if (data.length === 0) {
            popupResults.innerHTML = '<p>No results found</p>';
            return;
        }

        data.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');

            resultItem.innerHTML = `
                <a href="book_info.html?book_id=${item.book_id}" class="result-link">
                    <h3>${item.title}</h3>
                    <p>Author: ${item.author}</p>
                    <p>Year: ${item.publishing_year}</p>

                </a>
            `;
            popupResults.appendChild(resultItem);
        });

        showPopup(); // Vis popup'en
    }

    // Event listener for søgning
    searchInput.addEventListener('input', async (event) => {
        const query = event.target.value.trim();
        if (query.length > 2) {
            try {
                const response = await fetch(`http://127.0.0.1:8080/books?s=${query}`);
                if (!response.ok) throw new Error('Failed to fetch books');
                const data = await response.json();
                displayResults(data);
            } catch (error) {
                console.error('Error fetching search results:', error);
                popupResults.innerHTML = '<p>Error fetching results. Please try again later.</p>';
                showPopup();
            }
        } else {
            hidePopup(); // Skjul popup, hvis søgeinput er for kort
        }
    });

    // Luk popup'en, når luk-knappen trykkes
    closeBtn.addEventListener('click', hidePopup);

    // Luk popup'en, hvis der trykkes uden for indholdet
    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            hidePopup();
        }
    });
});