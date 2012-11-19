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
                success:function (data) {
                    if (data == '') {
                        EA.showErrorDialog("Login error", "The username and/or password are incorrect.");
                    } else {
                        EA.token = data;
                        console.log("User was logged in successfully: " + EA.token);
                        $.mobile.changePage("#home");
                    }
                },
                error:function (xhr, textStatus, errorThrown) {
                    EA.showErrorDialog("Backend error: " + xhr.status, errorThrown);
                }
            });
        },
        invalidHandler:function (form, validator) {
            EA.showErrorDialog("Validation error", "Some of the fields were not filled in correctly. Please correct the indicated fields.");
        }
    });
});