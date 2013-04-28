Lungo.dom("#create1").on("load", function () {
    // set user info into the form
    var user = Lungo.Data.Storage.persistent(EA.app + "user");
    $$("#create1-info-first-name").val(user.firstName);
    $$("#create1-info-last-name").val(user.lastName);
    $$("#create1-info-employee-number").val(user.employeeNumber);
    $$("#create1-info-email").val(user.email);
    // generate unit options
    // there are 10 options according to Unit.java on the backend
    var $$units = $$("#create1-info-units");
    $$units.empty();
    for (var i = 1; i <= 10; i++) {
        $$units.append("<option value=\"" + i + "\">" + i + "</option>");
    }
    // select the unit according to the user
    $$units.find("option[value='" + user.unitId + "']").attr("selected", true);

    // get the day of today
    var today = new Date();
    var year = today.getFullYear();
    var day = today.getDate();
    var month = today.getMonth();

    // generate year options for this, previous and next year
    var $$yearOptions = $$("#create1-info-year");
    $$yearOptions.empty();
    var years = [year + 1, year, year - 1];
    $$(years).each(function (i, year) {
        $$yearOptions.append('<option value="' + year + '">' + year + '</option>');
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
    $$yearOptions.val(year.toString());
    $$("#create1-info-month").val((month + 1).toString());
});

Lungo.dom("#create1-info-submit").on("tap", function () {
    Lungo.Router.section("create2");
});