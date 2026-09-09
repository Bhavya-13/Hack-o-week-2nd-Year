const searchForm = document.querySelector("#searchForm");
const usernameInput = document.querySelector("#usernameInput");
const statusMessage = document.querySelector("#statusMessage");
const profileCard = document.querySelector("#profileCard");
const recentList = document.querySelector("#recentList");
const clearHistoryBtn = document.querySelector("#clearHistory");

const STORAGE_KEY = "recentSearches";

//localstore

function getRecentSearches() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  } else {
    return [];
  }
}

function saveRecentSearch(username) {
  let searches = getRecentSearches();

  searches = searches.filter(function (u) {
    return u.toLowerCase() !== username.toLowerCase();
  });

  searches.unshift(username);

  if (searches.length > 5) {
    searches = searches.slice(0, 5);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  renderRecentSearches();
}

function renderRecentSearches() {
  const searches = getRecentSearches();
  recentList.innerHTML = "";

  if (searches.length === 0) {
    const li = document.createElement("li");
    li.textContent = "nothing here yet";
    recentList.appendChild(li);
    return;
  }

  for (let i = 0; i < searches.length; i++) {
    const li = document.createElement("li");
    li.textContent = searches[i];
    recentList.appendChild(li);
  }
}

function withLoadingMessage(message, callback) {
  statusMessage.textContent = message;
  callback();
}

//fetch
async function fetchGithubUser(username) {
  const response = await fetch("https://api.github.com/users/" + username);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("user not found");
    }
    throw new Error("something went wrong (" + response.status + ")");
  }

  const data = await response.json();
  return data;
}

function renderProfile(user) {
  profileCard.classList.remove("hidden");

  profileCard.innerHTML =
    '<img src="' + user.avatar_url + '">' +
    "<h2>" + (user.name || user.login) + "</h2>" +
    "<p>username: " + user.login + "</p>" +
    "<p>" + (user.bio || "no bio") + "</p>" +
    "<p>followers: " + user.followers + "</p>" +
    "<p>public repos: " + user.public_repos + "</p>";
}

//main search
async function handleSearch(username) {
  profileCard.classList.add("hidden");
  statusMessage.textContent = "loading...";

  try {
    const user = await fetchGithubUser(username);
    renderProfile(user);
    saveRecentSearch(user.login);
    statusMessage.textContent = "";
  } catch (err) {
    statusMessage.textContent = "error: " + err.message;
  }
}

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (username === "") {
    return;
  }
  handleSearch(username);
});

recentList.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    handleSearch(e.target.textContent);
  }
});

clearHistoryBtn.addEventListener("click", function () {
  localStorage.removeItem(STORAGE_KEY);
  renderRecentSearches();
});

document.addEventListener("DOMContentLoaded", function () {
  renderRecentSearches();
});
