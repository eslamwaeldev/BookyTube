export const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let tabs = await chrome.tabs.query(queryOptions);
  console.log("🚀 ~ getCurrentTab ~ tabs:", tabs);
  return tabs[0];
};
