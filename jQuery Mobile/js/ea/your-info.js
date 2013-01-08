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
    var today = new Date();
    var year = today.getFullYear();
    var day = today.getDate();
    var month = today.getMonth();

    // generate year options for this, previous and next year
    var $yearOptions = $("#your-info-date-year");
    var years = [year + 1, year, year - 1];
    $(years).each(function (i, year) {
        $yearOptions.append('<option value="' + year + '">' + year + '</option>');
    });

    // month and year should be equal to this month if day > 15th
    if (day <= 15) {
        // month := previous month
        // and mind that the month January is 0 in JavaScript
        if (month == 0) {
            // previous month is December (now not in JavaScript)
            month = 12;
            // of previous year
            year--;
        }
    }

    // set on screen
    $yearOptions.find("option[value='" + year + "']").attr("selected", true);
    $("#your-info-date-month").find("option[value='" + month + "']").attr("selected", true);

    // set the user information
    var user = EA.getUser();
    $("#your-info-firstname").val(user.firstName);
    $("#your-info-lastname").val(user.lastName);
    $("#your-info-employee-number").val(user.employeeNumber);
    $("#your-info-email").val(user.email);
});