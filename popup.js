document.addEventListener('DOMContentLoaded', function() {
  const switchToJapaneseLink = document.getElementById('switchToJapanese');
  const switchToEnglishLink = document.getElementById('switchToEnglish');
  const statusElement = document.getElementById('status');

  // 現在のタブURLを取得し、ボタンの有効/無効を設定する
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentUrl = tabs[0].url;
    const isSpringDocSite = isSpringDocumentationSite(currentUrl);

    if (isSpringDocSite) {
      const isJapanese = currentUrl.includes('pleiades.io');
      // 現在のURLに基づいてリンクのhrefを設定
      if (!isJapanese) {
        const targetUrl = switchUrl(currentUrl, 'ja');
        switchToJapaneseLink.href = targetUrl;
        switchToJapaneseLink.style.opacity = '1';
        switchToJapaneseLink.style.pointerEvents = 'auto';
      } else {
        switchToJapaneseLink.href = '#';
        switchToJapaneseLink.style.opacity = '0.5';
        switchToJapaneseLink.style.pointerEvents = 'none';
      }
      
      if (isJapanese) {
        const targetUrl = switchUrl(currentUrl, 'en');
        switchToEnglishLink.href = targetUrl;
        switchToEnglishLink.style.opacity = '1';
        switchToEnglishLink.style.pointerEvents = 'auto';
      } else {
        switchToEnglishLink.href = '#';
        switchToEnglishLink.style.opacity = '0.5';
        switchToEnglishLink.style.pointerEvents = 'none';
      }
    } else {
      statusElement.textContent = 'Spring ドキュメントサイトではありません';
      switchToJapaneseLink.href = '#';
      switchToEnglishLink.href = '#';
      switchToJapaneseLink.style.opacity = '0.5';
      switchToEnglishLink.style.opacity = '0.5';
      switchToJapaneseLink.style.pointerEvents = 'none';
      switchToEnglishLink.style.pointerEvents = 'none';
    }
  });

  // 日本語サイトへ切り替え（左クリックのみ）
  switchToJapaneseLink.addEventListener('click', function(e) {
    if (e.button === 0 && switchToJapaneseLink.href !== '#') {
      // デフォルトのリンク動作を許可（現在のタブで開く）
      statusElement.textContent = '日本語サイトに切り替えています...';
    } else {
      e.preventDefault();
    }
  });

  // 英語サイトへ切り替え（左クリックのみ）
  switchToEnglishLink.addEventListener('click', function(e) {
    if (e.button === 0 && switchToEnglishLink.href !== '#') {
      // デフォルトのリンク動作を許可（現在のタブで開く）
      statusElement.textContent = '英語サイトに切り替えています...';
    } else {
      e.preventDefault();
    }
  });


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

  // Springのドキュメントサイトかどうかを判定
  function isSpringDocumentationSite(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('spring.io') || 
             urlObj.hostname.includes('spring.pleiades.io') ||
             urlObj.hostname.includes('docs.spring.io') ||
             urlObj.hostname.includes('docs.awspring.io') ||
             urlObj.hostname.includes('jakarta.ee');
    } catch (e) {
      return false;
    }
  }
});
