//badge set-up
chrome.browserAction.setBadgeBackgroundColor({ color: '#3398FF' });
chrome.browserAction.setBadgeText({text: '0'});

//create notification function
var createNotification = function(title,message,id) {
	var notification = {
  		type: "basic",
  		title: title,
  		message: message,
  		iconUrl: "./logo_small.png"
	}
	chrome.notifications.create(id,notification,function(){
	//callback
	})
}

var welcomeUser = createNotification("Welcome to Zenext","Please login to continue","1");

//function for updating ext badge
var updateBadge = function(number){
	chrome.browserAction.setBadgeText({text: number});
}

//TEMP DATA
var zendeskDomain = "";
var newTickets = 0;
var ticketsArr = [];

var checkLogin = function() {
	//if there is a domain in the local storage
	//start refreshing for tickets
	//and clear the login check interval
	chrome.storage.local.get(null,function(storage){
	   		if(storage.zendeskDomain){
	   			zendeskDomain = storage.zendeskDomain;
	   			ticketsArr = storage.ticketsArr;
	   			newTickets = storage.newTickets;
	   			clearInterval(loginRefresh);
	   			var ticket_refresh = setInterval(check_tickets, 30000);
	   		}
	});	
}

var loginRefresh = setInterval(checkLogin, 5000);

function check_tickets() {
	//get open/new and check response against localstorage
	var url = 'https://'+zendeskDomain+".zendesk.com/api/v2/search.json?query=type:ticket%20status:pending%20status:new";
	axios.get(url)
	.then(function (response) {
		console.log(response.data);
		//if response ticket count it larger, reflect in storage and badge
		if(newTickets < response.data.count){
	   		console.log("there's a new ticket");
	   		updateBadge(String(response.data.count));
	   		var announceNewTicket = createNotification(
	   			response.data.results[0].subject,
	   			"you have a new ticket",
	   			response.data.results[0].subject.id
	   			);
	   	}
		
	    chrome.storage.local.set({
	    	'newTickets': response.data.count,
	    	'ticketsArr': response.data.results
	    },function(){
	    	//callback
	    });
	    newTickets = response.data.count;
	    ticketsArr = response.data.results;
	    
	})
	.catch(function (error) {
	      console.log(error);
	});
}