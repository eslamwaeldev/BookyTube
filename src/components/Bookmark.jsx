import React, { useState } from "react";

export default function Bookmark(props) {
  const [timeStamp, setTimeStamp] = useState(props.timeStamp);
  const onPlay = async () => {
    const bookmarkTime = timeStamp;
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { type: "PLAY", value: bookmarkTime });
    });
  };

  const onDelete = async () => {
    const bookmarkTime = timeStamp;
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { type: "DELETE", value: bookmarkTime });
    });
  };

  return (
    <>
      <div
        className="border-l-4 border-y-2 border-r-2  rounded-md gap-7 border-red-500 flex flex-row h-3/4 p-3 items-center  relative"
        timeStamp={props.timeStamp}
      >
        <p className="text-gray-900 text-sm font-medium">{props.desc}</p>
        <div className="flex justify-end gap-2 absolute right-2">
          <button className="w-7 flex justify-center items-center" onClick={onPlay}>
            <img src="../public/assets/play.png"></img>
          </button>
          <button className="w-5 flex justify-center items-center" onClick={onDelete}>
            <img src="../public/assets/delete.png"></img>
          </button>
        </div>
      </div>
    </>
  );
}
