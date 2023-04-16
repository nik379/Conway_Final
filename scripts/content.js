// Declare new function
const insert = (content) => {
    // Find Calmly editor input section
let elements1 = document.getElementsByClassName('ql-editor'); //linkedin
let elements2 = document.getElementsByClassName('droid'); //calmly
let elements3 = document.getElementsByClassName('CodeMirror-lines'); //github readme
let elements4 = document.getElementsByClassName('Am Al editable LW-avf tS-tW tS-tY'); //gmail
let elements5 = document.getElementsByClassName('section-inner sectionLayout--insetColumn'); //medium
let elements6 = document.getElementsByClassName('doc'); //not working
let elements7 = document.getElementsByClassName('notranslate public-DraftEditor-content'); //not working
let elements8 = document.getElementsByClassName('kix-canvas-tile-content'); //not working


const elementsArray = [elements1, elements2, elements3, elements4, elements5, elements6, elements7, elements8];

for(let i = 0; i < elementsArray.length; i++) {
  if(elementsArray[i].length > 0) {
    elements = elementsArray[i];
  }
}
// const classes = document.getElementsByTagName('*');
// const className = 'my-class';
// let elements;

// for (let i = 0; i < classes.length; i++) {
//   const cls = classes[i];
//   if (cls.classList.contains('droid')) {
//      elements = document.getElementsByClassName('droid');
//   }
//   else if (cls.classList.contains('notranslate public-DraftEditor-content')) {
//      elements = document.getElementsByClassName('notranslate public-DraftEditor-content');
//   }
//   else if(cls.classList.contains('view-line')) {
//      elements = document.getElementsByClassName('view-line');
//   }
//   else if(cls.classList.contains('editable ')) {
//      elements = document.getElementsByClassName('editable');
//   }
//   else if(cls.classList.contains('ql-editor')) {
//      elements = document.getElementsByClassName('ql-editor');
//   }
//   else {
//     elements = document.getElementsByClassName('doc');
//   }
// }


if (elements.length === 0) {
  return;
}

const element = elements[0];

 // Grab the first p tag so we can replace it with our injection
const pToRemove = element.childNodes[0];
pToRemove.remove();
  
 // Split content by \n
const splitContent = content.split('\n');
  
// Wrap in p tags
splitContent.forEach((content) => {
    const p = document.createElement('p');
  
    if (content === '') {
      const br = document.createElement('br');
      p.appendChild(br);
    } else {
      p.textContent = content;
    }
  
    // Insert into HTML one at a time
    element.appendChild(p);
  });
  
    // On success return true
    return true;
  };

chrome.runtime.onMessage.addListener(
  // This is the message listener
  (request, sender, sendResponse) => {
    if (request.message === 'inject') {
      const { content } = request;
			
      // Call this insert function
      const result = insert(content);
			
      // If something went wrong, send a failed status
      if (!result) {
        sendResponse({ status: 'failed' });
      }

      sendResponse({ status: 'success' });
    }
  }
);