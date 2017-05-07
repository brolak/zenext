//badge set-up
chrome.browserAction.setBadgeBackgroundColor({ color: '#D74A38' });

//function for updating extension badge
var updateBadge = function(number){
	chrome.browserAction.setBadgeText({text: String(number)});
}

//before any api calls first check if user is logged in
var checkLogin = function() {
	chrome.storage.local.get(null,function(storage){
		//if there is a domain in the local storage
		/* Put in check for online/offline?*/
	   		if(storage.zendeskDomain && storage.defaultViewID){
	   	//call to get+check tickets
	   			checkTickets(storage);
	   		} else {
	   	//otherwise clear storage and keep the badge empty
	   			chrome.storage.local.clear();
	      		updateBadge('');
	   		}
	});
}

//every 8 seconds run ticket refresh - starting with user check
var backgroundInterval = setInterval(checkLogin, 3*1000);

//prototype method for diffing response/local ticket ids
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};
//use of diff on api response and stored tickets
var diffTickets = function (responseTickets,storageTickets){
	var responseIds = [];
	var ticketIds = [];
	for(i=0;i<responseTickets.length;i++){
	    responseIds.push(responseTickets[i].ticket.id);
	}
	for(j=0;j<storageTickets.length;j++){
	   	ticketIds.push(storageTickets[j].ticket.id)
	}
	//return array of new ids
	return responseIds.diff(ticketIds);
}


//function for finding/opening new zendesk tab
//for use in chrome notification
var findAndOpenTab = function(ticketId,viewID) {
	var st;
	chrome.tabs.getAllInWindow(null, function(cb){
		chrome.storage.local.get(null,function(storage){
			st=storage.zendeskDomain;
		})
	//regex to find matching url
		var re = /zendesk\.com\/agent\//
	//return first tab that matches dashboard url
		var tab = cb.filter(function ( obj ) {
	 	   	return obj.url.match(re);
		})[0];
	//if that tab exists
		if(tab){
	//and there's multiple new tickets
			if(ticketId == null){
	//open that window & tab
				chrome.tabs.update(tab.id, {active:true}, function (cb){
					chrome.windows.update(cb.windowId, {focused: true});
				})
			} else if(ticketId) {
	//if it's just one ticket, update existing tab to ticket url and open window/tab
				chrome.tabs.update(tab.id, {url:"https://"+st+".zendesk.com/agent/tickets/"+ticketId, active:true}, function (cb){
					chrome.windows.update(cb.windowId, {focused: true});
				})
			}
		} else {
	//if tab not found
			if(ticketId == null){
	//create a new one and open it at dashboard (multiple ticket case)
				chrome.tabs.create({url:"https://"+st+".zendesk.com/agent/filters/"+viewID, active:true}, function (cb){
					chrome.windows.update(cb.windowId, {focused: true});
				})
			}else if(ticketId){
	//or create new one with ticket url and open
				chrome.tabs.create({url:"https://"+st+"zendesk.com/agent/tickets/"+ticketId, active:true}, function (cb){
					chrome.windows.update(cb.windowId, {focused: true});
				})
			}
		}
	});
}

var createNotification = function(notification) {
	//arguments: title, message, id, viewID, ticketID
	//first set notification options
	var options = {
		type: "basic",
		title: notification.title,
		message: notification.message,
		iconUrl: "./logoNotifications.png"
	}
	//create notification with click function that does tab check/open
	chrome.notifications.create(notification.id,options,function(){});
	chrome.notifications.onClicked.addListener(function click(){
		findAndOpenTab(notification.ticketID,notification.viewID);
	//when notification is clicked or closed, remove the function so it doesn't stack
		chrome.notifications.onClicked.removeListener(click);
		chrome.notifications.onClosed.removeListener(click);
	})
}
// create the audio object
var myAudio = new Audio();
// assign the audio file to its src
myAudio.src = "./button_click.mp3";


var checkTickets = function (storage) {
	//use domain and viewid for api GET request
	var url = 'https://'+storage.zendeskDomain+'.zendesk.com/api/v2/views/'+storage.defaultViewID+'/execute.json?per_page=30&page=1&sort_by=id&sort_order=desc&group_by=+&include=via_id';
	axios.get(url)
	.then(function (response) {
		//if there are no tickets
		if(response.data.count == 0){
		//empty badge
			updateBadge("");
		} else {
		//otherwise set badge to ticket #
			updateBadge(response.data.count);
		}
		//check if user wants notifications
		if(storage.notificationSetting < 2){
			//if response ticket count it larger than stored count, notify accordingly
			if(storage.newTickets < response.data.count){

				if (storage.notificationSetting == 0 ) {
						myAudio.play();    // play the music
					};
		//first find out how many new tickets there are,
				var newIds = diffTickets(response.data.rows,storage.ticketsArr);
		//on 1 new ticket
				if(newIds.length == 1){
		//find new ticket
					var newIndex = response.data.rows.findIndex(result => result.ticket.id == newIds[0]);
		//use that ticket's info in notification
					createNotification({
						ticketID: String(response.data.rows[newIndex].ticket.id),
						id: "single",
						title: response.data.rows[newIndex].ticket.subject,
						message: response.data.rows[newIndex].ticket.description,
						viewID: storage.defaultViewID
					});
		//on multiple new tickets
				} else if (newIds.length > 1) {
		//notify with number of new tickets
					createNotification({
						ticketID: null,
						id: "multiple",
						title: "New Tickets Received",
						message: "You have "+newIds.length+" new tickets.",
						viewID: storage.defaultViewID
					});
				}

			}
		}
		//after api call, always change local storage to reflect response
		chrome.storage.local.set({'online':true ,'newTickets': response.data.count,'ticketsArr': response.data.rows ,'requestersArr':response.data.users},function(){});
	})
	.catch(function (error) {
		chrome.storage.local.set({'online':false},function(){});
		console.log(error);
	});
}
