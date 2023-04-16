// Function to get + decode API key
const getKey = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['openai-key'], (result) => {
        if (result['openai-key']) {
          const decodedKey = atob(result['openai-key']);
          resolve(decodedKey);
        }
      });
    });
  };

  const sendMessage = (content) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0].id;
  
      chrome.tabs.sendMessage(
        activeTab,
        { message: 'inject', content },
        (response) => {
          if (response.status === 'failed') {
            console.log('injection failed.');
          }
        }
      );
    });
  };

const generate = async (prompt) => {
  // Get your API key from storage
  const key = await getKey();
  const url = 'https://api.openai.com/v1/completions';
	
  // Call completions endpoint
  const completionResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 1250,
      temperature: 0.7,
    }),
  });
	
  // Select the top choice and send back
  const completion = await completionResponse.json();
  return completion.choices.pop();
}

const generateCompletionAction = async (info) => {
    try {
      const { selectionText } = info;
      const basePromptPrefix = `
      Write me a concise output with the requirements given below in title.
  
      Title:
      `;

      const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`);

      const secondPrompt = `
      Take the input below and give me a more impressive answer.
      
      Title: ${selectionText}
      
      input: ${baseCompletion.text}
      
      Answer:
      `;

    // Call your second prompt
    const secondPromptCompletion = await generate(secondPrompt);
    sendMessage(secondPromptCompletion.text);

    } catch (error) {
      console.log(error);

      sendMessage(error.toString());
    }
  };

// Don't touch this
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'context-run',
    title: 'ConWay',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(generateCompletionAction);


// const getKey = () => {
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.get(['openai-key'], (result) => {
//       if (result['openai-key']) {
//         const decodedKey = atob(result['openai-key']);
//         resolve(decodedKey);
//       }
//     });
//   });
// };

// const sendMessage = (content) => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const activeTab = tabs[0].id;

//     chrome.tabs.sendMessage(
//       activeTab,
//       { message: 'inject', content },
//       (response) => {
//         if (response.status === 'failed') {
//           console.log('injection failed.');
//         }
//       }
//     );
//   });
// };

// const generate = async (prompt) => {
//   // Get your API key from storage
//   const key = await getKey();
//   const url = 'https://api.openai.com/v1/completions';

//   // Call completions endpoint
//   const completionResponse = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${key}`,
//     },
//     body: JSON.stringify({
//       model: 'text-davinci-003',
//       prompt: prompt,
//       max_tokens: 1250,
//       temperature: 0.7,
//     }),
//   });

//   // Select the top choice and send back
//   const completion = await completionResponse.json();
//   return completion.choices.pop();
// };

// const generateCompletionAction = async (input) => {
//   try {
//     const basePromptPrefix = `
//     Write me a concise output with the requirements given below in title.

//     Title:
//     `;

//     const baseCompletion = await generate(`${basePromptPrefix}${input}`);

//     const secondPrompt = `
//     Take the input below and give me a more impressive answer.
    
//     Title: ${input}
    
//     input: ${baseCompletion.text}
    
//     Answer:
//     `;

//     // Call your second prompt
//     const secondPromptCompletion = await generate(secondPrompt);
//     sendMessage(secondPromptCompletion.text);
//   } catch (error) {
//     console.log(error);
//     sendMessage(error.toString());
//   }
// };

// // Set up omnibox listener
// chrome.omnibox.onInputEntered.addListener((text) => {
//   if (text.toLowerCase().startsWith('conway ')) {
//     const input = text.substring(7);
//     generateCompletionAction(input);
//   }
// });
