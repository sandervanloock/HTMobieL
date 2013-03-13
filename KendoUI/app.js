var app = new kendo.mobile.Application(document.body,
    {
        transition:'slide'
    });
var router = new kendo.Router();
router.start();
router.navigate("home.html");

var baseURL = "http://kulcapexpenseapp.appspot.com/";

function login() {
    $.ajax({
        type:"POST",
        dataType:"text",
        url:baseURL + "resources/userService/login",
        data:{
            'email':$("#login-username").val(),
            'password':$("#login-password").val()
        },

        error:function () {
            // don't write the loading hide in a complete handler,
            // because we chain the ajax requests

            // show error
            alert("Could not log in.");
        },
        success:function (token) {
            // don't write the loading hide in a complete handler,
            // because we chain the ajax requests

            if (token == '') {
                EA.showBackendError("The username and/or password are incorrect.");
            } else {
                // set the token
                EA.setToken(token);

                // empty form
                //$("#login-form")[0].reset();

                // don't go to the home page yet, but first fetch user info
                $.ajax({
                    type:"POST",
                    dataType:"json",
                    url:EA.baseURL + "resources/userService/getEmployee",
                    data:{
                        'token':EA.getToken()
                    },
                    error:function () {
                        // don't write the loading hide in a complete handler,
                        // because we chain the ajax requests

                        EA.showBackendError("Could not fetch user information");
                    },
                    success:function (userData) {
                        // don't write the loading hide in a complete handler,
                        // because we chain the ajax requests
                        // set user data and go to home page
                        EA.setUser(userData);
                    }
                });

                // fetch projectcodes asynchronous at logon time
                $.ajax({
                    type:"POST",
                    dataType:"json",
                    url:EA.baseURL + "resources/expenseService/getProjectCodeSuggestion",
                    data:{
                        "keyword":""
                    },
                    error:function () {
                        EA.showBackendError("Could not fetch project codes.");
                    },
                    success:function (json) {
                        if (json != null) {
                            EA.setProjectCodeSuggestions(json.data);
                        } else {
                            // silent fail
                            // it could happen that there are no project codes yet
                            console.log("No project code suggestions were returned.");
                        }
                    }
                });

                // fetch currencies asynchronous at logon time
                $.ajax({
                    type:"POST",
                    dataType:"xml",
                    url:EA.baseURL + "resources/currencyService/getCurrencies",
                    error:function () {
                        EA.showBackendError("Could not fetch currencies.");
                    },
                    success:function (xml) {
                        var currencies = [];
                        // gets the cube block
                        var $xml = $("Cube", xml);
                        // gets the cube block with time attribute
                        $xml = $("Cube", $xml);

                        // iterate over each entry to get currency and rate
                        $xml.find("Cube").each(function () {
                            var $this = $(this);
                            currencies.push({
                                name:$this.attr("currency"),
                                rate:parseFloat($this.attr("rate"))
                            });
                        });
                        EA.setCurrencies(currencies);
                    }
                });
            }
        }
    });
}

