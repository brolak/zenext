chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
chrome.browserAction.setBadgeText({text: '0'});

var count = 0;

function setBadgeText() {
  chrome.browserAction.setBadgeText({text: String(count)});
  count = count + 1;
  if (count > 5){
    clearInterval(I);
  }
}

var I = setInterval(setBadgeText, 1000);

// user clicks on badge icon
// var clicks = 0;
//
// function increment() {
//   browser.browserAction.setBadgeText({text: (++clicks).toString()});
// }
//
// browser.browserAction.onClicked.addListener(increment);
