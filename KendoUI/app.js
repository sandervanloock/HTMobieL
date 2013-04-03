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
    app.showLoading();
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: EA.baseURL + "resources/expenseService/getExpenseForms", // the remove service url
                dataType: "xml",
                type:"POST",
                callback: function(){
                    app.hideLoading()
                }
            },
            parameterMap: function(options) {
                return {
                    token: EA.getToken()
                };
            }
        },
        schema: { // describe the result format
            type: "xml",
            data: "/expenseForms/expenseForm", // the data which the data source will be bound to is in the "results" field
            model: {
                // configure the fields of the object
                //Information found at http://demos.kendoui.com/web/datasource/xml-data.html
                fields: {
                    id: "id/text()",
                    date: "date/text()",
                    statusId: "statusId/text()"
                }
            }
        }
    });

    $("#expenseFormList").kendoMobileListView({
        dataSource: dataSource,
        template: $("#expenseForm-template").text(),
        pullToRefresh: true,
        appendOnRefresh: true,
        /*pullParameters: function(item) {
            //item is the first data item in the ListView
            return {
                since_id: item.id_str, //id of the first item in the ListView
                page: 1
            };
        },*/
        endlessScroll: true
        /*endlessScrollParameters: function(firstItem, lastItem) {
            // firstItem - first data item shown in the ListView on initial load
            // lastItem - last data item shown in the ListView on initial load
            if (firstItem) {
                return {
                    max_id: firstItem.id_str
                };
            }
        }*/
    });
};

function gotoOverview(){
    var validator = $("#your-info-form").kendoValidator().data("kendoValidator");

    if (validator.validate()){
        //A valid employee is filled in
        $("#main-pane").data("kendoMobilePane").navigate("#overview");
    }
    else{
        var errors = validator.errors();
        var message = "<h2>";
        $(errors).each(function() {
            message += this + "<br/>";
        });
        message +="</h2>";
        $("#error-messages").html(message);
        var modalView = $("#error-view").data("kendoMobileModalView");
        modalView.open();
        highlightBorders(validator,$("#your-info-form"));
    }
}

function highlightBorder(validator, form){
    //TODO (draw red borders round error fields with addClass(red-border))
}

function closeModalView(e) {
    // find the closest modal view, relative to the button element.
    var modalView = e.sender.element.closest("[data-role=modalview]").data("kendoMobileModalView");
    modalView.close();
}

function submitExpense(){
    //TODO validate
    console.log(expense);
}

function gotoNewExpenseForm(){
    if(isPhone)
        app.navigate("#side-root");
    else
        app.navigate("#newExpense");
}