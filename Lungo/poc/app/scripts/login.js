Lungo.dom("#login-screen-button").on("tap", function () {
    var $$email = $$("#login-screen-username");
    var $$password = $$("#login-screen-password");
    var email = $$email.val();
    var password = $$password.val();

    // TODO: validation with plugin
    if (email === "" || password === "") {
        var errors = [];
        // delete red border before validation
        $$email.parent().removeClass("red-border");
        $$password.parent().removeClass("red-border");
        // add red borders
        if (email === "") {
            $$email.parent().addClass("red-border");
            errors.push("Username: This is a required field.");
        }
        if (password === "") {
            $$password.parent().addClass("red-border");
            errors.push("Password: This is a required field.");
        }
        // convert errors to html code
        var htmlError = "";
        $$(errors).each(function (i, error) {
            htmlError += "<p>" + error + "</p>";
        });
        // show notification
        Lungo.Notification.error(
            // Title
            "Validation error",
            // Description
            "Please complete the following fields:" + htmlError,
            // Icon
            "warning",
            // Time on screen
            0,
            // Callback function
            null
        );
    } else {
        $$email.parent().removeClass("red-border");
        $$password.parent().removeClass("red-border");
        // show loading screen
        Lungo.Notification.show();
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
                            Lungo.Notification.hide();
                            // persist the user
                            Lungo.Data.Storage.persistent("user", user);
                            // load information into home screen
                            loadUserInformation();
                            // go to home section
                            Lungo.Router.section("home");

                            // load currencies asynchronously
                            Lungo.Service.post(
                                // url
                                EA.baseURL + "resources/currencyService/getCurrencies",
                                // data
                                null,
                                // callback
                                function (xml) {
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
                                    if (json != null) {
                                        // persist project codes
                                        Lungo.Data.Storage.persistent("projectCodes", json.data);
                                        // initialize autocompletion
                                        initAutoCompletion();
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