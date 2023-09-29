
chrome.action.onClicked.addListener((tab) => {
	console.log("start");
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ["replaceDocument.js"]
	});
	console.log("end");
});
