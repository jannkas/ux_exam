export const baseUrl = "http://localhost:8080";

// General reusable fetchData function
export async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        const responseText = await response.text(); // Read response as text for debugging
        console.log("Raw response text:", responseText);

        if (!response.ok) {
            const errorDetails = responseText || `HTTP error! Status: ${response.status}`;
            throw new Error(errorDetails);
        }

        // Parse response only if JSON is expected
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

