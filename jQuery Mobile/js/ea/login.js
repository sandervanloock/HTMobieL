$(document).on("pageinit", "#login", function () {
    $("#login-form").validate({

        // needed for bug that otherwhise shows keyboard and dialog at the same time
        focusInvalid:false,

        errorPlacement:function (error, element) {
            // no body, because we want no error labels on the form
        },

        showErrors:function (errorMap, errorList) {
            EA.prepareValidationError(this, errorMap);
        },

        invalidHandler:function (form, validator) {
            $.mobile.changePage("#error-validation");
        },

        submitHandler:function (form) {
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
                        // save the token
                        EA.setToken(token);
                        console.log("User was logged in successfully: " + token);

                        // go to home page
                        $.mobile.changePage("#home");

                        // fetch projectcodes asynchronous at logon time
                        $.ajax({
                            type:"POST",
                            dataType:"json",
                            data:{
                                "keyword":""
                            },
                            url:"http://kulcapexpenseapp.appspot.com/resources/expenseService/getProjectCodeSuggestion",
                            beforeSend:function () {
                                $.mobile.loading("show");
                            },
                            success:function (json) {
                                if (json != null) {
                                    EA.projectCodeSuggestions = json.data;
                                } else {
                                    console.log("No project code suggestions were returned.");
                                }
                            },
                            error:function (xhr, textStatus, errorThrown) {
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
                                // gets the cube block
                                var $xml = $("Cube", xml);
                                // gets the cube block with time attribute
                                $xml = $("Cube", $xml);
                                // iterate over each entry to get currency and rate
                                $xml.find("Cube").each(function () {
                                    var $this = $(this);
                                    EA.currencies.push({
                                        name:$this.attr("currency"),
                                        rate:parseFloat($this.attr("rate"))
                                    });
                                });
                            },
                            error:function (xhr, textStatus, errorThrown) {
                                EA.showBackendError("Could not fetch currencies.");
                            },
                            complete:function () {
                                $.mobile.loading("hide");
                            }
                        });
                    }
                },
                error:function (xhr, textStatus, errorThrown) {
                    EA.showBackendError("Could not log in.");
                },
                complete:function () {
                    $.mobile.loading("hide");
                }
            });
        }
    });
});