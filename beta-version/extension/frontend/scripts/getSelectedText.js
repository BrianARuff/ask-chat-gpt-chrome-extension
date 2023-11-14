chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
	if (request.action === 'getSelectedText') {
		sendResponse({ selectedText: window.getSelection().toString() });
	}
});
