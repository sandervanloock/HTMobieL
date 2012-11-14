$(document).on("pageinit", "#login", function () {
    $("#formlogin").validate({
        submitHandler:function (form) {
            console.log("Login form was validaded successfully.");
            /*$.ajax({
             type:"POST",
             dataType: "html",
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
        invalidHandler: function(form, validator) {
            // mogelijkheid voor een alert
            //alert("There were " + validator.numberOfInvalids() + " invalid form elements.");
        }
    });
});

$(document).on("pageinit", "#step1", function () {
    $("#step1firstname").val("Tim");
    $("#step1lastname").val("Ameye");
    $("#step1employeenumber").val("1");
    $("#step1email").val("tim.ameye@student.kuleuven.be");

    $("#formstep1").validate({
        submitHandler:function (form) {
            alert('ok');
        }
    });
});