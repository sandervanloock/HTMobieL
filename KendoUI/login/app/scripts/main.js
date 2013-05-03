var app = new kendo.mobile.Application();

// http://docs.kendoui.com/api/framework/validator
// get a reference to the validatable form
var validator = $("#login-form").kendoValidator({
        // no validation when element loses focus
        validateOnBlur: false
    }
).data("kendoValidator");

// check validation on save button click
$("#login-button").click(function () {
    if (!validator.validate()) {
        // don't show messages on the form
        validator.hideMessages();
        // get the errors to show them in a dialog
        var errors = validator.errors();
        $("#login-dialog-errors").empty();
        $(errors).each(function () {
            $("#login-dialog-errors").append("<li>" + this + "</li>");
        });
        // open the dialog
        $("#login-dialog").kendoMobileModalView("open");
    } else {
        // copied from jQM
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "http://kulcapexpenseapp.appspot.com/resources/userService/login",
            data: {
                'email': $("#login-username").val(),
                'password': $("#login-password").val()
            },
            beforeSend: function () {
                app.showLoading();
            },
            error: function () {
                app.hideLoading();
                alert("Backend error");
            },
            success: function (token) {
                app.hideLoading();
                if (!token || token == '') {
                    alert("Username and/or password is incorrect.");
                } else {
                    // http://www.kendoui.com/forums/mobile/application/programmatic-navigation.aspx
                    var start = new Date();
                    for (var i = 0; i < 1000; i++) {
                        $('#home-list').append("<li><h2>Item " + i + '</h2><img src="images/boston.jpg"><a data-role="detailbutton" data-style="detaildisclose"></a></li>')
                    }
                    app.navigate("#home");
                    var stop = new Date();
                    alert(stop - start + " ms");
                }
            }
        });
    }
});

function closeDialog(e) {
    // TODO: Maximum call stack size exceeded
    $("#login-dialog").kendoMobileModalView("close");
}
