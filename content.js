const activateSendButton = (textArea) => {
	const inputEvent = new Event('input', {
		bubbles: true,
		cancelable: true
	});

	textArea.dispatchEvent(inputEvent);
};

chrome.storage.local.get('selectedText', (data) => {
	if (data.selectedText) {
		const askChatGPTInterval = setInterval(() => {
			if (data.selectedText) {
				const textArea = document.querySelector('#prompt-textarea');
						
				if (textArea) {				
					const textToInsert = `Kindly elucidate on:\n\n "${data.selectedText}"`;
					
					textArea.value = textToInsert;
					
					activateSendButton(textArea);
				}
			}
	
			const sendButton = document.querySelector('[data-testid="send-button"]');
	
			if (sendButton && !sendButton.disabled) {
				
				clearInterval(askChatGPTInterval);
				
				sendButton.click();
				
				chrome.storage.local.remove('selectedText');
			}
		}, 300);
	}
});
