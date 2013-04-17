Lungo.dom("#login-screen-button").on("tap", function (event) {
    var email = $$('#login-screen-username').val();
    var password = $$('#login-screen-password').val();

    // TODO: manual validation
    if (email === "" || password === "") {
        Lungo.Notification.error(
            // Title
            "Validation error",
            // Description
            "Please fill in the required fields.",
            // Icon
            "cancel",
            // Time on screen
            0,
            // Callback function
            null
        );
    } else {
        console.log("making ajax request");

        // show loading screen
        Lungo.Notification.show();

        // make the AJAX-request
        Lungo.Service.post(
            // url
            EA.baseURL + 'resources/userService/login',
            // data
            {
                'email': email,
                'password': password
            },
            // callback
            function (token) {
                Lungo.Notification.hide();

                if (token === '') {
                    Lungo.Notification.error(
                        // Title
                        "Error",
                        // Description
                        "The username and/or password are incorrect.",
                        // Icon
                        "cancel",
                        // Time on screen
                        0,
                        // Callback function
                        null
                    );
                } else {
                    console.log(token);
                    // go to home section
                    Lungo.Router.section("home");
                }
            }
            ,
            // type
            'text'
        );
    }

});