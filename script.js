document.getElementById("downloadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const videoUrl = document.getElementById("videoUrl").value;
    const resultSection = document.getElementById("result");
    const authorAvatar = document.getElementById("authorAvatar");
    const authorName = document.getElementById("authorName");
    const authorUsername = document.getElementById("authorUsername");
    const videoCaption = document.getElementById("videoCaption");
    const videoPreview = document.getElementById("videoPreview");
    const downloadVideo = document.getElementById("downloadVideo");
    const musicTitle = document.getElementById("musicTitle").querySelector("span");
    const musicAuthor = document.getElementById("musicAuthor").querySelector("span");
    const musicDuration = document.getElementById("musicDuration").querySelector("span");
    const downloadMusic = document.getElementById("downloadMusic");
    const likes = document.getElementById("likes");
    const comments = document.getElementById("comments");
    const shares = document.getElementById("shares");

    const apiEndpoints = [
        `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(videoUrl)}`,
        `https://api.tiklydown.eu.org/api/download/v2?url=${encodeURIComponent(videoUrl)}`,
        `https://api.tiklydown.eu.org/api/download/v3?url=${encodeURIComponent(videoUrl)}`,
        `https://api.tiklydown.eu.org/api/download/v4?url=${encodeURIComponent(videoUrl)}`,
        `https://api.tiklydown.eu.org/api/download/v5?url=${encodeURIComponent(videoUrl)}`
    ];

    let data = null;
    for (const endpoint of apiEndpoints) {
        try {
            const response = await fetch(endpoint);
            if (response.ok) {
                data = await response.json();
                console.log(`API Success: ${endpoint}`);
                break; // Exit the loop if successful
            } else {
                console.warn(`API failed: ${endpoint}`);
            }
        } catch (error) {
            console.error(`Error with endpoint ${endpoint}:`, error);
        }
    }

    if (!data) {
        alert("Failed to retrieve video. All API endpoints are unavailable. Please try again later.");
        return;
    }

    // Populate the UI with data
    try {
        authorAvatar.src = data.author.avatar || "https://via.placeholder.com/50";
        authorName.textContent = data.author.name || "Unknown Author";
        authorUsername.textContent = `@${data.author.unique_id || "unknown"}`;
        videoCaption.textContent = data.title || "No title available";
        videoPreview.src = data.video.noWatermark || data.video.watermark || "";
        downloadVideo.href = data.video.noWatermark || data.video.watermark || "#";
        musicTitle.textContent = data.music.title || "No music title";
        musicAuthor.textContent = data.music.author || "Unknown";
        musicDuration.textContent = `${data.music.durationFormatted || "0:00"}`;
        downloadMusic.href = data.music.play_url || "#";
        likes.textContent = `${data.stats.likeCount || 0} likes`;
        comments.textContent = `${data.stats.commentCount || 0} comments`;
        shares.textContent = `${data.stats.shareCount || 0} shares`;

        resultSection.classList.remove("hidden");
    } catch (error) {
        console.error("Error populating data:", error);
        alert("An error occurred while displaying the video details. Please try again.");
    }
});
