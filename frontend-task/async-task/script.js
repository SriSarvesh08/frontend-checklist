
const searchForm = document.getElementById("searchForm");
const usernameInput = document.getElementById("usernameInput");
const searchButton = document.getElementById("searchButton");
const statusMessage = document.getElementById("statusMessage");
const profileSection = document.getElementById("profileSection");

const avatar = document.getElementById("avatar");
const nameElement = document.getElementById("name");
const usernameElement = document.getElementById("username");
const bioElement = document.getElementById("bio");
const locationElement = document.getElementById("location");
const repositoriesElement = document.getElementById("repositories");
const followersElement = document.getElementById("followers");
const followingElement = document.getElementById("following");
const profileLink = document.getElementById("profileLink");

searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = usernameInput.value.trim();

    if (username === "") {
        statusMessage.textContent = "Please enter a GitHub username.";
        profileSection.hidden = true;
        return;
    }

    profileSection.hidden = true;
    statusMessage.textContent = "Loading profile...";
    searchButton.disabled = true;
    searchButton.textContent = "Searching...";

    try {
        const response = await fetch(
            `https://api.github.com/users/${encodeURIComponent(username)}`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("User not found. Check the username.");
            }

            if (response.status === 403 || response.status === 429) {
                throw new Error("API rate limit reached. Try again later.");
            }

            throw new Error("Unable to fetch profile. Please try again.");
        }

        const data = await response.json();

        avatar.src = data.avatar_url;
        avatar.alt = `${data.login}'s GitHub avatar`;

        nameElement.textContent = data.name || data.login;
        usernameElement.textContent = `@${data.login}`;
        usernameElement.href = data.html_url;

        bioElement.textContent = data.bio || "No bio available.";
        locationElement.textContent = data.location
            ? `📍 ${data.location}`
            : "📍 Location not provided";

        repositoriesElement.textContent = data.public_repos;
        followersElement.textContent = data.followers;
        followingElement.textContent = data.following;

        profileLink.href = data.html_url;

        profileSection.hidden = false;
        statusMessage.textContent = "Profile loaded successfully!";

    } catch (error) {
        statusMessage.textContent = error.message;
        profileSection.hidden = true;

    } finally {
        searchButton.disabled = false;
        searchButton.textContent = "Search Profile →";
    }
});
