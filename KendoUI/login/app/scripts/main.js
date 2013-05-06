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
    var $dialogList = $("#dialog-list");
    var $dialog = $("#dialog");

    if (!validator.validate()) {
        // don't show messages on the form
        validator.hideMessages();
        // get the errors to show them in a dialog
        var errors = validator.errors();
        $dialogList.empty();
        $(errors).each(function () {
            $dialogList.append("<li>" + this + "</li>");
        });
        // show red border
        $("#login-username").parent().parent().addClass("red-border");
        // open the dialog
        $dialog.kendoMobileModalView("open");
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
            success: function (token) {
                if (!token || token == '') {
                    $dialogList.empty();
                    $dialogList.append("<li>Username and/or password are incorrect</li>");
                    $("#login-username").parent().parent().addClass("red-border");
                    $dialog.kendoMobileModalView("open");
                } else {
                    // http://www.kendoui.com/forums/mobile/application/programmatic-navigation.aspx
                    var start = new Date();
                    var data = [];
                    for (var i = 0; i < 1000; i++) {
                        data.push({id: i});
                    }
                    var viewModel = kendo.observable({
                        songs: data
                    });
                    kendo.bind($("#home-list"), viewModel);
                    app.navigate("#home");
                    var stop = new Date();
                    $dialogList.empty();
                    $dialogList.append("<li>" + (stop - start) + " ms</li>");
                    $dialog.kendoMobileModalView("open");
                }
            }
        });
    }
});

function closeDialog(e) {
    // TODO: Maximum call stack size exceeded
    $("#dialog").kendoMobileModalView("close");
    $("#login-username").parent().parent().removeClass("red-border");
}
