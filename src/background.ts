chrome.runtime.onMessage.addListener((message) => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id as number, message, (res) => {
        console.log(res);
      });
    }
  );
});
