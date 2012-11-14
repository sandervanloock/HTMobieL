$(document).on("pageinit", "#step1", function () {
    $("#step1firstname").val("Tim");
    $("#step1lastname").val("Ameye");
    $("#step1employeenumber").val("1");
    $("#step1email").val("tim.ameye@student.kuleuven.be");

    $("#formstep1").validate({
        focusInvalid: false,
        submitHandler:function (form) {
            alert('Formulier correct gevalideerd');
        },
        invalidHandler:function (form, validator) {
            EA.showErrorDialog("Validation error","Some of the fields were not filled in correctly. Please correct the indicated fields.");
        }
    });
});