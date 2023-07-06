import React, { useState } from "react";

export default function Bookmark(props) {
  const bookmarkTime = props.timeStamp;
  const onPlay = async () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { type: "PLAY", value: bookmarkTime });
    });
  };

  const onDelete = async () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { type: "DELETE", value: props.id });
    });
  };

  const onShare = async () => {
    await navigator.clipboard.writeText(props.url.toString() + "&t=" + props.timeStamp);
    console.log("copied");
  };

  return (
    <>
      <div className="border-l-4 border-y-2 border-r-2  rounded-md gap-7 border-red-500  flex flex-row h-3/4 p-3 items-center  relative text-gray-800 dark:text-gray-50">
        <p className=" text-sm font-medium">{props.desc}</p>
        <div className="flex justify-end gap-2 absolute right-2">
          <button className="w-7 flex justify-center items-center" onClick={onPlay}>
            <img src="/assets/play.png"></img>
          </button>
          <button className="w-5 flex justify-center items-center" onClick={onDelete}>
            <img src="/assets/delete.png"></img>
          </button>
          <button className="w-5 flex justify-center items-center" onClick={onShare}>
            <img src="/assets/share.png"></img>
          </button>
        </div>
      </div>
    </>
  );
}
