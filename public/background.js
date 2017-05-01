//badge set-up
chrome.browserAction.setBadgeBackgroundColor({ color: '#D74A38' });

//function for updating extension badge
var updateBadge = function(number){
	chrome.browserAction.setBadgeText({text: String(number)});
}

//every 5 seconds check if a user is logged in
var checkLogin = function() {
	//if there is a domain in the local storage
	chrome.storage.local.get(null,function(storage){
			//call to refresh tickets
	   		if(storage.zendeskDomain){
	   			checkTickets(storage);
	   		} else {
	   		//otherwise clear storage and keep the badge empty
	   			chrome.storage.local.clear();
	      		updateBadge('');
	   		}
	});
}

var backgroundInterval = setInterval(checkLogin, 5*1000);

//prototype method for diffing response/local ticket ids
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

//hold id's of local/response to diff
//return only new ids
var diffTickets = function (responseTickets,storageTickets){
	var responseIds = [];
	var ticketIds = [];

	for(i=0;i<responseTickets.length;i++){
	    responseIds.push(responseTickets[i].ticket.id);
	}

	for(j=0;j<storageTickets.length;j++){
	   	ticketIds.push(storageTickets[j].ticket.id)
	}
	//return only new ids
	return responseIds.diff(ticketIds);
}

//function for checking if there's an open zendesk tab
var checkTab = function (storage) {
	//if so, try to acces it
	if(storage.tabId){
		console.log(storage.tabId,"there is a stored tab id")
		chrome.tabs.get(storage.tabId, function (tab){
	   		if(tab){
	   			console.log(tab,"and i can get it")
	   			return true;
	   		} else {
	   			//if failed, make a new zendesk tab 
				chrome.tabs.create({url:"https://zenext.zendesk.com/agent/"},function(newTab){
					//and save the id to storage for next check
					chrome.storage.local.set({tabId: newTab.id},function(){});
					console.log(newTab,"so i created new tab in storage")
				});
	   		}
	   	})
	} else {
		//if no stored tab id, make a new zendesk tab
		console.log("there was no stored tab")
		chrome.tabs.create({url:"https://zenext.zendesk.com/agent/"},function(newTab){
			//and save the id to storage for next check
			chrome.storage.local.set({tabId: newTab.id},function(){});
			console.log(newTab,"so i create new tab in storage")
		});
	}
}

function checkTickets(storage) {
	//get open+new and check response against localstorage
	var url = 'https://'+storage.zendeskDomain+'.zendesk.com/api/v2/views/148181329/execute.json?per_page=30&page=1&sort_by=id&sort_order=desc&group_by=+&include=via_id';
	axios.get(url)
	.then(function (response) {
		//if there are no tickets, empty badge
		if(response.data.count == 0){
			updateBadge("");
		}else {
		//otherwise change badge to reflect tickets
			updateBadge(response.data.count);
		}

		//if response ticket count it larger than stored count, notify accordingly
		if(storage.newTickets != 0 && storage.newTickets < response.data.count){
	   		//check if there is a stored tab id and it is accessable otherwise open new tab
			checkTab(storage);

	   		//store array of new ids
	   		var newIds = diffTickets(response.data.rows,storage.ticketsArr);
	   		
	   		//on 1 new ticket, put new ticket message in notification
	   		if(newIds.length == 1){
	   			var newIndex = response.data.rows.findIndex(result => result.ticket.id == newIds[0]);
				//first get ticket index based on new id
				console.log("new ticket",response.data.rows[newIndex].ticket);
				//set notification contents
				var options = {
						type: "basic",
					  	title: response.data.rows[newIndex].ticket.subject,
					  	message: response.data.rows[newIndex].ticket.description,
					  	iconUrl: "./logo_small.png"
				}
				chrome.notifications.create("newticket",options,function(cb){
					chrome.notifications.onClicked.addListener(function (cb){
						chrome.tabs.update(storage.tabId, {url:"https://zenext.zendesk.com/agent/tickets/"+response.data.rows[newIndex].ticket.id}, function (){})
					})
				})	
	   		//on multiple new tickets
	   		} else if (newIds.length > 1) {
	   			//set notification contents
				var options = {
						type: "basic",
					  	title: "New Tickets Received",
					  	message: "You have "+newIds.length+" new tickets.",
					 	iconUrl: "./logo_small.png"
				}
				chrome.notifications.create("newticket",options,function(cb){
					chrome.notifications.onClicked.addListener(function (cb){
						chrome.tabs.update(storage.tabId, {url:"https://zenext.zendesk.com/agent/filters"}, function (){})
					})
				})
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
