import { useEffect, useState } from "react";
import Bookmark from "./components/Bookmark";
import "./index.css";
import { getCurrentTab } from "../utils";

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isYoutube, setIsYoutube] = useState(false);
  useEffect(() => {
    const findTab = async () => {
      const currentTab = await getCurrentTab();
      const currentUrl = currentTab.url;
      const queryParameters = currentUrl.split("?")[1];
      const urlParam = new URLSearchParams(queryParameters);
      const currentVideo = urlParam.get("v");
      if (currentUrl.includes("www.youtube.com/watch") && currentVideo) {
        setIsYoutube(true);
        chrome.storage.sync.get([currentVideo], (result) => {
          setBookmarks(result[currentVideo] ? JSON.parse(result[currentVideo]) : []);
        });
      } else {
        setIsYoutube(false);
      }
    };
    findTab();
  });
  return isYoutube ? (
    bookmarks.length > 0 ? (
      <div className="flex flex-col items-center p-4 w-full ">
        <h2 className="text-xl text-gray-900 font-bold">Your Bookmarks for this video</h2>
        <div className="grid grid-cols-1 gap-y-[0.2rem] p-4 w-full">
          {bookmarks.map((bookmark, index) => {
            return <Bookmark key={index} timeStamp={bookmark.time} desc={bookmark.desc} />;
          })}
        </div>
      </div>
    ) : (
      <div className="flex flex-col justify-center items-center text-center h-full w-full">
        <h2 className="text-xl text-gray-900 font-bold italic ">There are no bookmarks added for this video</h2>
      </div>
    )
  ) : (
    <>
      <div className="flex flex-col justify-center items-center p-5">
        <h2 className="text-xl text-gray-900 font-bold "> This is not a youtube page !</h2>
        <img src="../public/assets/sadFace.png" alt="sad face" className="h-44 w-44" />
      </div>
    </>
  );
}

export default App;
