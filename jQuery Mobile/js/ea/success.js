$(document).on("pageshow", "#success", function () {
    // go automatically to home screen after 3 seconds
    window.setTimeout(function () {
        $.mobile.changePage("#home");
    }, 3000);
});