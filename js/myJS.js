$(document).ready( function() {
    clickableButtons();
});

function clickableButtons() {
    $("#login-button").click(function() {
        alert("clicked");
    });
}