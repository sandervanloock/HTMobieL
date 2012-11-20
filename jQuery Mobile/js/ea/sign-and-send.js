$(document).on("pageinit", "#sign-and-send", function () {
    $("#sign-and-send-form").validate({
        submitHandler:function (form) {
            $.mobile.changePage("#home");
        }
    });
});