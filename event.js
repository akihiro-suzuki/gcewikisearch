// mediawikiapiを使用して、選択テキストの意味を調べるchrome拡張
// やり取りがよくわからなかったので、localStorageを使用している
'use strict';
// 拡張機能がインストールされたときの処理
chrome.runtime.onInstalled.addListener(function(){

  // 親階層のメニューを生成
  const parent_menu = chrome.contextMenus.create({
    title: "「%s」の意味を調べる", 
    contexts:["selection"], // selectionにすると何かテキスト選択している場合のみコンテキストメニューが表示される
    id: "translate"
  });
});


chrome.contextMenus.onClicked.addListener(function(info, tab) {
    console.log(info);
    let encoded = encodeURIComponent(info.selectionText);
    let wikiUrl = "http://ja.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&formatversion=2&titles=" + encoded;
  
    var xhr = new XMLHttpRequest();
    xhr.open("GET", wikiUrl, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        // json を受け取る場合はparseしましょう
        var resp = JSON.parse(xhr.responseText);
        for(let data of resp.query.pages)
        {
          console.log(data.extract);
          localStorage["tmpExtract"] = data.extract;
          chrome.windows.create({
            top:300,
            left:300,
            url: "popup.html",
            type: 'popup',
            width: 300, height: 300,
            focused: true
          });
          break;
        }
        
      }
    }
    xhr.send();
});