$(document).on("pageinit", "#login", function () {
    $("#login-form").validate({

        // needed for bug that otherwhise shows keyboard and dialog
        // at the same time on a smartphone
        focusInvalid:false,

        errorPlacement:function () {
            // no body, because we want no error labels on the form
        },

        showErrors:function (errorMap) {
            EA.prepareValidationError(this, errorMap);
        },

        invalidHandler:function () {
            $.mobile.changePage("#error-validation");
        },

        submitHandler:function () {
            $.ajax({
                type:"POST",
                dataType:"html",
                url:"http://kulcapexpenseapp.appspot.com/resources/userService/login",
                data:{
                    'email':$("#login-username").val(),
                    'password':$("#login-password").val()
                },
                beforeSend:function () {
                    $.mobile.loading("show");
                },
                success:function (token) {
                    if (token == '') {
                        EA.showBackendError("The username and/or password are incorrect.");
                    } else {
                        EA.setToken(token);

                        // don't go to the home page yet, but first fetch user info
                        $.ajax({
                            type:"POST",
                            dataType:"json",
                            url:"http://kulcapexpenseapp.appspot.com/resources/userService/getEmployee",
                            data:{
                                'token':EA.getToken()
                            },
                            beforeSend:function () {
                                $.mobile.loading("show");
                            },
                            success:function (data) {
                                EA.setUser(data);
                                $.mobile.changePage("#home");
                            },
                            error:function () {
                                EA.showBackendError("Could not fetch user information");
                            },
                            complete:function () {
                                $.mobile.loading("hide");
                            }
                        });

                        // fetch projectcodes asynchronous at logon time
                        $.ajax({
                            type:"POST",
                            dataType:"json",
                            url:"http://kulcapexpenseapp.appspot.com/resources/expenseService/getProjectCodeSuggestion",
                            data:{
                                "keyword":""
                            },
                            beforeSend:function () {
                                $.mobile.loading("show");
                            },
                            success:function (json) {
                                if (json != null) {
                                    EA.setProjectCodeSuggestions(json.data);
                                } else {
                                    // silent fail
                                    // it could happen that there are no project codes yet
                                    console.log("No project code suggestions were returned.");
                                }
                            },
                            error:function () {
                                EA.showBackendError("Could not fetch project codes.");
                            },
                            complete:function () {
                                $.mobile.loading("hide");
                            }
                        });

                        // fetch currencies asynchronous at logon time
                        $.ajax({
                            type:"POST",
                            dataType:"xml",
                            url:"http://kulcapexpenseapp.appspot.com/resources/currencyService/getCurrencies",
                            beforeSend:function () {
                                $.mobile.loading("show");
                            },
                            success:function (xml) {
                                var currencies = [];
                                // gets the cube block
                                var $xml = $("Cube", xml);
                                // gets the cube block with time attribute
                                $xml = $("Cube", $xml);

                                // extract time stamp to know if outdated or not

                                // iterate over each entry to get currency and rate
                                $xml.find("Cube").each(function () {
                                    var $this = $(this);
                                    currencies.push({
                                        name:$this.attr("currency"),
                                        rate:parseFloat($this.attr("rate"))
                                    });
                                });
                                EA.setCurrencies(currencies);
                            },
                            error:function () {
                                EA.showBackendError("Could not fetch currencies.");
                            },
                            complete:function () {
                                $.mobile.loading("hide");
                            }
                        });
                    }
                },
                error:function () {
                    EA.showBackendError("Could not log in.");
                },
                complete:function () {
                    $.mobile.loading("hide");
                }
            });
        }
    });
});