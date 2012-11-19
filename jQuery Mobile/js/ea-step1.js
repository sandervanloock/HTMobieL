$(document).on("pageinit", "#step1", function () {
    $("#step1-form").validate({
        focusInvalid:false,
        submitHandler:function (form) {
            $.mobile.changePage("#step2");
        },
        invalidHandler:function (form, validator) {
            EA.showErrorDialog("Validation error", "Some of the fields were not filled in correctly. Please correct the indicated fields.");
        }
    });
});

$(document).on("pagebeforeshow", "#step1", function () {
    // month and year should be equal to this month if day > 15th
    var fullDate = new Date();

    // year
    var year = fullDate.getFullYear();
    $("#step1-date-year option[value='" + year + "']").attr("selected", "selected");

    // month
    var day = fullDate.getDate();
    var month = fullDate.getMonth();
    if (day <= 15) {
        if(month == 1){
            month = 12;
        }else{
            month--;
        }
    }
    $("#step1-date-month option[value='" + month + "']").attr("selected", "selected");

    // refresh select menus
    $('select').selectmenu('refresh');

    $.ajax({
        type:"POST",
        dataType:"json",
        url:"http://kulcapexpenseapp.appspot.com/resources/userService/getEmployee",
        data:{
            'token':EA.token
        },
        success:function (data) {
            $("#step1-firstname").val(data.firstName);
            $("#step1-lastname").val(data.lastName);
            $("#step1-employee-number").val(data.employeeNumber);
            $("#step1-email").val(data.email);
        },
        error:function (xhr, textStatus, errorThrown) {
            EA.showErrorDialog("Backend error: " + xhr.status, errorThrown);
        }
    });
});