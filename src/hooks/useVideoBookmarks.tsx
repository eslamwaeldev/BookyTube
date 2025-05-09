import { useEffect, useState } from "react";
import { Bookmark } from "../schema";

type useVideoBookmarksReturn = {
  isLoading: boolean;
  videoBookmarks: Bookmark[];
};

const useVideoBookmarks = (currentVideoId: string): useVideoBookmarksReturn => {
  const [videoBookmarks, setVideoBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    let fetching = true;

    chrome.storage.sync.get([currentVideoId], (result) => {
      console.log("🚀 ~ chrome.storage.sync.get ~ result:", result);
      if (fetching) {
        setVideoBookmarks(result[currentVideoId] ? JSON.parse(result[currentVideoId]) : []);
        setIsLoading(false);
      }
    });
    return () => {
      fetching = false;
    };
  }, [currentVideoId]);
  return {
    isLoading: isLoading,
    videoBookmarks: videoBookmarks,
  };
};

export default useVideoBookmarks;
