$(document).on("pageinit", "#login", function () {
    $("#login-form").validate({
        focusInvalid:false,
        errorPlacement:function (error, element) {
            // no body, because we want no error labels on the form
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
                success:function (data) {
                    if (data == '') {
                        EA.showError("Login error", "The username and/or password are incorrect.");
                    } else {
                        EA.token = data;
                        console.log("User was logged in successfully: " + EA.token);
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
                                var $xml = $("Cube", xml);
                                $xml.find("Cube").each(function () {
                                    var $this = $(this);
                                    var currency = $this.attr("currency");
                                    var rate = $this.attr("rate");
                                    EA.currencies.push(currency);
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
        },
        invalidHandler:function (form, validator) {
            EA.showValidationError(validator.numberOfInvalids());
        }
    });
});