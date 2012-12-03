$(document).on("pageinit", "#login", function () {
    $("#login-form").validate({
        focusInvalid:false,
        submitHandler:function (form) {
            console.log("Login form was validaded successfully.");
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
                        EA.showErrorDialog("Login error", "The username and/or password are incorrect.");
                    } else {
                        EA.token = data;
                        console.log("User was logged in successfully: " + EA.token);

                        // fetch projectcodes at logon time
                        $.ajax({
                            type:"POST",
                            dataType:"json",
                            url:"http://kulcapexpenseapp.appspot.com/resources/expenseService/getProjectCodeSuggestion",
                            beforeSend:function () {
                                $.mobile.loading("show");
                            },
                            success:function (data) {
                                console.log(data);
                                $.mobile.changePage("#home");
                            },
                            error:function (xhr, textStatus, errorThrown) {
                                EA.showBackendErrorDialog("Could not fetch project codes.");
                            },
                            complete:function () {
                                $.mobile.loading("hide");
                            }
                        });
                    }
                },
                error:function (xhr, textStatus, errorThrown) {
                    EA.showBackendErrorDialog("Could not log in.");
                },
                complete:function () {
                    $.mobile.loading("hide");
                }
            });
        },
        invalidHandler:function (form, validator) {
            EA.showErrorDialog("Validation error", "Some of the fields were not filled in correctly. Please correct the indicated fields.");
        }
    });
});