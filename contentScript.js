(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = new URLSearchParams(window.location.href.split("?")[1]).get("v");
  let currentVideoBookmarks = [];

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;
    if (type === "NEW") {
      currentVideo = videoId;
      newVideoLoaded();
    } else if (type === "PLAY") {
      youtubePlayer.currentTime = value;
    } else if (type === "DELETE") {
      currentVideoBookmarks = currentVideoBookmarks.filter((bookmark) => bookmark.time != value);
      chrome.storage.sync.remove([currentVideo]);
      if (currentVideoBookmarks.length > 0) {
        chrome.storage.sync.set({
          [currentVideo]: JSON.stringify(currentVideoBookmarks),
        });
        chrome.storage.sync.get([currentVideo], (result) => {});
      } else {
        newVideoLoaded();
      }
      response(currentVideoBookmarks);
    }
  });

  const fetchBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentVideo], (result) => {
        resolve(result[currentVideo] ? JSON.parse(result[currentVideo]) : []);
      });
    });
  };

  const newVideoLoaded = async () => {
    const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
    currentVideoBookmarks = await fetchBookmarks();

    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("img");

      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      bookmarkBtn.className = "ytp-button " + "bookmark-btn";
      bookmarkBtn.title = "Click to bookmark current timestamp";

      youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
      youtubePlayer = document.getElementsByClassName("video-stream")[0];

      youtubeLeftControls.append(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
  };

  const addNewBookmarkEventHandler = async () => {
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark at " + getTime(currentTime),
    };

    currentVideoBookmarks = await fetchBookmarks();

    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(
        currentVideoBookmarks.length > 0
          ? [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
          : [newBookmark].sort((a, b) => a.time - b.time)
      ),
    });
  };
  newVideoLoaded();
})();

const getTime = (t) => {
  var date = new Date(0);
  date.setSeconds(t);

  return date.toISOString().substring(11, 18);
};
