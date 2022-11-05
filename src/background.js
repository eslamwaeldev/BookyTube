chrome.runtime.onMessage.addListener((message) => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["contentScript.js"],
          });
          chrome.tabs.sendMessage(tab.id, message);
        }
      });
    }
  );
  return true;
});
