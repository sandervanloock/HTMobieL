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
            $.mobile.loading("show", {
                text:"Logging in",
                textVisible:true
            });
            $.ajax({
                url: "http://kulcapexpenseapp.appspot.com/resources/userService/login",
                type: "POST",
                dataType: "text",
                data: {
                    email: $("#username").val(),
                    password: $("#password").val()
                },
                success: function(data, textStatus, jqXHR){
                    //alert(data);
                    $.mobile.navigate("#list-page");
                },
                complete: function(){
                    $.mobile.loading("hide");
                }
            });
        }
    });
});

var start, stop, nbButtons=100;


$( '#list-page' ).on( 'pageinit',function(event){
    start = new Date();
    for (var i=0; i<nbButtons; i++){
        var temp = i+1;
        $('#list').append('<li><a href="#"><img src="images/music_icon.jpg" alt="Music">' + temp + ': Titel: Artist</li>').listview('refresh');
    }
    stop = new Date() - start;
    alert("Rendertime for list with size " + nbButtons + ": " +stop + " ms");
});