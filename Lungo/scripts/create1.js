Lungo.dom("#create1").on("load", function () {
    // set user info into the form
    var user = Lungo.Data.Storage.persistent("user");
    $$("#create1-info-first-name").val(user.firstName);
    $$("#create1-info-last-name").val(user.lastName);
    $$("#create1-info-employee-number").val(user.employeeNumber);
    $$("#create1-info-email").val(user.email);
    // generate unit options
    // there are 10 options according to Unit.java on the backend
    var $$units = $$("#create1-info-units");
    $$units.empty();
    $$units.append("<option value=\"\">Unit</option>");
    for (var i = 1; i <= 10; i++) {
        $$units.append("<option value=\"" + i + "\">" + i + "</option>");
    }
    // select the unit according to the user
    $$units.find("option[value='" + user.unitId + "']").attr("selected", true);
});