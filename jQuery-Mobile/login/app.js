$('#login-page').bind('pageinit', function(event) {
    $("form").validate({
        rules: {
            username: {
                required: true
            },
            password: {
                required: true
            }
        },

        focusInvalid:false,
        onkeyup:false,
        onfocusout:false,

        highlight:function (element, errorClass, validClass) {
            var $element = $(element);
            $element.parent().addClass("red-border");
        },

        unhighlight:function (element, errorClass, validClass) {
            var $element = $(element);
            $element.parent().removeClass("red-border");
        },

        errorPlacement:function () {
            // do nothing
        },

        showErrors:function (errorMap) {
            var message = "<ul>";
            $.each(errorMap, function (index, value) {
                message += "<li>" + index + " : " + value + "</li>" + "\n";
            })
            message +="</ul>";
            $("#error-validation-items").html(message);
            $.mobile.changePage("#error-validation");
            this.defaultShowErrors();
        },

        invalidHandler:function () {

        },

        submitHandler: function(form) {
            $.ajax({
                url: "http://kulcapexpenseapp.appspot.com/resources/userService/login",
                type: "POST",
                dataType: "text",
                data: {
                    email: $("#username").val(),
                    password: $("#password").val()
                },
                success: function(data, textStatus, jqXHR){
                    alert(data);
                }
            });
        }
    });
});