$(document).on("pageinit", "#your-info", function () {

    // initialize validation for the form
    $("#your-info-form").validate({

        // needed for bug that show keyboard and dialog at the same time
        focusInvalid:false,

        // no real time validation checking needed
        onkeyup:false,
        onfocusout:false,

        errorPlacement:function () {
            // no body, because we want no error labels on the form
        },

        // custom highlight function due to select item
        highlight:function (element, errorClass, validClass) {
            if (element.tagName === "SELECT") {
                // we have to take special care for the red border around select items
                $(element).parent().addClass("red-border");
            } else {
                // normal toggle behaviour
                $(element).removeClass(validClass);
                $(element).addClass(errorClass);
            }
        },

        // custom unhighlight function due to select item
        unhighlight:function (element, errorClass, validClass) {
            if (element.tagName === "SELECT" ) {
                // we have to take special care for the red border around select items
                $(element).parent().removeClass("red-border");
            } else {
                // normal toggle behaviour
                $(element).removeClass(errorClass);
                $(element).addClass(validClass);
            }
        },

        // prepare the errors in the dialog box
        showErrors:function (errorMap) {
            EA.prepareValidationError(this, errorMap);
        },

        // show the dialog box
        invalidHandler:function () {
            $.mobile.changePage("#error-validation");
        },

        // execute when the form was successfully validated
        submitHandler:function () {
            // save date for expense form
            var month = $("#your-info-date-month").find("option[selected]").val();
            var year = $("#your-info-date-year").find("option[selected]").val();
            var date = new Date(year + "/" + month);

            if (EA.hasExpenseForm()) {
                // update the date in the expense form
                var form = EA.getExpenseForm();
                form.date = date.toISOString();
                EA.setExpenseForm(form);
            } else {
                // otherwhise make new expense form
                EA.setExpenseForm({
                    date:date.toISOString()
                });
            }

            // go the the next page according to the hidden value in the form.
            // this is because a user can also click on the menu and we have to
            // save the target of what he has clicked, so that we can go to
            // the next page accordingly
            $.mobile.changePage($("#your-info-next-page").val());
        }
    });
});

// by default, the user wil go to the overview page
$(document).on("pagebeforeshow", "#your-info", function () {
    $("#your-info-next-page").val("#overview");
});

// validation must be done when clicking on menu button
$(document).on("tap", "#your-info-menu-overview", function () {
    $("#your-info-form").submit();
});

// validation must be done when clicking on menu button
$(document).on("tap", "#your-info-menu-add-expense", function () {
    $("#your-info-next-page").val("#expense");
    $("#your-info-form").submit();
});

// validation must be done when clicking on menu button
$(document).on("tap", "#your-info-menu-sign-and-send", function () {
    $("#your-info-next-page").val("#sign-and-send");
    $("#your-info-form").submit();
});

// fill the form accordingly each time this page is visited
$(document).on("pagebeforecreate", "#your-info", function () {
    // get the day of today
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
            // previous month is December (not in JavaScript, so January is 1)
            month = 12;
            // of previous year
            year--;
        }
    }

    // set on screen
    $yearOptions.find("option[value='" + year + "']").attr("selected", true);
    $("#your-info-date-month").find("option[value='" + month + "']").attr("selected", true);

    // set other user information
    var user = EA.getUser();
    $("#your-info-firstname").val(user.firstName);
    $("#your-info-lastname").val(user.lastName);
    $("#your-info-employee-number").val(user.employeeNumber);
    $("#your-info-email").val(user.email);

    // generate unit options
    // there are 10 options according to Unit.java on the backend
    var $units = $("#your-info-units");
    for (var i = 1; i <= 10; i++) {
        $units.append('<option value="' + i + '">' + i + '</option>');
    }

    // select the unit according to the user
    $units.find("option[value='" + user.unitId + "']").attr("selected", true);

});