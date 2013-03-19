function login() {
    $.ajax({
        type:"POST",
        dataType:"text",
        url:EA.baseURL + "resources/userService/login",
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
                        app.navigate("#home")
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

function logout(){
    if (navigator.onLine) {
        $.ajax({
            type:"POST",
            url:EA.baseURL + "resources/userService/logout",
            data:{
                'token':EA.getToken()
            },
            success:function () {
                // empty the session
                EA.setToken(null);
                // empty user information
                EA.deleteUser();
                // go to login page
                app.navigate("#login")
            },
            error:function () {
                EA.showBackendError("Could not log out");
            }
        });
    }
}

function goHome(){
    app.navigate("#home");
};

function initExpenseFormList() {
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: EA.baseURL + "resources/expenseService/getExpenseForms", // the remove service url
                dataType: "xml",
                type:"POST"
            },
            parameterMap: function(options) {
                return {
                    token: EA.getToken()
                };
            }
        },
        schema: { // describe the result format
            data: "expenseForms" // the data which the data source will be bound to is in the "results" field
        }
    });

    $("#expenseFormList").kendoMobileListView({
        dataSource: dataSource,
        template: $("#pull-with-endless-template").text()
        //template:
        //appendOnRefresh: true,
        //pullToRefresh: true,
        //addition parameters which will be passed to the DataSource's read method
        /*pullParameters: function(item) { //pass first data item of the ListView
            return {
                since_id: item.id_str,
                page: 1
            };
        },
        endlessScroll: true,
        //addition parameters which will be passed to the DataSource's next method
        endlessScrollParameters: function(firstOrigin) {
            if (firstOrigin) {
                return {
                    max_id: firstOrigin.id_str
                };
            }
        }*/
    });
};

function gotoOverview(){
    $("#your-info-form").kendoValidator({
        messages: {
            // overrides the built-in message for the required rule
            required: "My custom required message"
        }
    });
    var validator = $("#your-info-form").kendoValidator().data("kendoValidator");

    if (validator.validate()){
        app.navigate("#overview");
    }
    else{
        var errors = validator.errors();
        var message = "";
        $(errors).each(function() {
            //$("#foo").after(this);
            message += this + "\n";
        });
        alert(message);
    }
}