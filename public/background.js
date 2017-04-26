//badge set-up
chrome.browserAction.setBadgeBackgroundColor({ color: [#3398FF] });
chrome.browserAction.setBadgeText({text: '0'});
console.log(chrome);

//example notification
var opt = {
  type: "basic",
  title: "Welcome to Zenext",
  message: "Please login to begin...",
  iconUrl: "./logo_small.png"
};

chrome.notifications.create("1",opt,function(){
	console.log(opt);
})

