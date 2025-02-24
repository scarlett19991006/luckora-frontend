document.addEventListener("DOMContentLoaded", function () {
    const zodiacForm = document.getElementById("zodiac-form");
    const birthYearInput = document.getElementById("birth-year");
    const resultDiv = document.getElementById("result");

    if (!zodiacForm) {
        console.error("❌ ERROR: Form element not found! Check your HTML.");
        return;
    }

    zodiacForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const birthYear = birthYearInput.value.trim();

        if (!birthYear) {
            alert("Please enter a valid birth year!");
            return;
        }

        console.log("📤 Sending birthYear:", birthYear);

        try {
            const response = await fetch("https://luckora-backend.onrender.com/zodiac", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ birthYear }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("API Response:", data);
                formatAndDisplayResult(data.response);
            } else {
                console.error("❌ API Error:", data);
                resultDiv.innerHTML = `<p class="error">API request failed. Please try again.</p>`;
            }
        } catch (error) {
            console.error("❌ Fetch Error:", error);
            resultDiv.innerHTML = `<p class="error">API request failed. Please check your connection.</p>`;
        }
    });

    // Function to format and clean up the API response
    function formatAndDisplayResult(response) {
        let formattedResponse = response.replace(/\*\*/g, ""); // Remove Markdown formatting
        let sections = formattedResponse.split("- ").map(item => item.trim());

        // Removing redundant phrases (like "Lucky Color of the Year:" appearing twice)
        sections = sections.map(section => section.replace(/^.*?:/, "").trim());

        let outputHTML = `
            <div class="result-box">
                <p><strong>Chinese Zodiac:</strong> ${sections[1] || "N/A"}</p>
                <p><strong>Lucky Color:</strong> ${sections[2] || "N/A"}</p>
                <p><strong>Personality Traits:</strong> ${sections[3] || "N/A"}</p>
                <p><strong>Special Fortune:</strong> ${sections[4] || "N/A"}</p>
            </div>
        `;

        resultDiv.innerHTML = outputHTML;
    }
});
