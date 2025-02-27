// 确定当前网站
let currentSite = 'deepseek';

// 监听来自background.js的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'initializeChatExtraction') {
    // 初始化聊天提取
    initializeChatExtraction();
  }
});

// 初始化聊天提取
function initializeChatExtraction() {
  extractDeepSeekChat();
}

// DeepSeek聊天内容提取函数
function extractDeepSeekChat() {
  // 使用MutationObserver监听DOM变化
  const observer = new MutationObserver((mutations) => {
    // 这里实现提取DeepSeek聊天内容的逻辑
    try {
      // 查找聊天消息容器
      const chatContainer = document.querySelector('.conversation-container') || 
                           document.querySelector('.chat-messages') ||
                           document.querySelector('.message-list');
      
      if (chatContainer) {
        // 提取聊天消息
        const messages = [];
        const messageElements = chatContainer.querySelectorAll('.message, .chat-message, .conversation-item');
        
        messageElements.forEach(element => {
          // 判断消息类型（用户或AI）
          const isUser = element.classList.contains('user-message') || 
                        element.classList.contains('user') ||
                        element.querySelector('.user-avatar');
          
          // 获取消息内容
          const contentElement = element.querySelector('.message-content') || 
                               element.querySelector('.content') ||
                               element;
          
          if (contentElement) {
            messages.push({
              role: isUser ? 'user' : 'assistant',
              content: contentElement.textContent.trim()
            });
          }
        });
        
        // 如果有消息，保存聊天历史
        if (messages.length > 0) {
          saveChatHistory({
            messages: messages,
            title: document.title
          });
        }
      }
    } catch (error) {
      console.error('提取DeepSeek聊天内容时出错:', error);
    }
  });
  
  // 开始观察
  observer.observe(document.body, { childList: true, subtree: true });
}

// 保存聊天历史
function saveChatHistory(conversation) {
  chrome.runtime.sendMessage({
    action: 'saveChatHistory',
    source: currentSite,
    conversation
  });
} 