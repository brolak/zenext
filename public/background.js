//badge set-up
chrome.browserAction.setBadgeBackgroundColor({ color: '#3398FF' });
chrome.browserAction.setBadgeText({text: '0'});


//welcome notification
var welcomeUser = function() {
	var welcome = {
  		type: "basic",
  		title: "Welcome to Zenext",
  		message: "Please login to begin...",
  		iconUrl: "./logo_small.png"
	}
	chrome.notifications.create("1",welcome,function(){
	//callback
	})
}

welcomeUser();

//local storage data

var store = {
	zendeskDomain: 'zenext' /*only for dev purpose*/,
	newCounter: 0,
	tickets: [],
	load: function() {
        var self = this;
        chrome.storage.local.get(null, function(store) {
            self.zendesk = store.zendesk || '';
            self.newCounter = store.newCounter || 0;
            self.tickets = store.tickets || [];
        });
    },
    save: function() {
        chrome.storage.local.set({
            'tickets': this.tickets,
            'zendesk': this.zendesk,
            'newCounter': this.newCounter
        });
    }
}

//api calls
//WORKING
// function get_current_user() {
//     var url = 'https://' + store.zendeskDomain +
//         '.zendesk.com/api/v2/users/me.json';
//     axios.get(url)
//     .then(function (response) {
//       console.log(response);
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }
// get_current_user();

function get_tickets() {
	var url = 'https://'+store.zendeskDomain+".zendesk.com/api/v2/search.json?query=type:ticket%20status:new";
	axios.get(url)
    .then(function (response) {
      console.log(response);
      chrome.storage.local.set({'store.newCounter': response.data.count},function(){
      	//callback
      });
      chrome.storage.local.get(null,function(storage){
    		console.log(storage);
      })
    })
    .catch(function (error) {
      console.log(error);
    });
}

get_tickets();


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

