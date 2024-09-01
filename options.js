// options.js

document.getElementById('save').addEventListener('click', () => {
    const title = document.getElementById('title').value.trim();
    const phrase = document.getElementById('phrase').value.trim();
  
    if (title && phrase) {
      chrome.storage.sync.get(['phrases'], (result) => {
        const phrases = result.phrases || {};
        phrases[title] = phrase;
        chrome.storage.sync.set({ phrases }, () => {
          document.getElementById('title').value = '';
          document.getElementById('phrase').value = '';
          renderPhrases();
        });
      });
    } else {
      alert("Por favor, preencha ambos os campos.");
    }
  });
  
  // Função para renderizar a lista de frases salvas
  function renderPhrases() {
    chrome.storage.sync.get(['phrases'], (result) => {
      const phrases = result.phrases || {};
      const list = document.getElementById('phraseList');
      list.innerHTML = '';
  
      for (const [key, value] of Object.entries(phrases)) {
        const li = document.createElement('li');
        li.textContent = `${key}: ${value} `;
        
        // Botão para remover a frase
        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remover";
        removeBtn.style.marginLeft = "10px";
        removeBtn.addEventListener('click', () => {
          delete phrases[key];
          chrome.storage.sync.set({ phrases }, () => {
            renderPhrases();
          });
        });
  
        li.appendChild(removeBtn);
        list.appendChild(li);
      }
    });
  }
  
  // Inicializa a lista ao carregar a página
  document.addEventListener('DOMContentLoaded', renderPhrases);
  