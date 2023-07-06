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
  };

  return (
    <>
      <div className="border-l-4 border-y-2 border-r-2  rounded-md gap-7 border-[#FF1616] dark:border-gray-50  flex w-full h-3/4 p-3 items-center justify-between relative text-gray-800 dark:text-[#C5BEBE]">
        <p className=" text-sm font-normal">{props.desc}</p>
        <div className="flex justify-end gap-2  ">
          <button className=" flex justify-center items-center" onClick={onPlay}>
            <img className="flex dark:hidden" src="/assets/play.svg"></img>
            <img className="hidden dark:flex" src="/assets/playDark.svg"></img>
          </button>
          <button className=" flex justify-center items-center" onClick={onShare}>
            <img className="flex dark:hidden" src="/assets/share.svg"></img>
            <img className="hidden dark:flex" src="/assets/copyDark.svg"></img>
          </button>
          <button className=" flex justify-center items-center" onClick={onDelete}>
            <img className="flex dark:hidden" src="/assets/delete.svg"></img>
            <img className="hidden dark:flex" src="/assets/deleteDark.svg"></img>
          </button>
        </div>
      </div>
    </>
  );
}
