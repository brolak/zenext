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