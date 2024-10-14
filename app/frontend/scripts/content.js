chrome.storage.local.get('selectedText', (data) => main(data));

const main = (data) => {
	let findPrompTextAreaIntervalId;
	let retryCount = 0;

	findPrompTextAreaIntervalId = setInterval(() => {
		const promptTextarea = document.querySelector("[contenteditable='true']");

		if (retryCount > 10) {
			clearInterval(findPrompTextAreaIntervalId);
			const promptTextareaErrorMessage =
				'Extension was unable to find the prompt textarea, which means this extension can not insert the selected text into Chat GPT. This is usually due to Chat GPT making significant changes in their user interface. Please reach out to me using the contact information found on the Chrome extension center, which you can find here: https://chromewebstore.google.com/detail/ask-chat-gpt-extension/mnpopjepnclgacgbfheejifcblhlceef. I can not promise that I will address your issue right away, as this is a hobby project, and I have a job which pays me to write software profesionally. However, I will make a good faith effort and try my best to address it in a timely manner.';

			alert(promptTextareaErrorMessage);
		}

		if (promptTextarea) {
			clearInterval(findPrompTextAreaIntervalId);
			appLogic(data, promptTextarea);
		}

		retryCount += 1;
	}, 1000);
};

const appLogic = (data, promptTextarea) => {
	if (data.selectedText) {
		promptTextarea.textContent = `Please explain this following triple-double-quoted text as clear and concisely as possible, but don't skip over important information for the sake of being concise. Also, please explain in an educational manner if possible.
		
		"""\r\n${data.selectedText}\r\n"""`;

		let sendButtonTimeoutId;

		// Allows one second of time to pass after text content has been set in the prompt text area in order to reduce chance of send button not enabling.
		sendButtonTimeoutId = setTimeout(() => {
			const submitPromptButton = document.querySelector(
				'[data-testid="send-button"]',
			);

			if (submitPromptButton) {
				submitPromptButton.click?.();
			} else {
				const submitPromptErrorMessage =
					'Extension was able to find the prompt textarea and paste in the prompt, but there was a problem with finding the send button in the Chat GPT user interface. This typically means one of two things. The first is that sometimes when the prompt is inserted quickly, the button stays disabled despite having the prompt. I have taken measures to prevent this from happening as I have programmed it to wait one-second after the prompt is set as the text content, and then finally looking for the send button. The next most likely scenario is that Chat GPT made a significant change in their user interface. Please reach out to me using the contact information found on the Chrome extension center, which you can find here: https://chromewebstore.google.com/detail/ask-chat-gpt-extension/mnpopjepnclgacgbfheejifcblhlceef. I can not promise that I will address your issue right away, as this is a hobby project, and I have a job which pays me to write software profesionally. However, I will make a good faith effort and try my best to address it in a timely manner.';

				alert(submitPromptErrorMessage);
			}

			chrome.storage.local.remove('selectedText');

			clearTimeout(sendButtonTimeoutId);
		}, 1000);
	}
};
