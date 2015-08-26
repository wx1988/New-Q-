function nqCB(data, ignoredTags, site){
    if(data === null){
        return;//API call failed!
    }

    //for every question found notify me only of all the desired new ones
    $.each(data.items,function(k,v){//for each of the questions returned
        var hasIgnoredTags = false;
        var questionID = v.question_id;

        $.each(v.tags, function(k1,v1){//check all the tags in the question....
            var ignoredTagArray = [];
            ignoredTagArray = ignoredTags !== undefined ?  ignoredTags.split(" ") : [];
            $.each(ignoredTagArray, function(k2,v2){//..against ignored tags
                if(v1 === v2){
                    hasIgnoredTags = true;//found one!
                    console.log("Question " + questionID + " has ignored tag " + v2);
                    return;//and that's good enough
                }
            });
        });

        if(hasIgnoredTags){
            console.log("Skipping question " + questionID + " because it has an ignored tag");
            return;
        }

        if($.inArray("" + questionID, APP.viewedQuestions) === -1) {//if we haven't seen it yet display it
            console.log("New Q! " + questionID);
            //we'll pass the information needed to the html notification in the query string
            var notificationURL = "notification.html?title=" + encodeURIComponent(v.title) + "&url=" + encodeURIComponent(v.link) + + "&vote_count=" + v.score + "&answer_count=" + v.answer_count + "&view_count=" + v.view_count + "&tags=" + encodeURIComponent(JSON.stringify(v.tags)) + "&logo_url=" + encodeURIComponent(getSite(site).logo_url) + "&autoclose=" + APP.viewModel.autoclose;
            APP.questions.push({"question" : v, "site" : getSite(site)});
            if(APP.questions.length > APP.MAX_LENGTH_POPUP_LIST){
                APP.questions.shift();
            }
            /*
               var notification = webkitNotifications.createHTMLNotification(notificationURL);
               console.log("Notification URL: " + notificationURL);
               notification.show();
             */

            console.log("Adding question " + questionID + " to list of viewed questions");
            APP.viewedQuestions.push( "" + questionID);//add to to the list of questions we've already been notified of

            //Make sure the list doesn't get too long
            while(APP.viewedQuestions.length > APP.MAX_LENGTH_VIEWED_QUESTIONS_LIST){
                APP.viewedQuestions.shift();
            }
            localStorage.viewedQuestions = JSON.stringify(APP.viewedQuestions);
        }
        else{
            console.log("Skipping question " + questionID + " because we've seen it already.");
            return;
        }
    });
}

//Get the newest questions that matcha a given search profile
function getNewestQuestions(profile){
    if(!profile || !profile.site || !getSite(profile.site) || !profile.anyTags){
        console.warn("Invalid profile.");
        console.log(profile);
        return;
    }


    if(!APP.viewedQuestions){//if this is a new session
        console.log("New Session: Populating viewed question list");
        APP.viewedQuestions = localStorage.viewedQuestions;//load from storage in string form
        if(!APP.viewedQuestions){//we've never run the extension before
            console.log("First time running extension");
            APP.viewedQuestions = [];//make a new place to keep question IDs we've been to
            //load in question we've seen from history in the past couple days
            var lastFewDays = 259200000;//72 hours in milliseconds

            console.log("Checking last few days history to see what questions you've viewed");
            chrome.history.search({
                "text": getSite(profile.site).site_url, 
                "startTime" : new Date().getTime() - lastFewDays},
                function(items){return addToViewedQuestions(items, profile)});
            localStorage.viewedQuestions = JSON.stringify(APP.viewedQuestions);//save changes
        }
        else{
            APP.viewedQuestions = JSON.parse(APP.viewedQuestions);//convert to array
        }
    }

    var tags = profile.tags;
    var site = profile.site;
    var anyTags = profile.anyTags;
    var ignoredTags = profile.ignoredTags;

    var pageSize = 5;//how many questions to get from server
    var apiQueryPath = "questions";//which api method to use
    if(anyTags && tags.length > 0){ 
        apiQueryPath = "search";//See http://stackapps.com/questions/1024/and-searching-for-tags
    }
    var time = Math.round(new Date().getTime() / 1000)
        var dayAgo = time - APP.DAY;

    console.log("Checking history for questions asked on " + site.name + " since last check");
    chrome.history.search({"text": getSite(site).site_url, "startTime" : new Date().getTime() - APP.ITERATION_INTERVAL * 10},
            function(items){return addToViewedQuestions(items, profile)});//Check history to see what's been viewed since last run

    if(profile.lastRun){
        console.log("Checking for questions asked since last run:" + profile.lastRun);
    }
    else{
        console.log("Checking for questions asked in last day:" + dayAgo);
    }
    console.log("Checking " + getSite(site).name);

    var q_data = {
        "site" : getSite(site).api_site_parameter,
        "key" : APP.API_KEY,
        "sort" : "creation",
        "pagesize" : pageSize,
        "fromdate" : dayAgo,//profile.lastRun ? profile.lastRun : dayAgo,
        "tagged" : tags.split(' ').join(';')};

    //get the newest questions with these tags
    $.getJSON(APP.API_URL + "/" + APP.API_VERSION +"/" + apiQueryPath ,
            q_data, 
            function(data){
                nqCB(data, ignoredTags, site);
            });

    profile.lastRun = time;
}

