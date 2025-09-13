// Springドキュメントサイト上でのコンテンツスクリプト
(function() {
  // ページ上部に言語切替リンクを追加する
  function addLanguageSwitchButton() {
    // 既にリンクが存在する場合は追加しない
    if (document.getElementById('language-switch-btn')) {
      return;
    }

    // 現在のURLから言語を判定
    const isJapanese = window.location.hostname.includes('pleiades.io');

    // サイトに基づいて最適な位置を決定
    const positionRight = calculateOptimalPosition();

    // リンク作成
    const link = document.createElement('a');
    link.id = 'language-switch-btn';
    link.textContent = isJapanese ? 'English' : '日本語';
    
    // URLを設定
    const targetUrl = switchUrl(window.location.href, isJapanese ? 'en' : 'ja');
    link.href = targetUrl || '#';

    // インラインスタイル設定
    link.style.cssText = `
      position: fixed;
      top: 0;
      right: ${positionRight}px;
      z-index: 9999;
      padding: 2px 6px;
      background-color: #3f7ad6;
      color: white;
      border: none;
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
      font-size: 11px;
      cursor: pointer;
      opacity: 0.85;
      box-shadow: 0 1px 2px rgba(0,0,0,0.2);
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-block;
    `;

    // ホバー効果
    link.addEventListener('mouseover', function() {
      this.style.opacity = '1';
      this.style.backgroundColor = '#2a5ca0';
    });

    link.addEventListener('mouseout', function() {
      this.style.opacity = '0.85';
      this.style.backgroundColor = '#3f7ad6';
    });

    // 左クリックのみ許可（右クリックメニューは通常のリンクと同じ）
    link.addEventListener('click', function(e) {
      if (e.button === 0) {
        // 左クリックの場合は通常のリンク動作（現在のタブで開く）
        return true;
      } else {
        // その他のクリックは無視
        e.preventDefault();
        return false;
      }
    });

    // 本体にリンク追加
    document.body.appendChild(link);
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

  // リンクの位置を計算
  function calculateOptimalPosition() {
    // 常に一定の位置に設定（10px）
    // 以前はサイトごとに異なる値（80pxや100px）を設定していましたが、
    // 一貫性のある位置に表示するため10pxに統一しました
    let rightPosition = 10;

    // ビューポート幅に応じて調整
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 768) { // モバイルサイズ
      rightPosition = Math.max(10, rightPosition - 10);
    }

    return rightPosition;
  }

  // ページ読み込み完了時にリンク追加
  if (document.readyState === 'complete') {
    addLanguageSwitchButton();
  } else {
    window.addEventListener('load', addLanguageSwitchButton);
  }

  // ウィンドウサイズ変更時にリンク位置を再調整
  window.addEventListener('resize', function() {
    const link = document.getElementById('language-switch-btn');
    if (link) {
      link.style.right = `${calculateOptimalPosition()}px`;
    }
  });
})();
