APP = {};   //Global variable container, across files

// Gets the site object reprenting an SE site for a given name
function getSite(name){
    if(typeof name === "object"){
        return name;
    }
    var toReturn;
    $.each(APP.viewModel.sites, function(key, value){
        if(value.name === name){
            toReturn = value;
            return;
        }
    });
    return toReturn;
}


init_APP();

//loadData();//load it now, possible old data

// the AUTH request
if(APP.viewModel.token != ""){
    authorizeAllAjaxCalls(APP.viewModel.token);
}


function addToViewedQuestions(historyItems, profile){
    console.log("Ran history check");
    for(var i = 0; i < historyItems.length; ++i){

        if(historyItems[i].url.startsWith(getSite(profile.site).site_url +"/questions")
                && $.inArray(historyItems[i].url.split("/")[4], APP.viewedQuestions) === -1){
                    if(typeof(historyItems[i].url.split("/")[4]) == "undefined"){
                        console.log("Why such URL retrievaled?");
                        console.log(historyItems[i].url.split("/"));
                    }else{
                        console.log("Adding: " + historyItems[i].url.split("/")[4]);
                        APP.viewedQuestions.push("" + historyItems[i].url.split("/")[4]);
                    }
                }
    }
}

// TODO, should separate the AUTH with un-AUTH
APP.viewedQuestions;//question ids already notified of; maintained between API calls
APP.viewedInboxItems;//hashes of inbox items we've already seen

// If the user logs in with OAuth authorize all future AJAX requests
function authorizeAllAjaxCalls(accessToken){
    console.log("Authorizing all future AJAX calls with token " + accessToken);
    $.ajaxSetup({data: {'access_token': accessToken}});
}


function getNewQuestionsForAllProfiles(){
    $.each(APP.viewModel.profiles, function(key, profile){
        getNewestQuestions(profile);
    });
}



$.each(APP.viewModel.profiles, function(key, profile){
    getNewestQuestions(profile);
});
getUnreadInbox();
getLatestReputationScore();

function go(){
    console.log("Starting...");
    APP.intervals.push(setInterval( 
                function(){getNewQuestionsForAllProfiles()}, 
                APP.ITERATION_INTERVAL));
    APP.intervals.push(setInterval( 
                function(){getUnreadInbox()}, 
                APP.ITERATION_INTERVAL));
    setInterval( function(){getLatestReputationScore()}, 
            APP.ITERATION_INTERVAL);//Never stop updating rep badge
}

go();

function stop(){
    console.log("Stopping...")
        while(APP.intervals.length > 0){
            clearInterval(APP.intervals.pop());
        }
}
