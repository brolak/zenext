//badge set-up
chrome.browserAction.setBadgeBackgroundColor({ color: '#3398FF' });
chrome.browserAction.setBadgeText({text: '0'});

var updateBadge = function(number){
	chrome.browserAction.setBadgeText({text: number});
}
//welcome notification
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


//local storage data
var zendeskDomain = "zenext";
var newTickets = 0;
var ticketsArr = [];

//get open/new and check response against localstorage
function check_tickets() {
	var url = 'https://'+zendeskDomain+".zendesk.com/api/v2/search.json?query=type:ticket%20status:new";
	axios.get(url)
    .then(function (response) {
      console.log(response);
      chrome.storage.local.set({'newCounter': response.data.count},function(){
      	//callback
      });
      chrome.storage.local.get(null,function(storage){
    	console.log(storage);
      })
      var announceFirstTicket = createNotification(response.data.results[0].subject,"you have a new ticket",response.data.results[0].subject.id);

    })
    .catch(function (error) {
      console.log(error);
    });
}

check_tickets();


//code examples:
// //local storage settings
// var settings = {
// 	zendeskDomain: '',
// 	viewID: null,
//     load: function(callback) {
//         var self = this;
//         chrome.storage.local.get(null, function(loadedSettings) {
//             self.zendeskDomain = loadedSettings.zendeskDomain || '';
//             if (callback) {
//                 callback();
//             }
//             console.log("Settings loaded");
//         });
//     },
//     save: function() {
//         chrome.storage.local.set({
//             'zendeskDomain': this.zendeskDomain,
//             'viewID': this.viewID,
//             'userID': this.userID
//         });
//         console.log("Settings saved");
//         chrome.storage.local.set({'zendeskDomain': this.input})
//     }
// }

// function createTicket (ticketID,subject,created_at,description,url,status) {
// 	   this.ID = ticketID,
//     this.subject = subject,
//     this.created_at = created_at,
//     this.description = description,
//     this.url = url,
//     this.status = status
// }

// var example_ticket = new createTicket("id","subject","createdat","descr","http://","mystatus");
// console.log(example_ticket);

// //local storage tickets
// var tickets = {
// 	ticketsList: [],
// 	load: function() {
//         var self = this;
//         chrome.storage.local.get(null, function(tickets) {
//             self.tickets = tickets || [];
//         });
//     },
//     save: function() {
//         chrome.storage.local.set({
//             'ticketList': this.ticketList,
//         });
//         console.log("tickets saved");
//     }
// }

// function get_tickets() {
//     model.currentlyMakingRequest = true;
//     model.numRequestsTotal += 1;

//     var url = 'https://' + settings.zendeskDomain +
//     ".zendesk.com/api/v2/exports/tickets.json?start_time=0&per_page=100";

//     // return $.getJSON(url);
// }

// // Load settings, then get ticket audit and user details
// settings.load(/*get_tickets_and_details*/);
// tickets.load();
// // update_time();

// // save settings when popup closes
// chrome.runtime.onConnect.addListener(function(port) {
//     port.onDisconnect.addListener(function() {
//         console.log('Popup closed');
//         tickets.save();
//     });
// });

