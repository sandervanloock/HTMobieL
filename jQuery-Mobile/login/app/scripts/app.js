$('#login-button').click(function(event) {
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
            this.defaultShowErrors();
        },

        invalidHandler:function () {
            $.mobile.changePage("#error-validation");
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
                success: function(data){
                    console.log(data);
                    if(data!=undefined){
                        start = new Date();
                        for (var i=0; i<nbButtons; i++){
                            var temp = i+1;
                            $('#list').append('<li><a href="#"><img src="images/music_icon.jpg" alt="Music">' + temp + ': Titel: Artist</li>');
                        }
                        $.mobile.navigate("#list-page");

                    }
                    else{
                        $("#error-validation-items").html("Login could not be found");
                        $.mobile.changePage("#error-validation");
                    }
                }
            });
        }
    });
});

var start, stop, nbButtons=10000;


$( '#list-page' ).on( 'pageshow',function(event){
    stop = new Date() - start;
    alert("Rendertime for list with size " + nbButtons + ": " +stop + " ms");
});