document.addEventListener('DOMContentLoaded', function() {
  // 加载历史记录
  loadChatHistory('deepseek');
  
  // 搜索功能
  document.getElementById('search-input').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    loadChatHistory('deepseek', searchTerm);
  });
});

// 加载聊天历史
function loadChatHistory(source, searchTerm = '') {
  chrome.storage.local.get('chatHistory', (result) => {
    const chatHistory = result.chatHistory || {};
    const historyList = document.getElementById('history-list');
    
    // 清空历史列表
    historyList.innerHTML = '';
    
    // 获取DeepSeek历史记录
    let filteredHistory = [];
    
    if (chatHistory[source]) {
      filteredHistory = chatHistory[source].map(item => ({
        ...item,
        source
      }));
    }
    
    // 按时间戳排序（最新的在前面）
    filteredHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // 如果有搜索词，进行过滤
    if (searchTerm) {
      filteredHistory = filteredHistory.filter(item => {
        // 搜索标题
        if (item.title && item.title.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // 搜索消息内容
        if (item.messages && Array.isArray(item.messages)) {
          return item.messages.some(msg => 
            msg.content && msg.content.toLowerCase().includes(searchTerm)
          );
        }
        
        return false;
      });
    }
    
    // 渲染历史记录
    filteredHistory.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      const date = new Date(item.timestamp);
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      
      historyItem.innerHTML = `
        <div class="history-header">
          <span class="history-source">DeepSeek</span>
          <span class="history-timestamp">${formattedDate}</span>
        </div>
        <div class="history-content">
          ${formatConversation(item)}
        </div>
      `;
      
      historyList.appendChild(historyItem);
    });
    
    // 如果没有历史记录，显示提示
    if (filteredHistory.length === 0) {
      historyList.innerHTML = '<div class="empty-history">没有找到历史记录</div>';
    }
  });
}

// 格式化对话内容
function formatConversation(item) {
  let formattedContent = '';
  
  if (item.messages && Array.isArray(item.messages)) {
    item.messages.forEach(msg => {
      const role = msg.role === 'user' ? '用户' : 'AI';
      formattedContent += `<p><strong>${role}:</strong> ${msg.content}</p>`;
    });
  } else if (typeof item.content === 'string') {
    formattedContent = `<p>${item.content}</p>`;
  }
  
  return formattedContent;
} 