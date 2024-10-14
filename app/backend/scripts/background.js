chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: 'ask-gpt',
		title: 'Ask Chat GPT Extension',
		contexts: ['selection'],
	});
});

const contextMenuListener = (info, tab) => {
	if (info.menuItemId === 'ask-gpt') {
		chrome.tabs.sendMessage(
			tab.id,
			{ action: 'getSelectedText' },
			(response) => {
				const selectedText = response?.selectedText;

				chrome.storage.local.set({ selectedText: selectedText }, () => {
					chrome.tabs.create({ url: 'https://chat.openai.com/' });
				});
			},
		);
	}
};

chrome.contextMenus.onClicked.addListener(contextMenuListener);
