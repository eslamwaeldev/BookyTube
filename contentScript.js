import { v4 as uuidv4 } from "uuid";
import "./src/index.css";

let youtubeRightControls, youtubePlayer;
let currentVideo = new URLSearchParams(window.location.href.split("?")[1]).get("v");
let currentVideoBookmarks = [];

chrome.runtime.onMessage.addListener((obj, sender, response) => {
  const { type, value, videoId, id } = obj;
  if (type === "NEW") {
    currentVideo = videoId;
    newVideoLoaded();
  } else if (type === "PLAY") {
    youtubePlayer.currentTime = value;
  } else if (type === "DELETE") {
    currentVideoBookmarks.forEach((entry) => {
      if (entry.id === value) {
        console.log(true);
      }
    });
    console.log(currentVideoBookmarks.length);
    currentVideoBookmarks = currentVideoBookmarks.filter((bookmark) => bookmark.id !== value);
    console.log(currentVideoBookmarks.length);
    chrome.storage.sync.remove([currentVideo]);
    if (currentVideoBookmarks.length > 0) {
      chrome.storage.sync.set({
        [currentVideo]: JSON.stringify(currentVideoBookmarks),
      });
    } else {
      newVideoLoaded();
    }
    response(currentVideoBookmarks);
  }
});

const fetchBookmarks = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([currentVideo], (result) => {
      if (result) {
        resolve(result[currentVideo] ? JSON.parse(result[currentVideo]) : []);
      }
    });
  });
};

const newVideoLoaded = async () => {
  const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
  currentVideoBookmarks = await fetchBookmarks();

  if (!bookmarkBtnExists) {
    const bookmarkBtn = document.createElement("button");
    const bookmarkBtnImg = document.createElement("img");
    bookmarkBtnImg.className = "bookmark-btn-img";
    bookmarkBtnImg.src = chrome.runtime.getURL("assets/bookmark.png");
    bookmarkBtn.className = "ytp-button " + "bookmark-btn";
    bookmarkBtnImg.title = "Click to bookmark current timestamp";
    bookmarkBtn.append(bookmarkBtnImg);
    youtubeRightControls = document.getElementsByClassName("ytp-right-controls")[0];
    youtubePlayer = document.getElementsByClassName("video-stream")[0];

    youtubeRightControls.append(bookmarkBtn);
    bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
  }
};

const addNewBookmarkEventHandler = async () => {
  const currentTime = youtubePlayer.currentTime;
  const bookmarkID = uuidv4();
  console.log(typeof bookmarkID);
  const newBookmark = {
    time: currentTime,
    desc: "Bookmark at " + getTime(currentTime),
    id: bookmarkID,
  };
  currentVideoBookmarks = await fetchBookmarks();
  chrome.storage.sync.set({
    [currentVideo]: JSON.stringify(
      currentVideoBookmarks.length > 0
        ? [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
        : [newBookmark]
    ),
  });
  currentVideoBookmarks = await fetchBookmarks();
};

window.addEventListener("load", () => {
  if (currentVideo) {
    newVideoLoaded();
  }
});

newVideoLoaded();

const getTime = (t) => {
  var date = new Date(0);
  date.setSeconds(t);

  return date.toISOString().substring(11, 18);
};
