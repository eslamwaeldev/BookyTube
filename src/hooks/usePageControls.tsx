import { useEffect, useState } from "react";
import { getCurrentTab } from "../utils/tabsUtils";

export interface Controls {
  youtubePage: boolean;
  youtubeVideoEmbedded: boolean;
  currentVideoId: string;
  urlParams: URLSearchParams;
}

export interface TabIdentifierReturn {
  urlParams: URLSearchParams;
  isYoutube: boolean;
  youtubeVideoFound: boolean;
  currentVideo: string | null;
}

const usePageControls = (): Controls => {
  const [youtubePage, setYoutubePage] = useState<boolean>(false);
  const [youtubeVideoEmbedded, setYoutubeVideoEmbedded] = useState<boolean>(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>("");
  const [urlParams, setUrlParams] = useState<URLSearchParams>(new URLSearchParams());
  const [stop, setStop] = useState<boolean>(true);

  chrome.runtime.onMessage.addListener((obj) => {
    const { type, videoID } = obj;
    if (type === "Youtube Video Found") {
      setStop(false);
      setYoutubeVideoEmbedded(true);
      setCurrentVideoId(videoID);
    }
  });

  const componentControl = async (stop: boolean) => {
    const { url } = await getCurrentTab();
    const queryParams = url?.split("?")[1];
    const params = new URLSearchParams(queryParams);
    if (url?.includes("www.youtube.com")) setStop(false);
    if (!stop) {
      setUrlParams(params);
      if (params.get("v")) {
        setYoutubePage(true);
        setCurrentVideoId(params.get("v") as string);
      } else {
        setYoutubePage(true);
      }
    }
  };

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const { id } = tabs[0];
      chrome.tabs.sendMessage(id as number, { type: "Popup opened" });
    });
  });
  useEffect(() => {
    componentControl(stop);
    return () => {
      setStop(true);
    };
  }, [stop]);
  return {
    currentVideoId: currentVideoId,
    urlParams: urlParams,
    youtubeVideoEmbedded: youtubeVideoEmbedded,
    youtubePage: youtubePage,
  };
};

export default usePageControls;
