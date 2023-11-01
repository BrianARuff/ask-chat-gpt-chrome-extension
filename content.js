chrome.storage.local.get('selectedText', (data) => {
	const askChatGPTInterval = setInterval(() => {
		if (data.selectedText) {
			const textArea = document.querySelector('#prompt-textarea');
					
			if (textArea) {				
				const textToInsert = `Please, explain, as best as you can, what the following text means:\n\n "${data.selectedText}"`;
				textArea.value = textToInsert;
				
				const inputEvent = new Event('input', {
					bubbles: true,
					cancelable: true
				});
				textArea.dispatchEvent(inputEvent);
			}
		}

		const sendButton = document.querySelector('[data-testid="send-button"]');

		if (sendButton && !sendButton.disabled) {
			clearInterval(askChatGPTInterval);
			sendButton.click();
			chrome.storage.local.remove('selectedText');
		}
	}, 300);

});