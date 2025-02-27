document.addEventListener('DOMContentLoaded', function() {
  // DeepSeek卡片点击事件
  document.getElementById('deepseek').addEventListener('click', function() {
    openModelTab('https://chat.deepseek.com/');
  });
});

// 打开模型标签页
function openModelTab(url) {
  chrome.tabs.query({url: url + '*'}, function(tabs) {
    if (tabs.length > 0) {
      // 如果已经有该模型的标签页，则切换到该标签页
      chrome.tabs.update(tabs[0].id, {active: true});
    } else {
      // 否则创建新标签页
      chrome.tabs.create({url: url});
    }
  });
} 