// content.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "INSERT_PHRASE") {
      const phrase = request.phrase;
      const activeElement = document.activeElement;
  
      if (activeElement && (activeElement.tagName === 'TEXTAREA' || (activeElement.tagName === 'INPUT' && activeElement.type === 'text'))) {
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        const text = activeElement.value;
        activeElement.value = text.slice(0, start) + phrase + text.slice(end);
        
        // Opcional: reposicionar o cursor após a inserção
        activeElement.selectionStart = activeElement.selectionEnd = start + phrase.length;
      }
    }
  });
  