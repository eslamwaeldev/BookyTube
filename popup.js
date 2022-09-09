import { getCurrentTab } from "./utils.js";
// adding a new bookmark row to the popup

const addNewBookmark = (bookMarkElement, bookmark) => {
  const bookmarkTitle = document.createElement("div");
  const newBookmarkElement = document.createElement("div");
  const controlsElement = document.createElement("div");

  bookmarkTitle.innerText = bookmark.desc; // look it up
  bookmarkTitle.className = "bookmark-title";

  controlsElement.className = "bookmark-controls";
  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

  newBookmarkElement.id = "Bookmark " + bookmark.time; // look it up
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time); // look it up
  newBookmarkElement.appendChild(bookmarkTitle);
  newBookmarkElement.appendChild(controlsElement);

  bookMarkElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks = []) => {
  const bookMarkElement = document.getElementById("bookmarks");
  bookMarkElement.innerHTML = "";
  if (currentBookmarks.length > 0) {
    currentBookmarks.map((bookmark) => addNewBookmark(bookMarkElement, bookmark));
  } else {
    bookMarkElement.innerHTML = "<em class='row'>No bookmarks to show</em>";
  }
};

const onPlay = async (e) => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { type: "PLAY", value: bookmarkTime });
  });
};

const onDelete = async (e) => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const elementToDelete = document.getElementById("Bookmark " + bookmarkTime);
  elementToDelete.parentNode.removeChild(elementToDelete);
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { type: "DELETE", value: bookmarkTime }, viewBookmarks);
  });
};

const setBookmarkAttributes = (src, eventListener, controlParentELement) => {
  const controlElement = document.createElement("img");
  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentELement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
  const currentTab = await getCurrentTab();
  const currentUrl = currentTab.url;
  const queryParameters = currentUrl.split("?")[1];
  const urlParam = new URLSearchParams(queryParameters);
  const currentVideo = urlParam.get("v");

  if (currentUrl.includes("www.youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (result) => {
      const currentBookmarks = result[currentVideo] ? JSON.parse(result[currentVideo]) : [];
      viewBookmarks(currentBookmarks);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = "<div class = 'title'>This is not a youtube page</div>";
  }
});
