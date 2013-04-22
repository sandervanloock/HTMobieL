Lungo.dom("#login-screen-button").on("tap", function () {
    var $$email = $$("#login-screen-username");
    var $$password = $$("#login-screen-password");
    var email = $$email.val();
    var password = $$password.val();

    // TODO: manual validation
    if (email === "" || password === "") {
        var errors = [];
        // delete red border before validation
        $$email.parent().removeClass("red-border");
        $$password.parent().removeClass("red-border");
        // add red borders
        if (email === "") {
            $$email.parent().addClass("red-border");
            errors.push("Username is required.");
        }
        if (password === "") {
            $$password.parent().addClass("red-border");
            errors.push("Password is required.");
        }
        // convert errors to html code
        var htmlError = "<ul>";
        $$(errors).each(function (i, error) {
            htmlError += "<li>" + error + "</li>";
        });
        htmlError += "</ul>";
        // show notification
        Lungo.Notification.error(
            // Title
            "Validation error",
            // Description
            "The following fields were not correctly validated:" + htmlError,
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
                            // go to home section
                            Lungo.Router.section("home");

                            // load currencies asynchronously
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

                                },
                                // type
                                "xml"
                            );

                            // load project codes asynchronously
                            Lungo.Service.post(
                                // url
                                EA.baseURL + "resources/expenseService/getProjectCodeSuggestion",
                                // data
                                {
                                    "keyword": ""
                                },
                                // callback
                                function (json) {
                                    // show loading screen
                                    // TODO loading screen problems
                                    // Lungo.Notification.show();
                                    if (json != null) {
                                        // persist project codes
                                        Lungo.Data.Storage.persistent("projectCodes", json.data);
                                    } else {
                                        // silent fail
                                        // it could happen that there are no project codes yet
                                        console.log("No project code suggestions were returned.");
                                    }
                                },
                                // type
                                "json"
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