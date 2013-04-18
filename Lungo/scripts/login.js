Lungo.dom("#login-screen-button").on("tap", function () {
    var email = $$("#login-screen-username").val();
    var password = $$("#login-screen-password").val();

    // TODO: manual validation
    if (email === "" || password === "") {
        Lungo.Notification.error(
            // Title
            "Validation error",
            // Description
            "Please fill in the required fields.",
            // Icon
            "warning",
            // Time on screen
            0,
            // Callback function
            null
        );
    } else {
        // show loading screen
        // TODO loading screen problems
        // Lungo.Notification.show();
        // make the AJAX-request
        Lungo.Service.post(
            // url
            EA.baseURL + "resources/userService/login",
            // data
            {
                "email": email,
                "password": password
            },
            // callback
            function (token) {
                // hide loading screen
                // TODO loading screen problems
                // Lungo.Notification.hide();
                // check if token was returned or not
                if (token === "") {
                    Lungo.Notification.error(
                        // Title
                        "Error",
                        // Description
                        "The username and/or password are incorrect.",
                        // Icon
                        "warning",
                        // Time on screen
                        0,
                        // Callback function
                        null
                    );
                } else {
                    // save token
                    Lungo.Data.Storage.persistent("token", token);
                    // show loading screen
                    // TODO loading screen problems
                    // Lungo.Notification.show();
                    // get user info
                    Lungo.Service.post(
                        // url
                        EA.baseURL + "resources/userService/getEmployee",
                        // data
                        {
                            "token": Lungo.Data.Storage.persistent("token")
                        },
                        // callback
                        function (user) {
                            // hide loading screen
                            // TODO loading screen problems
                            // Lungo.Notification.hide();
                            // persist the user
                            Lungo.Data.Storage.persistent("user", user);
                            // load currencies
                            // show loading screen
                            // TODO loading screen problems
                            // Lungo.Notification.show();
                            Lungo.Service.post(
                                // url
                                EA.baseURL + "resources/currencyService/getCurrencies",
                                // data
                                null,
                                // callback
                                function (xml) {
                                    // show loading screen
                                    // TODO loading screen problems
                                    // Lungo.Notification.show();
                                    // persist currencies
                                    var currencies = [];
                                    // gets the cube block
                                    var $$xml = $$(xml).find("Cube Cube Cube");
                                    // iterate over each entry to get currency and rate
                                    $$xml.each(function () {
                                        var $$this = $$(this);
                                        currencies.push({
                                            name: $$this.attr("currency"),
                                            rate: parseFloat($$this.attr("rate"))
                                        });
                                    });
                                    Lungo.Data.Storage.persistent("currencies", currencies);
                                    // go to home section
                                    Lungo.Router.section("home");
                                },
                                // type
                                "xml"
                            );
                        },
                        // type
                        "json"
                    );
                }
            },
            // type
            "text"
        );
    }
});