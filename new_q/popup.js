var questions = chrome.extension.getBackgroundPage().getLastBatchOfQuestions();

console.log("questions");
console.log(questions);

var viewModel = ko.mapping.fromJS(questions);

var tmp_options = {
    attribute: "data-bind",        // default "data-sbind"
    globals: window,               // default {}
    bindings: ko.bindingHandlers,  // default ko.bindingHandlers
    noVirtualElements: false       // default true
};
ko.bindingProvider.instance = new ko.secureBindingsProvider(tmp_options);

ko.applyBindings(viewModel);

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
if(chrome.extension.getBackgroundPage() && chrome.extension.getBackgroundPage().getIntervals() && chrome.extension.getBackgroundPage().getIntervals().length > 0){
    $("#go").hide();
}
else{
    $("#stop").hide();
}
