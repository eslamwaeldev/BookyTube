export const getCurrentTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const tabs = await chrome.tabs.query(queryOptions);
  console.log("🚀 ~ getCurrentTab ~ tabs:", tabs);
  return tabs[0];
};
