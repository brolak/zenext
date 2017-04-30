//badge set-up
chrome.browserAction.setBadgeBackgroundColor({ color: '#D74A38' });

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

//every x seconds check if a user is logged in
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

var backgroundInterval = setInterval(checkLogin, 5000);

//prototype method for diffing response/local ticket ids
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function checkTickets(storage) {
	//get open+new and check response against localstorage
	var url = 'https://'+storage.zendeskDomain+'.zendesk.com/api/v2/views/148181329/execute.json?per_page=30&page=1&sort_by=id&sort_order=desc&group_by=+&include=via_id';
	axios.get(url)
	.then(function (response) {
		updateBadge(String(response.data.count));
		//if response ticket count it larger than stored count... store, badge change, and notify
		if(storage.newTickets != 0 && storage.newTickets < response.data.count){
	   		//hold id's of local/response to diff
	   		var newIds = [];
	   		var responseIds = [];
	   		var ticketIds = [];
				console.log
	   		for(i=0;i<response.data.rows.length;i++){
	   			responseIds.push(response.data.rows[i].ticket.id);
	   		}

	   		for(j=0;j<storage.ticketsArr.length;j++){
	   			ticketIds.push(storage.ticketsArr[j].ticket.id)
	   		}
	   		//return only new ids
	   		newIds = responseIds.diff(ticketIds);

	   		//on 1 new ticket, put new ticket message in notification
	   		if(newIds.length == 1){
	   			var newIndex = response.data.rows.findIndex(result => result.ticket.id == newIds[0]);
					console.log('new index',newIndex)
	   			var announceNewTicket = createNotification(
		   			response.data.rows[newIndex].ticket.subject,
		   			response.data.rows[newIndex].ticket.description,
						"one ticket"
	   			);
	   		//on multiple new tickets, indicate amount in notification
	   		} else if (newIds.length > 1) {
		   		var announceNewTickets = createNotification(
		   			"New Tickets Received:",
		   			"You have "+newIds.length+" new tickets.",
		   			"batch ticket"
		   		)
	   		}
	   	}
		//always change local storage to reflect response
	    chrome.storage.local.set({'newTickets': response.data.count,'ticketsArr': response.data.rows},function(){
	    	//it's not just gonna happen like that
	    	//i aint no call-a-back girl
	    });
	})
	.catch(function (error) {
	      console.log(error);
	});
}
