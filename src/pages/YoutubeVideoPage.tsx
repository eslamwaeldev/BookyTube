import { useEffect, useState } from "react";
import { Bookmark } from "../schema";
import VideoBookmarks from "../components/VideoBookmarks";

export interface Props {
  currentVideoId: string;
}

const YoutubeVideoPage = ({ currentVideoId }: Props) => {
  const [videoBookmarks, setVideoBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    chrome.storage.sync.get([currentVideoId], (result) => {
      setVideoBookmarks(result[currentVideoId] ? JSON.parse(result[currentVideoId]) : []);
    });
  }, [currentVideoId]);

  return videoBookmarks.length > 0 ? (
    <VideoBookmarks bookmarks={videoBookmarks} />
  ) : (
    <div className="flex flex-col justify-center items-center text-center h-full w-full p-4">
      <h2 className="text-xl font-bold text-black drop-shadow-header">
        There are no bookmarks added for this video
      </h2>
    </div>
  );
};

export default YoutubeVideoPage;
