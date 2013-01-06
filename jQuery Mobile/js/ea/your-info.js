$(document).on("pageinit", "#your-info", function () {
    $("#your-info-form").validate({

        // needed for bug that otherwhise shows keyboard and dialog at the same time
        focusInvalid:false,

        errorPlacement:function (error, element) {
            // no body, because we want no error labels on the form
        },

        showErrors:function (errorMap, errorList) {
            EA.prepareValidationError(this, errorMap);
        },

        invalidHandler:function (form, validator) {
            $.mobile.changePage("#error-validation");
        },

        submitHandler:function (form) {
            $.mobile.changePage("#overview");
        }
    });
});

$(document).on("pagebeforecreate", "#your-info", function () {

    // month and year should be equal to this month if day > 15th
    var fullDate = new Date();

    // year
    var year = fullDate.getFullYear();
    $("#your-info-date-year option[value='" + year + "']").attr("selected", "selected");

    // month
    var day = fullDate.getDate();
    var month = fullDate.getMonth();
    if (day <= 15) {
        if (month == 1) {
            month = 12;
        } else {
            month--;
        }
    }
    $("#your-info-date-month option[value='" + month + "']").attr("selected", "selected");

    $.ajax({
        type:"POST",
        dataType:"json",
        url:"http://kulcapexpenseapp.appspot.com/resources/userService/getEmployee",
        data:{
            'token':EA.getToken()
        },
        success:function (data) {
            $("#your-info-firstname").val(data.firstName);
            $("#your-info-lastname").val(data.lastName);
            $("#your-info-employee-number").val(data.employeeNumber);
            $("#your-info-email").val(data.email);
        },
        error:function (xhr, textStatus, errorThrown) {
            EA.showBackendError("Could not get user data");
        }
    });
});