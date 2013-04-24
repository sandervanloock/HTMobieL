$(document).on("pageinit", "#your-info", function () {

    // fill the form accordingly
    initializeForm();

    // custom validation rules
    $.validator.addMethod("isCorrectMonth", function (value) {
        var today = new Date();
        var day = today.getDate();
        var month = today.getMonth() + 1; // January is 0

        // month and year should be equal to this month if day > 15th
        if (day > 15) {
            return month == value;
        } else {
            // it must be the previous month
            if (month == 1) {
                return 12 == value;
            } else {
                return month - 1 == value;
            }
        }
    }, "Select the right month according to the Capgemini policy");

    $.validator.addMethod("isCorrectYear", function (value) {
        var today = new Date();
        var day = today.getDate();
        var month = today.getMonth() + 1; // January is 0
        var year = today.getFullYear();

        // month and year should be equal to this month if day > 15th
        if (day > 15) {
            return year == value;
        } else {
            // it must be the previous month, validate the year accordingly
            if (month == 1) {
                return year - 1 == value;
            } else {
                return year == value;
            }

        }
    }, "Select the right year according to the Capgemini policy");


    // initialize validation for the form
    $("#your-info-form").validate({

        // rules for the form validation
        rules:{
            "your-info-date-month":{
                "required":true,
                "isCorrectMonth":true
            },
            "your-info-date-year":{
                "required":true,
                "isCorrectYear":true
            },
            "your-info-employee-number":{
                "required":true,
                // redundant, because of the input type number,
                // the plugin will already check for a valid number
                "number":true
            },
            "your-info-units":"required",
            "your-info-email":{
                "required":true,
                // redundant, because of the input type email,
                // the plugin will already check for a valid email address
                "email":true
            }
        },

        // needed for bug that shows keyboard and dialog at the same time
        focusInvalid:false,

        // no real time validation checking needed
        onkeyup:false,
        onfocusout:false,

        errorPlacement:function () {
            // no body, because we want no error labels on the form
        },

        // custom highlight function
        highlight:function (element, errorClass, validClass) {
            var $element = $(element);
            if ($element[0].tagName === "SELECT" || $element[0].tagName === "INPUT") {
                // we have to take special care for the red border around select items
                // but also, as of jQM 1.3, around input fields
                $element.parent().addClass("red-border");
            } else {
                // normal toggle behaviour
                $element.removeClass(validClass);
                $element.addClass(errorClass);
            }
        },

        // custom unhighlight function
        unhighlight:function (element, errorClass, validClass) {
            var $element = $(element);
            if ($element[0].tagName === "SELECT" || $element[0].tagName === "INPUT") {
                // we have to take special care for the red border around select items
                // but also, as of jQM 1.3, around input fields
                $element.parent().removeClass("red-border");
            } else {
                // normal toggle behaviour
                $element.removeClass(errorClass);
                $element.addClass(validClass);
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
            var date = new Date(year + "/" + month + "/01");

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
            // clear the form data
            initializeForm();
        }
    });

});

$(document).on("pagebeforeshow", "#your-info", function () {
    // by default, the user wil go to the overview page
    $("#your-info-next-page").val("#overview");
});

// validation must be done when clicking on menu button
$(document).on("click", "#your-info-menu-overview", function () {
    $("#your-info-form").submit();
});

// validation must be done when clicking on menu button
$(document).on("click", "#your-info-menu-add-expense", function () {
    $("#your-info-next-page").val("#expense");
    $("#your-info-form").submit();
});

// validation must be done when clicking on menu button
$(document).on("click", "#your-info-menu-sign-and-send", function () {
    $("#your-info-next-page").val("#sign-and-send");
    $("#your-info-form").submit();
});

// navigation for smartphones
$(document).on("click", "#your-info-subheader", function () {
    $.mobile.changePage("#add");
});

function initializeForm() {
    // get the day of today
    var today = new Date();
    var year = today.getFullYear();
    var day = today.getDate();
    var month = today.getMonth();

    // generate year options for this, previous and next year
    var $yearOptions = $("#your-info-date-year");
    $yearOptions.empty();
    var years = [year + 1, year, year - 1];
    $yearOptions.append('<option value="">Year</option>');
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
        } else {
            month--;
        }
    }

    // select according to rule
    $yearOptions.find("option[value='" + year + "']").attr("selected", true);
    var $monthOptions = $("#your-info-date-month");
    $monthOptions.find("option[value='" + (month + 1) + "']").attr("selected", true);

    // set on screen
    $yearOptions.selectmenu('refresh');
    $monthOptions.selectmenu('refresh');

    // set other user information
    var user = EA.getUser();
    $("#your-info-firstname").val(user.firstName);
    $("#your-info-lastname").val(user.lastName);
    $("#your-info-employee-number").val(user.employeeNumber);
    $("#your-info-email").val(user.email);

    // generate unit options
    // there are 10 options according to Unit.java on the backend
    var $units = $("#your-info-units");
    $units.empty();
    $units.append('<option value="">Unit</option>');
    for (var i = 1; i <= 10; i++) {
        $units.append('<option value="' + i + '">' + i + '</option>');
    }

    // select the unit according to the user
    $units.find("option[value='" + user.unitId + "']").attr("selected", true);
    $units.selectmenu('refresh');
}