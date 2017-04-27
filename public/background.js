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
	chrome.notifications.create(id,notification,function(){});
}

//initial welcome notification when extension loads
var welcomeUser = createNotification("Welcome to Zenext","Please login to continue","1");

//function for updating ext badge
var updateBadge = function(number){
	chrome.browserAction.setBadgeText({text: number});
}

//global temp data
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
	   			var ticket_refresh = setInterval(check_tickets, 10000);
	   		}
	});	
}

var loginRefresh = setInterval(checkLogin, 5000);

//prototype method for diffing response/temp ticket ids
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function check_tickets() {
	//get open/new and check response against localstorage
	var url = 'https://'+zendeskDomain+".zendesk.com/api/v2/search.json?query=type:ticket%20status:pending%20status:new";
	axios.get(url)
	.then(function (response) {
		//if response ticket count it larger than global previous count, reflect in storage, badge, globally
		if(newTickets < response.data.count){
	   		updateBadge(String(response.data.count));
	   		//check id's of response against global data
	   		//return index(es)
	   		//notify accordingly
	   		var newIds = [];
	   		var responseIds = [];
	   		var ticketIds = [];

	   		for(i=0;i<response.data.results.length;i++){
	   			responseIds.push(response.data.results[i].id);
	   		}
	   		// console.log("response ids",responseIds);

	   		for(j=0;j<ticketsArr.length;j++){
	   			ticketIds.push(ticketsArr[j].id)
	   		}
	   		// console.log("ticketids",ticketIds);
	   		
	   		newIds = responseIds.diff(ticketIds);
	   		// console.log("id(s) of new messages",newIds);

	   		if(newIds.length == 1){
	   			var newIndex = response.data.results.findIndex(result => result.id == newIds[0]);
	   			// console.log("new index",newIndex);
	   			// console.log("new data",response.data.results[newIndex]);
	   			var announceNewTicket = createNotification(
		   			"New Ticket Received:",
		   			response.data.results[newIndex].subject,
		   			response.data.results[newIndex].subject.id
	   			);
	   		} else if (newIds.length > 1) {
		   		var announceNewTickets = createNotification(
		   			"New Tickets Received:",
		   			"You have "+newIds.length+" new tickets.",
		   			response.data.results[0].subject.id
		   		)
	   		}
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