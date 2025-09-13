// バックグラウンドスクリプト
chrome.runtime.onInstalled.addListener(function() {
  console.log('Spring オンラインドキュメント英語日本語切り替え インストール完了');

  // contextMenus権限が必要なので、manifest.jsonに追加する必要があります
  if (chrome.contextMenus) {
    // インストール時にコンテキストメニュー項目を追加
    chrome.contextMenus.create({
      id: 'switchToJapanese',
      title: '日本語ドキュメントに切り替え',
      contexts: ['page'],
      documentUrlPatterns: [
        'https://spring.io/*',
        'https://docs.spring.io/*',
        'https://docs.awspring.io/*',
        'https://jakarta.ee/*'
      ]
    });

    chrome.contextMenus.create({
      id: 'switchToEnglish',
      title: 'Switch to English Documentation',
      contexts: ['page'],
      documentUrlPatterns: ['https://spring.pleiades.io/*']
    });
  }
});

// コンテキストメニューがクリックされた時の処理
if (chrome.contextMenus) {
  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    const currentUrl = tab.url;

    let newUrl = switchUrl(currentUrl, info.menuItemId === 'switchToJapanese' ? 'ja' : 'en');

    if (newUrl) {
      chrome.tabs.update(tab.id, {url: newUrl});
    }
  });
}

// URL切り替え関数
function switchUrl(currentUrl, targetLang) {
  const location = new URL(currentUrl);

  if (targetLang === 'ja') {
    // 英語から日本語への切り替え
    return 'https://spring.pleiades.io' + location.pathname + location.search + location.hash;
  } else {
    // 日本語から英語への切り替え
    if (location.pathname.match(/^\/spring-cloud-aws/)) {
      return 'https://docs.awspring.io' + location.pathname + location.search + location.hash;
    } else if (location.pathname.match(/^\/specifications/)) {
      return 'https://jakarta.ee' + location.pathname + location.search + location.hash;
    } else if (location.pathname.match(/^\/spring/)) {
      return 'https://docs.spring.io' + location.pathname + location.search + location.hash;
    } else {
      return 'https://spring.io' + location.pathname + location.search + location.hash;
    }
  }
}
