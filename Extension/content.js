console.log("updates done");

// MutationObserver to detect when Gmail compose window opens
const Observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);

    const hasComposedElement = addedNodes.some(node =>
      node.nodeType === Node.ELEMENT_NODE && (
        node.matches('.aDh, .btC, [role="dialog"]') ||
        node.querySelector('.aDh, .btC, [role="dialog"]')
      )
    );

    if (hasComposedElement) {
      console.log("Compose Window Detected");
      setTimeout(injectButton, 500);
    }
  }
});

Observer.observe(document.body, {
  childList: true,
  subtree: true
});

function injectButton() {
  const existingButton = document.querySelector('.ai-reply-btn');
  if (existingButton) existingButton.remove();

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("Toolbar not found");
    return;
  }

  console.log("Toolbar found, creating AI button...");
  const button = CreateAIbutton();
  button.classList.add('ai-reply-btn'); // ✅ fixed (was button.classList().add())

  button.addEventListener('click', async () => {
    try {
      button.innerHTML = 'Generating...';
      button.disabled = true;

      const emailContent = getEmailContent();
      const response = await fetch('http://localhost:8080/api/email/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emailContent: emailContent,
          tone: "professional"
        })
      });

      if (!response.ok) {
        throw new Error('API Request failed');
      }

      const generatedReply = await response.text();
      const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

      if (composeBox) {
        composeBox.focus();
        document.execCommand('insertText', false, generatedReply);
      } else {
        console.error('ComposeBox not found');
      }

    } catch (error) {
      alert("Failed to generate reply");
      console.error(error);
    } finally {
      button.innerHTML = 'AI Reply';
      button.disabled = false;
    }
  });

  toolbar.insertBefore(button, toolbar.firstChild);
}

function getEmailContent() {
  const selectors = [
    '.h7',
    '.a3s.aiL',
    '.gmail_quote',
    '[role="presentation"]'
  ];

  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) { // ✅ fixed (was `if(toolbar)`)
      return content.innerText.trim();
    }
  }

  return '';
}

function findComposeToolbar() {
  const selectors = [
    '.btC',
    '.aDh',
    '[role="toolbar"]',
    '.gU.Up'
  ];

  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) {
      return toolbar;
    }
  }

  return null;
}

function CreateAIbutton() {
  const button = document.createElement('div'); // ✅ fixed (was '.div')
  button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
  button.style.marginRight = '8px';
  button.innerHTML = 'AI Reply';
  button.setAttribute('role', 'button');
  button.setAttribute('data-tooltip', 'Generate AI Reply');
  return button;
}
