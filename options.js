document.addEventListener('DOMContentLoaded', function() {
  // 加载保存的设置
  loadSettings();
  
  // 保存设置按钮点击事件
  document.getElementById('save-settings').addEventListener('click', function() {
    saveSettings();
  });
  
  // 清除历史记录按钮点击事件
  document.getElementById('clear-history').addEventListener('click', function() {
    if (confirm('确定要清除所有聊天历史记录吗？此操作不可撤销。')) {
      chrome.storage.local.set({ chatHistory: {} }, function() {
        alert('历史记录已清除');
      });
    }
  });
  
  // 导出历史记录按钮点击事件
  document.getElementById('export-history').addEventListener('click', function() {
    exportHistory();
  });
  
  // 导入历史记录按钮点击事件
  document.getElementById('import-history').addEventListener('click', function() {
    importHistory();
  });
});

// 加载设置
function loadSettings() {
  chrome.storage.sync.get('settings', function(result) {
    const settings = result.settings || getDefaultSettings();
    
    // 设置深色模式
    document.getElementById('dark-mode').checked = settings.darkMode;
    
    // 设置保存历史记录
    document.getElementById('save-history').checked = settings.saveHistory;
  });
}

// 保存设置
function saveSettings() {
  // 获取深色模式设置
  const darkMode = document.getElementById('dark-mode').checked;
  
  // 获取保存历史记录设置
  const saveHistory = document.getElementById('save-history').checked;
  
  // 保存设置
  const settings = {
    darkMode,
    saveHistory,
    enabledModels: ['deepseek']
  };
  
  chrome.storage.sync.set({ settings }, function() {
    alert('设置已保存');
  });
}

// 获取默认设置
function getDefaultSettings() {
  return {
    darkMode: false,
    saveHistory: true,
    enabledModels: ['deepseek']
  };
}

// 导出历史记录
function exportHistory() {
  chrome.storage.local.get('chatHistory', function(result) {
    const chatHistory = result.chatHistory || {};
    
    // 创建下载链接
    const dataStr = JSON.stringify(chatHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'deepseek-chat-history-' + new Date().toISOString() + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  });
}

// 导入历史记录
function importHistory() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = e => {
    const file = e.target.files[0];
    
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    
    reader.onload = readerEvent => {
      try {
        const content = readerEvent.target.result;
        const parsedData = JSON.parse(content);
        
        chrome.storage.local.get('chatHistory', function(result) {
          const existingHistory = result.chatHistory || {};
          
          // 合并历史记录
          const mergedHistory = { ...existingHistory };
          
          Object.keys(parsedData).forEach(source => {
            if (!mergedHistory[source]) {
              mergedHistory[source] = [];
            }
            
            mergedHistory[source] = [
              ...mergedHistory[source],
              ...parsedData[source]
            ];
          });
          
          chrome.storage.local.set({ chatHistory: mergedHistory }, function() {
            alert('历史记录已导入');
          });
        });
      } catch (error) {
        alert('导入失败：' + error.message);
      }
    };
  };
  
  input.click();
} 