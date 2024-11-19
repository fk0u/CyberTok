// Import nayan-media-downloader package in your Node.js environment
const { instagram } = require("nayan-media-downloader");

document.getElementById("downloadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const instagramUrl = document.getElementById("instagramUrl").value;
    const loadingBar = document.getElementById("loadingBar");
    const loadingMessage = document.getElementById("loadingMessage");
    const resultSection = document.getElementById("result");
    const authorAvatar = document.getElementById("authorAvatar");
    const authorName = document.getElementById("authorName");
    const videoCaption = document.getElementById("videoCaption");
    const mediaPreview = document.getElementById("mediaPreview");
    const downloadMedia = document.getElementById("downloadMedia");

    // Show loading bar
    loadingBar.classList.remove("hidden");
    loadingMessage.textContent = "Fetching data...";

    try {
        // Fetch Instagram data using nayan-media-downloader
        const data = await instagram(instagramUrl);

        // Update UI with fetched data
        authorAvatar.src = data.author.profile_pic || "https://via.placeholder.com/100";
        authorName.textContent = data.author.name || "Unknown Author";
        videoCaption.textContent = data.caption || "No caption available";
        mediaPreview.src = data.media_url || "";
        downloadMedia.href = data.media_url || "#";

        // Show result section
        resultSection.classList.remove("hidden");
        loadingMessage.textContent = "Displaying data...";
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to retrieve media. Please check the URL and try again.");
    } finally {
        // Hide loading bar
        loadingBar.classList.add("hidden");
    }
});

// Clipboard Paste Feature
document.getElementById("pasteButton").addEventListener("click", async () => {
    const instagramUrlInput = document.getElementById("instagramUrl");
    try {
        const text = await navigator.clipboard.readText();
        instagramUrlInput.value = text;
    } catch (err) {
        alert("Failed to read clipboard contents: " + err);
    }
});
