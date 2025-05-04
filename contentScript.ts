"use strict";

import { v4 as uuidv4 } from "uuid";
import { Bookmark } from "./src/schema";
import "./contentScript.css";

(async () => {
  const isThereAYoutubeVideo = Array.from(document.getElementsByTagName("iframe")).filter(
    (iframe) => {
      return iframe.src.includes("www.youtube.com");
    }
  );

  if (isThereAYoutubeVideo.length > 0) {
    chrome.runtime.sendMessage({
      type: "Youtube Video Found",
      videoID: isThereAYoutubeVideo[0].src.split("/")[4],
    });
  }

  let youtubeRightControls: Element, youtubePlayer: HTMLVideoElement;
  let currentVideo: string = new URLSearchParams(window.location.href.split("?")[1]).get("v") || "";
  let currentVideoBookmarks: Bookmark[] = [];

  if (!chrome.runtime.onMessage.hasListeners()) {
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
      const { type, value, videoId } = obj;
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
          currentVideo = videoId;
          newVideoLoaded();
          break;
        case "PLAY":
          youtubePlayer.currentTime = value;
          break;
        case "DELETE":
          currentVideoBookmarks = currentVideoBookmarks.filter((bookmark) => bookmark.id !== value);
          chrome.storage.sync.remove([currentVideo]);
          if (currentVideoBookmarks.length > 0) {
            chrome.storage.sync.set({
              [currentVideo]: JSON.stringify(currentVideoBookmarks),
            });
          } else {
            newVideoLoaded();
          }
          response(currentVideoBookmarks);
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

  const newVideoLoaded = async () => {
    const bookmarkBtnExists = document.getElementById("BookyTube-btn");
    currentVideoBookmarks = await fetchBookmarks();
    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("button");
      const bookmarkBtnImg = document.createElement("img");
      bookmarkBtnImg.className = "bookmark-btn-img";
      bookmarkBtnImg.src = chrome.runtime.getURL("images/bookmark.png");
      bookmarkBtn.id = "BookyTube-btn";
      bookmarkBtn.className = "ytp-button " + "bookmark-btn";
      bookmarkBtnImg.title = "Click to bookmark current timestamp";
      bookmarkBtn?.append(bookmarkBtnImg);
      youtubeRightControls = document.getElementsByClassName("ytp-right-controls")[0];
      youtubePlayer = document.getElementsByClassName("video-stream")[0] as HTMLVideoElement;
      youtubeRightControls?.append(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
  };

  const addNewBookmarkEventHandler = async () => {
    currentVideo = new URLSearchParams(window.location.href.split("?")[1]).get("v") || "";
    const currentTime = youtubePlayer.currentTime;
    const bookmarkID = uuidv4();
    const url = window.location.href;

    const newBookmark = {
      id: bookmarkID,
      time: currentTime,
      desc: "Bookmark at " + getTime(currentTime),
      videoUrl: url,
    };
    currentVideoBookmarks = await fetchBookmarks();
    const isRepeated = currentVideoBookmarks.find((bookmark) => bookmark.time === newBookmark.time);
    if (!isRepeated) {
      chrome.storage.sync.set({
        [currentVideo]: JSON.stringify(
          currentVideoBookmarks.length > 0
            ? [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
            : [newBookmark]
        ),
      });
      currentVideoBookmarks = await fetchBookmarks();
    }
  };

  newVideoLoaded();

  const getTime = (t: number) => {
    const date = new Date(0);
    date.setSeconds(t);
    return date.toISOString().substring(11, 18);
  };
})();
