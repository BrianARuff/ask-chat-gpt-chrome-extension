const state = {
  shouldCleanUp: false,
  gpt4Button: null,
};

chrome.storage.local.get("selectedText", (data) => main(data));

const main = async (data) => {
  if (data.selectedText) {
    // timeout is to ensure the textarea has loaded
    setTimeout(() => {
      inputSelectedText(data);
    }, 1000);

    // await clickChatGPT4Button();

    // timeout is to ensure the submit button is clickable
    setTimeout(() => {
      submitQuestionToChatGPT();
    }, 1000);

    chrome.storage.local.remove("selectedText");
  }
};

const inputSelectedText = (data) => {
  const textArea = document.querySelector("#prompt-textarea");

  if (textArea) {
    const leadInText = getRandomLeadInText();

    const textToInsert = `${leadInText} "${data.selectedText}"`;

    textArea.value = textToInsert;

    // simulates typing to enable the submit button
    const inputEvent = new Event("input", {
      bubbles: true,
      cancelable: true,
    });

    textArea.dispatchEvent(inputEvent);
  }
};

const _waitForChatGPT4Button = async () => {
  const loadingModalPortal = _createLoadingModalPortal();

  return new Promise((resolve, reject) => {
    const timeoutMillis = 10000;

    const startTime = Date.now();

    const interval = setInterval(() => {
      const chatGPT4Button = document.querySelector(
        '[data-testid="gpt-4"]'
      )?.firstChild;

      // button found successfully
      if (chatGPT4Button && !chatGPT4Button.disabled) {
        clearInterval(interval);

        if (loadingModalPortal) {
          loadingModalPortal.remove();
        }

        state.gpt4Button = chatGPT4Button;

        resolve();
      }

      const regenerateButton = [...document.querySelectorAll("div")].filter(
        (svg) => svg.innerText === "Regenerate"
      )[1];

      // This is the "unusual activity" message workaround
      if (regenerateButton) {
        if (loadingModalPortal) {
          loadingModalPortal.remove();
        }

        // wait for the button to be clickable
        setTimeout(() => {
          regenerateButton.click();

          clearInterval(interval);
        }, 1000);
      }

      const elapsedTime = Date.now() - startTime;

      // 5 seconds have passed or something else went wrong, either way, we need to stop trying to check for the button
      if (elapsedTime >= timeoutMillis) {
        if (loadingModalPortal) {
          loadingModalPortal.remove();
        }

        clearInterval(interval);

        reject(
          new Error(
            `It is possible your network is having problems loading the page within ${timeoutMillis} milliseconds if you are seeing this alert. In which case, you will need to either try again later once your network is more stable, or are on a network with a faster coonection.`
          )
        );
      }
    }, 100);
  });
};

const _clickChatGPT4Button = async () => {
  try {
    await _waitForChatGPT4Button();

    if (state.gpt4Button && !state.gpt4Button.disabled) {
      state.gpt4Button.click();
    }
  } catch (error) {
    alert(error);
  }
};

const submitQuestionToChatGPT = () => {
  const sendButton = document.querySelector('[data-testid="send-button"]');

  if (sendButton && !sendButton.disabled) {
    sendButton.click();

    state.shouldCleanUp = true;
  }
};

const _createLoadingModalPortal = () => {
  const existingLoadingModalPortal = document.querySelector(
    "#loadingModalPortal"
  );

  if (existingLoadingModalPortal) {
    return existingLoadingModalPortal;
  } else {
    const loadingModalPortal = document.createElement("div");

    loadingModalPortal.id = "loadingModalPortal";

    loadingModalPortal.innerHTML = `
			<div class="loading-modal">
				<div class="loading-modal-color-layer">
					<div class="progress-bar">
						<div class="progress-bar-text">Ask Chat GPT Chrome Extension - Loading</div>
							<span id="progress-bar-text"></span>
						<div class="progress-bar-fill">
						</div>
					</div>
				</div>
			</div>
		`;

    document.body.insertAdjacentElement("afterEnd", loadingModalPortal);

    return loadingModalPortal;
  }
};

const getRandomLeadInText = () => {
  const leadInList = [
    "Explain:",
    "Clarify:",
    "Elucidate:",
    "Analyze:",
    "Define:",
    "Explicate:",
    "Describe:",
    "Expound on:",
    "What does this mean?:",
    "Interpret:",
    "Break down:",
    "Unpack:",
    "Delineate:",
    "Give insight on:",
    "Shed light on:",
    "Detail:",
    "Outline:",
    "Illustrate:",
    "Provide an overview of:",
    "What's your take on:",
    "Can you detail:",
    "Discuss:",
    "Examine:",
    "Comment on:",
    "Decipher:",
    "Convey:",
    "Articulate:",
    "Enlighten us on:",
    "Demystify:",
    "Provide clarity on:",
    "Can you elaborate on:",
    "Give an explanation of:",
    "Help understand:",
    "What is the significance of:",
    "Provide context for:",
    "Can you interpret:",
    "Talk about:",
    "Unravel:",
  ];

  const randomIndex = Math.floor(Math.random() * leadInList.length);

  return leadInList[randomIndex];
};
