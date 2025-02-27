// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // 检查是否是DeepSeek聊天网站
    const url = new URL(tab.url);
    const domain = url.hostname;
    
    if (domain.includes('chat.deepseek.com')) {
      // 向标签页发送消息，通知内容脚本这是我们支持的网站
      chrome.tabs.sendMessage(tabId, { action: 'initializeChatExtraction' });
    }
  }
});

// 监听来自content.js的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveChatHistory') {
    const { source, conversation } = message;
    
    chrome.storage.local.get('chatHistory', (result) => {
      const chatHistory = result.chatHistory || {};
      
      if (!chatHistory[source]) {
        chatHistory[source] = [];
      }
      
      // 添加时间戳
      conversation.timestamp = new Date().toISOString();
      
      // 将新对话添加到历史记录中
      chatHistory[source].push(conversation);
      
      // 保存更新后的历史记录
      chrome.storage.local.set({ chatHistory });
    });
  }
}); 