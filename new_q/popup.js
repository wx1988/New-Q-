var questions = chrome.extension.getBackgroundPage().getLastBatchOfQuestions();
console.log("questions");
console.log(questions);

if(questions.length >0){
    var tmp_str = "";
    for( var i = 0;i < questions.length;i++){
        var tmp1 = "<img src='"+ questions[i].site.favicon_url+"' title='"+questions[i].site.name +"' />";
        var tmp2 = "<a class='link' data-href='"+questions[i].question.link+"' href='#' style='font-size: small;'>"+questions[i].question.title+"</a>";
        tmp_str += "<tr><td>"+ tmp1 +"</td><td>"+tmp2+"</td></tr>"
    }
    $("#questions").html(tmp_str);
/*
    ko_questions = Array();
    for(var i = 0;i < questions.length;i++){
        ko_questions[i] = ko.mapping.fromJS(questions[i]);
    }
    questions = ko_questions;
    var viewModel = ko.mapping.fromJS( questions );
    //var viewModel = ko.mapping.fromJS( ko_questions );
    //var viewModel = ko.mapping.fromJS( questions );


    var tmp_options = {
        attribute: "data-bind",        // default "data-sbind"
        globals: window,               // default {}
        bindings: ko.bindingHandlers,  // default ko.bindingHandlers
        noVirtualElements: false       // default true
    };
    ko.bindingProvider.instance = new ko.secureBindingsProvider(tmp_options);

    ko.applyBindings(viewModel);*/
}else{
    $("#questions").html("No more questions");
}

$("#go").click(
    function(){
        chrome.extension.getBackgroundPage().go();
        $("#go").hide();
        $("#stop").show();
    });

$("#stop").click(
    function(){
        chrome.extension.getBackgroundPage().stop();
        $("#stop").hide();
        $("#go").show();
    });

$(".link").click(function(){
    chrome.tabs.create({"url": $(this).data("href")});
});

if( chrome.extension.getBackgroundPage() && 
        chrome.extension.getBackgroundPage().getIntervals() && 
        chrome.extension.getBackgroundPage().getIntervals().length > 0){
    $("#go").hide();
}
else{
    $("#stop").hide();
}
