$(document).ready(function() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const username = urlParams.get('username');
    $("#hello-user").text("Good Luck "+ username + "!");

    $("#stopwatch").timer({
        action: 'start', 
        seconds: 0
    });
});