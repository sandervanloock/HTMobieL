$(document).on("pageinit", "#login", function () {
    $("#formlogin").validate({
        focusInvalid: false,
        submitHandler:function (form) {
            console.log("Login form was validaded successfully.");
            /*$.ajax({
             type:"POST",
             dataType:"html",
             url:"http://kulcapexpenseapp.appspot.com/resources/userService/login",
             data:{
             email:'tim',
             password:'tom'
             },
             success:function (data) {
             console.log("verstuurd");
             console.log(data);
             },
             error:function (xhr, ajaxOptions, thrownError) {
             alert(xhr.status);
             alert(thrownError);
             }
             });*/
            $.mobile.changePage("#home");
        },
        invalidHandler:function (form, validator) {
            EA.showErrorDialog("Validation error","Some of the fields were not filled in correctly. Please correct the indicated fields.");
        }
    });
});