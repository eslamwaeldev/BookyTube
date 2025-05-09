"use strict";
import { Bookmark } from "./src/schema";
import "./contentScript.css";

const isThereAYoutubeVideo = Array.from(document.getElementsByTagName("iframe")).filter(
  (iframe) => {
    return iframe.src.includes("www.youtube.com");
  }
);

const isYoutubeVideoPage = new URLSearchParams(window.location.href).has("v");

if (isThereAYoutubeVideo.length > 0) {
  chrome.runtime.sendMessage({
    type: "Youtube Video Found",
    videoID: isThereAYoutubeVideo[0].src.split("/")[4],
  });
}

let youtubePlayer: HTMLVideoElement;
const currentVideo = new URLSearchParams(window.location.href.split("?")[1]).get("v");

if (!chrome.runtime.onMessage.hasListeners()) {
  chrome.runtime.onMessage.addListener(async (obj) => {
    const { type, value } = obj;
    switch (type) {
      case "Popup opened":
        if (isThereAYoutubeVideo.length > 0) {
          chrome.runtime.sendMessage({
            type: "Youtube Video Found",
            videoID: isThereAYoutubeVideo[0].src.split("/")[4],
          });
        }
        newVideoLoaded();
        break;
      case "NEW":
        newVideoLoaded();
        break;
      case "PLAY":
        youtubePlayer.currentTime = value;
        break;
      case "DELETE":
        if (currentVideo) {
          const currentVideoBookmarks = await fetchBookmarks();
          const filteredVideoBookmarks = currentVideoBookmarks.filter(
            (bookmark) => bookmark.id !== value
          );
          chrome.storage.sync.remove([currentVideo]);
          if (currentVideoBookmarks.length > 0) {
            chrome.storage.sync.set({
              [currentVideo]: JSON.stringify(filteredVideoBookmarks),
            });
          }
        }
        break;
      default:
        newVideoLoaded();
        break;
    }
  });
}

const fetchBookmarks = async (): Promise<Bookmark[]> => {
  if (currentVideo) {
    if (currentVideo) {
      const getCurrentBookmarks = await chrome.storage.sync.get([currentVideo]);
      if (Object.keys(getCurrentBookmarks).length > 0) {
        return await JSON.parse(getCurrentBookmarks[currentVideo]);
      } else return [];
    } else return [];
  } else return [];
};

const newVideoLoaded = () => {
  const bookmarkBtnExists = document.getElementById("BookyTube-btn");
  const youtubeRightControls = document.getElementsByClassName("ytp-right-controls")[0];
  if (!bookmarkBtnExists && youtubeRightControls) {
    const bookmarkBtn = document.createElement("button");
    const bookmarkBtnImg = document.createElement("img");
    bookmarkBtnImg.className = "bookmark-btn-img";
    bookmarkBtnImg.src = chrome.runtime.getURL("images/bookmark.png");
    bookmarkBtn.id = "BookyTube-btn";
    bookmarkBtn.className = "ytp-button " + "bookmark-btn";
    bookmarkBtnImg.title = "Click to bookmark current timestamp";
    bookmarkBtn?.append(bookmarkBtnImg);
    youtubePlayer = document.getElementsByClassName("video-stream")[0] as HTMLVideoElement;
    youtubeRightControls?.append(bookmarkBtn);
    bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
  }
};

const addNewBookmarkEventHandler = async () => {
  //todo: Handle Iframe saves because url does not include video id
  const currentVideo = new URLSearchParams(window.location.href.split("?")[1]).get("v") ?? "";

  console.log("🚀 ~ addNewBookmarkEventHandler ~ currentVideo:", currentVideo);

  const currentTime = youtubePlayer.currentTime;
  const bookmarkID = currentVideo;
  const url = window.location.href;

  const getBookyTubeIDs = await chrome.storage.sync.get("BookyTubeIDs");
  console.log("🚀 ~ addNewBookmarkEventHandler ~ getBookyTubeIDs:", getBookyTubeIDs);
  if ("BookyTubeIDs" in getBookyTubeIDs) {
    const IDs = JSON.parse(getBookyTubeIDs.BookyTubeIDs);
    chrome.storage.sync.set({
      BookyTubeIDs: JSON.stringify([...IDs, currentVideo]),
    });
  }

  const newBookmark = {
    id: bookmarkID,
    time: currentTime,
    desc: "Bookmark at " + getTime(currentTime),
    videoUrl: url,
  };
  const currentVideoBookmarks = await fetchBookmarks();
  const isRepeated = currentVideoBookmarks.find((bookmark) => bookmark.time === newBookmark.time);
  if (!isRepeated) {
    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(
        currentVideoBookmarks.length > 0
          ? [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
          : [newBookmark]
      ),
    });
  }
  const updatedBookmarks = await fetchBookmarks();
  console.log("🚀 ~ addNewBookmarkEventHandler ~ updatedBookmarks:", updatedBookmarks);
};

if (isThereAYoutubeVideo || isYoutubeVideoPage) {
  window.onload = () => {
    newVideoLoaded();
  };
}

const getTime = (t: number) => {
  const date = new Date(0);
  date.setSeconds(t);
  return date.toISOString().substring(11, 18);
};
