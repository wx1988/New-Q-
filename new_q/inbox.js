function unreadInboxCB(data){
    if(data === null){
        return;//API call failed!
    }

    //for every question found notify me only of all the desired new ones
    $.each(data.items,function(k,v){//for each of the questions returned

        var itemHash = JSON.stringify(v).hashCode();

        if($.inArray(itemHash, APP.viewedInboxItems) === -1){
            //if we haven't seen it yet and it has the right tags and none of the ignored ones
            //we'll pass the information needed to the html notification in the query string
            var notificationTemplate = (v.item_type === "careers_message" ? "careerNotification.html" : "inboxNotification.html");

            var notificationURL = notificationTemplate + "?title=" + encodeURIComponent(v.title) + "&url=" + encodeURIComponent(v.link) + "&logo_url=" + encodeURIComponent(v.site.favicon_url) + "&site_name=" + encodeURIComponent(v.site.name) + "&body=" + encodeURIComponent(v.body) + "&type=" + encodeURIComponent(v.item_type) + "&autoclose=" + APP.viewModel.autoclose;
            /*
               var notification = webkitNotifications.createHTMLNotification(notificationURL);
               console.log("Notification URL: " + notificationURL);
               notification.show();
             */

            APP.viewedInboxItems.push(itemHash);//add to to the list of inbox items we've already been notified of
            if(APP.viewedInboxItems.length > APP.MAX_LENGTH_VIEWED_INBOX_ITEMS_LIST){
                APP.viewedInboxItems.shift();
            }
        }
        else{
            console.log("Already read inbox item: " + itemHash);
        }
    });
}


function getUnreadInbox(){
    if(!APP.viewModel.token){
        console.log("No token");
        return;
    }

    if(!APP.viewedInboxItems){//if this is a new session
        APP.viewedInboxItems = localStorage.viewedInboxItems;//load from storage in string form
        if(!APP.viewedInboxItems){//we've never run the extension before
            APP.viewedInboxItems = [];//make a new place to keep inbox item hashes we've been to
        }
        else{
            APP.viewedInboxItems = JSON.parse(APP.viewedInboxItems);//convert to array
        }
    }

    var apiQueryPath = "inbox/unread";
    console.log("Getting the unread inbox items");

    //get the newest questions with these tags, note that tags should be seperated by %20 in the query
    $.getJSON(APP.API_URL + "/" + APP.API_VERSION +"/" + apiQueryPath ,
            { "key" : APP.API_KEY, "filter" : APP.INBOX_FILTER},
            unreadInboxCB);//end of API call for new inbox items

    localStorage.viewedInboxItems = JSON.stringify(APP.viewedInboxItems);//save changes
}


