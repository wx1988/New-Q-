// Access attribute functions
function getLastBatchOfQuestions(){ return APP.questions; }
function apiVersion(){ return APP.API_VERSION;}
function apiKey(){ return APP.API_KEY;}
function apiURL(){ return APP.API_URL; }
function getIntervals(){ return APP.intervals; }


// Load data from the saved data on the 
function loadData(){
    if(localStorage.viewModel){
        APP.viewModel = JSON.parse(localStorage.viewModel);
    }
    else{
        APP.viewModel = {
            "token":"",
            "sites":[],
            "profiles":[],
            "badgeSite" : "",
            "autoclose" : true
        }
    }
}

function init_APP(){
    // Load the possible history data
    loadData();

    // TODO, move this into consts
    APP.questions = [];//stores data on all of the latest batch of new questions
    APP.API_VERSION = "2.1";
    APP.API_KEY = "Y0DdX5Qqfhkt2Sk7zpH14A((";
    APP.API_URL = "https://api.stackexchange.com";
    APP.ITERATION_INTERVAL = 60000;
    APP.HOUR = 3600;
    APP.DAY = 86400;
    APP.MAX_LENGTH_POPUP_LIST = 15;
    MAX_LENGTH_VIEWED_QUESTIONS_LIST = 1000;
    APP.MAX_LENGTH_VIEWED_INBOX_ITEMS_LIST = 1000;
    APP.INBOX_FILTER = "!)r0QK8ESzLBA7ymTobxE";
    
    // store the period request
    APP.intervals = [];
    
}
