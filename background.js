// background.js

// Função para criar o menu de contexto
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "insertPhrase",
      title: "Inserir Frase",
      contexts: ["editable"]
    });
  
    // Atualizar o menu de contexto quando necessário
    updateContextMenu();
  });
  
  // Função para atualizar as opções do menu de contexto com as frases salvas
  function updateContextMenu() {
    chrome.storage.sync.get(['phrases'], (result) => {
      const phrases = result.phrases || {};
      
      // Remove todas as opções existentes para evitar duplicações
      chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
          id: "insertPhrase",
          title: "Inserir Frase",
          contexts: ["editable"]
        });
  
        // Adiciona cada frase como uma sub-opção
        for (const [key, value] of Object.entries(phrases)) {
          chrome.contextMenus.create({
            id: `phrase_${key}`,
            parentId: "insertPhrase",
            title: value,
            contexts: ["editable"]
          });
        }
      });
    });
  }
  
  // Listener para quando uma opção do menu de contexto é clicada
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId.startsWith("phrase_")) {
      const phraseKey = info.menuItemId.replace("phrase_", "");
      chrome.storage.sync.get(['phrases'], (result) => {
        const phrases = result.phrases || {};
        const phrase = phrases[phraseKey];
        if (phrase) {
          // Envia a frase para ser inserida no campo de texto
          chrome.tabs.sendMessage(tab.id, { type: "INSERT_PHRASE", phrase: phrase });
        }
      });
    }
  });
  
  // Listener para atualizar o menu quando as frases são alteradas
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.phrases) {
      updateContextMenu();
    }
  });
  