//badge set-up
chrome.browserAction.setBadgeBackgroundColor({ color: '#3398FF' });

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

//function for updating extension badge
var updateBadge = function(number){
	chrome.browserAction.setBadgeText({text: number});
}

//every 10 seconds check if a user is logged in
var checkLogin = function() {
	//if there is a domain in the local storage
	chrome.storage.local.get(null,function(storage){
			//call to refresh tickets
	   		if(storage.zendeskDomain){
	   			checkTickets(storage);
	   		} else {
	   		//otherwise clear storage and keep the badge empty
	   			chrome.storage.local.clear();
	      		updateBadge('0');
	   		}
	});
}

var backgroundInterval = setInterval(checkLogin, 10000);

//prototype method for diffing response/local ticket ids
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function checkTickets(storage) {
	//get open+new and check response against localstorage
	var url = 'https://'+storage.zendeskDomain+".zendesk.com/api/v2/search.json?query=type:ticket%20status:open%20status:new";
	axios.get(url)
	.then(function (response) {
		//if response ticket count it larger than stored count... store, badge change, and notify
		if(storage.newTickets < response.data.count){
	   		updateBadge(String(response.data.count));
	   		//hold id's of local/response to diff
	   		var newIds = [];
	   		var responseIds = [];
	   		var ticketIds = [];

	   		for(i=0;i<response.data.results.length;i++){
	   			responseIds.push(response.data.results[i].id);
	   		}

	   		for(j=0;j<storage.ticketsArr.length;j++){
	   			ticketIds.push(storage.ticketsArr[j].id)
	   		}
	   		//return only new id's
	   		newIds = responseIds.diff(ticketIds);

	   		//on 1 new ticket, put new ticket message in notification
	   		if(newIds.length == 1){
	   			var newIndex = response.data.results.findIndex(result => result.id == newIds[0]);
	   			var announceNewTicket = createNotification(
		   			response.data.results[newIndex].subject,
		   			response.data.results[newIndex].description,
		   			response.data.results[newIndex].subject.id
	   			);
	   		//on multiple new tickets, indicate amount in notification
	   		} else if (newIds.length > 1) {
		   		var announceNewTickets = createNotification(
		   			"New Tickets Received:",
		   			"You have "+newIds.length+" new tickets.",
		   			response.data.results[0].subject.id
		   		)
	   		}
	   	}
		//always change local storage to reflect response
	    chrome.storage.local.set({'newTickets': response.data.count,'ticketsArr': response.data.results},function(){
	    	//it's not just gonna happen like that
	    	//i aint no call-a-back girl
	    });

	})
	.catch(function (error) {
	      console.log(error);
	});
}
