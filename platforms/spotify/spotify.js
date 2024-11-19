document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("actionForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const query = document.getElementById("userQuery").value.trim();
        const actionType = document.getElementById("actionType").value;
        const loadingBar = document.getElementById("loadingBar");
        const loadingMessage = document.getElementById("loadingMessage");
        const resultsSection = document.getElementById("results");
        const resultsContainer = resultsSection.querySelector(".container > .grid");

        // Show loading indicator
        loadingBar.classList.remove("hidden");
        loadingMessage.textContent = "Loading...";

        // Construct the API URL based on the action type
        let apiUrl = "";
        switch (actionType) {
            case "search":
                apiUrl = `https://spotifyapi.caliphdev.com/api/search/tracks?q=${encodeURIComponent(query)}`;
                break;
            case "trackInfo":
                apiUrl = `https://spotifyapi.caliphdev.com/api/info/track?url=${encodeURIComponent(query)}`;
                break;
            case "playlistInfo":
                apiUrl = `https://spotifyapi.caliphdev.com/api/info/playlist?url=${encodeURIComponent(query)}`;
                break;
            case "downloadTrack":
                apiUrl = `https://spotifyapi.caliphdev.com/api/download/track?url=${encodeURIComponent(query)}`;
                break;
            default:
                alert("Invalid action type selected.");
                loadingBar.classList.add("hidden");
                return;
        }

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (actionType === "downloadTrack") {
                // Handle audio file response by opening a new tab
                window.open(apiUrl, "_blank");
            } else {
                // Handle JSON response for search, trackInfo, and playlistInfo
                const data = await response.json();
                resultsContainer.innerHTML = ""; // Clear previous results

                if (actionType === "search" || actionType === "playlistInfo") {
                    (data || []).forEach(track => {
                        const trackCard = document.createElement("div");
                        trackCard.classList.add("bg-gray-800", "border", "border-gray-700", "rounded-lg", "p-6", "shadow-lg", "hover:scale-105", "transition-transform");

                        trackCard.innerHTML = `
                            <img src="${track.thumbnail}" alt="${track.title}" class="w-full h-48 object-cover rounded-lg">
                            <h3 class="mt-4 text-xl font-bold text-gray-100">${track.title}</h3>
                            <p class="text-gray-400">${track.artist}</p>
                            <p class="text-gray-500 text-sm">${track.album} - ${track.duration}</p>
                            <audio controls class="mt-4 w-full">
                                <source src="${track.preview_mp3 || '#'}" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                            <a href="${track.url}" target="_blank" class="mt-4 block text-center px-4 py-2 bg-black text-white rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                                <i class="fab fa-spotify text-white"></i> Open in Spotify
                            </a>
                            <!-- Download Music Button -->
                            <button onclick="downloadMusic('${track.url}')" class="mt-2 block text-center px-4 py-2 w-full bg-green-700 text-white rounded-lg flex items-center justify-center hover:bg-green-600 gap-2 transition-all">
                                Download Music
                            </button>
                        `;
                        resultsContainer.appendChild(trackCard);
                    });
                } else if (actionType === "trackInfo") {
                    const trackCard = document.createElement("div");
                    trackCard.classList.add("bg-gray-800", "border", "border-gray-700", "rounded-lg", "p-6", "shadow-lg", "hover:scale-105", "transition-transform");

                    trackCard.innerHTML = `
                        <img src="${data.thumbnail}" alt="${data.title}" class="w-full h-48 object-cover rounded-lg">
                        <h3 class="mt-4 text-xl font-bold text-gray-100">${data.title}</h3>
                        <p class="text-gray-400">${data.artist}</p>
                        <p class="text-gray-500 text-sm">${data.album} - ${data.duration}</p>
                        <audio controls class="mt-4 w-full">
                            <source src="${data.preview_mp3 || '#'}" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                            <a href="${data.url}" target="_blank" class="mt-4 block text-center px-4 py-2 bg-black text-white rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                                <i class="fab fa-spotify text-white"></i> Open in Spotify
                            </a>
                            <!-- Download Music Button -->
                            <button onclick="downloadMusic('${data.url}')" class="mt-2 block text-center px-4 py-2 w-full bg-green-700 text-white rounded-lg flex items-center justify-center hover:bg-green-600 gap-2 transition-all">
                                Download Music
                            </button>
                        `;
                    resultsContainer.appendChild(trackCard);
                }
            }

            resultsSection.classList.remove("hidden");
            loadingMessage.textContent = "Data loaded successfully!";
        } catch (error) {
            console.error("Error fetching data:", error);
            alert(`Failed to fetch data: ${error.message}`);
        } finally {
            loadingBar.classList.add("hidden");
        }
    });
});

// Function to open download URL in a new tab
function downloadMusic(trackUrl) {
    const downloadUrl = `https://spotifyapi.caliphdev.com/api/download/track?url=${encodeURIComponent(trackUrl)}`;
    window.open(downloadUrl, "_blank");
}
