import { useEffect, useState } from "react";
import Bookmark from "./components/Bookmark";
import "./index.css";
import { getCurrentTab } from "../utils";

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [videoTab, setVideoTab] = useState(false);
  const [isYoutube, setIsYoutube] = useState(false);
  useEffect(() => {
    const findTab = async () => {
      const currentTab = await getCurrentTab();
      const currentUrl = currentTab.url;
      const queryParameters = currentUrl.split("?")[1];
      const urlParam = new URLSearchParams(queryParameters);
      const currentVideo = urlParam.get("v");
      if (currentUrl.includes("www.youtube.com")) {
        setIsYoutube(true);
        if (currentVideo) {
          setVideoTab(true);
          chrome.storage.sync.get([currentVideo], (result) => {
            setBookmarks(result[currentVideo] ? JSON.parse(result[currentVideo]) : []);
          });
        }
      } else {
        setIsYoutube(false);
      }
    };
    findTab();
  });
  return isYoutube ? (
    videoTab ? (
      bookmarks.length > 0 ? (
        <div className="flex flex-col items-center p-4 w-full text-gray-900 dark:text-gray-50">
          <h2 className="text-xl  font-bold">Your Bookmarks for this video</h2>
          <div className="grid grid-cols-1 gap-y-[0.2rem] p-4 w-full">
            {bookmarks.map((bookmark, index) => {
              return (
                <Bookmark
                  key={index}
                  timeStamp={bookmark.time}
                  desc={bookmark.desc}
                  id={bookmark.id}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-center h-full w-full text-gray-900 dark:text-gray-50 p-4 ">
          <h2 className="text-xl  font-bold italic ">
            There are no bookmarks added for this video
          </h2>
        </div>
      )
    ) : (
      <div className="flex flex-col justify-center items-center text-center h-full w-full text-gray-900 dark:text-gray-50">
        <h2 className="text-xl  font-bold italic ">Open a Video to load it's bookmarks</h2>
      </div>
    )
  ) : (
    <>
      <div className="flex flex-col justify-center items-center p-5 dark:bg-gray-800 text-gray-900 dark:text-gray-50">
        <h2 className="text-xl  font-bold ">This is not a youtube page !</h2>
        <img src="/assets/sadFace.png" alt="sad face" className="h-44 w-44 " />
      </div>
    </>
  );
}

export default App;
