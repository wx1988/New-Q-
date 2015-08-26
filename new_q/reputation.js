
// TODO, this is a AUTH request
function getLatestReputationScore(){
    if(!APP.viewModel.token){
        //console.log("No token");
        return;
    }
    
    console.log("Getting latest reputation score...");
    var repFilter = "!R04ewk2";
    if(APP.viewModel && APP.viewModel.badgeSite){
        $.getJSON(APP.API_URL + "/" + APP.API_VERSION +"/" + "me" ,
                {
                    "key" : APP.API_KEY,
            "filter" : repFilter,
            "site" : getSite(APP.viewModel.badgeSite).api_site_parameter
                },
                function(data){
                    if(data.items && data.items[0].reputation){
                        var score = parseInt(data.items[0].reputation, 10);
                        var rep = "" + score;
                        if(score > 9999){
                            score = score / 1000.0;
                            rep = ("" + score).substring(0, 4) + "k";
                        }
                        chrome.browserAction.setBadgeText({"text": rep});
                    }
                });
    } else {
        console.log("No site selected for reputation count.")
    }
}

