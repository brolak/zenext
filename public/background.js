
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
console.log('chrome', chrome);

var opt = {
  type: "basic",
  title: "Example title",
  message: "I can't believe it took 5 hours to make a simple notification",
  iconUrl: "./logo_small.png"
};

chrome.notifications.create("1",opt,function(){
	console.log(opt);
})

