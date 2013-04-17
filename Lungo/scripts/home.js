Lungo.dom("#home-logout").on("tap", function (event) {
    // show loading screen
    Lungo.Notification.show();

    // make the AJAX-request
    Lungo.Service.post(
        // url
        EA.baseURL + "resources/userService/logout",
        // data
        {
            "token": null
        },
        // callback
        function () {
            Lungo.Notification.hide();
            Lungo.Router.section("login");
        },
        // type
        "text"
    );
});