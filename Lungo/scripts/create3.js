Lungo.dom("#create3").on("load", function () {
    // show currencies
    var $$currencyList = $$("#create3-add-currency");
    var currencies = Lungo.Data.Storage.persistent("currencies");
    $$currencyList.empty();
    $$.each(currencies, function (i, currency) {
        $$currencyList.append("<option value=\"" + currency.name + "\">" + currency.name + "</option>");
    });

    // reset view
    $$("#create3-add-form")[0].reset();
    $$("#create3-tab-domestic").addClass("active");
    $$("#create3-tab-abroad").removeClass("active");
    $$("#create3-add-currency").parent().parent().hide();
    $$("#create3-add-converted").parent().hide();
    $$("#create3-add-type").find("option[value='2']").remove();
    $$("#create3-add-type").find("option[value='3']").remove();
    $$("#create3-add-type").find("option[value='4']").remove();
});

Lungo.dom("#create3-add-button").on("tap", function () {
    var date = new Date($$("#create3-add-date").val());
    var currency, expenseLocation;
    if ($$("#create3-tab-domestic").hasClass("active")) {
        currency = "EUR";
        expenseLocation = 1;
    } else {
        currency = $$("#create3-add-currency").val();
        expenseLocation = 2;
    }

    var expense = {
        "date": date.toISOString(),
        "projectCode": $$("#create3-add-project-code").val(),
        "currency": currency,
        "amount": parseFloat($$("#create3-add-amount").val()),
        "remarks": $$("#create3-add-remarks").val(),
        "expenseTypeId": parseInt($$("#create3-add-type").val()),
        "expenseLocationId": expenseLocation,
        // TODO below
        "evidence": null
    };

    var localExpenses = Lungo.Data.Storage.persistent("localExpenses");
    if (!localExpenses) {
        Lungo.Data.Storage.persistent("localExpenses", [expense]);
    } else {
        localExpenses.push(expense);
        Lungo.Data.Storage.persistent("localExpenses", localExpenses);
    }
    Lungo.Router.section("create2");
});

Lungo.dom("#create3-tab-abroad").on("tap", function () {
    $$("#create3-add-currency").parent().parent().show();
    $$("#create3-add-converted").parent().show();
    toggleNavigation();
    $$("#create3-add-type").append("<option value=\"2\">Lunch</option>");
    $$("#create3-add-type").append("<option value=\"3\">Diner</option>");
    $$("#create3-add-type").append("<option value=\"4\">Ticket</option>");
});

Lungo.dom("#create3-tab-domestic").on("tap", function () {
    $$("#create3-add-currency").parent().parent().hide();
    $$("#create3-add-converted").parent().hide();
    toggleNavigation();
    $$("#create3-add-type").find("option[value='2']").remove();
    $$("#create3-add-type").find("option[value='3']").remove();
    $$("#create3-add-type").find("option[value='4']").remove();
});

function toggleNavigation() {
    $$("#create3-tab-domestic").toggleClass("active");
    $$("#create3-tab-abroad").toggleClass("active");
}