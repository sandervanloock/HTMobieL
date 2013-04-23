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
    $$("#create3-add-currency").parent().parent().parent().hide();
    $$("#create3-add-converted").parent().hide();
    $$("#create3-add-type").find("option[value='2']").remove();
    $$("#create3-add-type").find("option[value='3']").remove();
    $$("#create3-add-type").find("option[value='4']").remove();
    $$("#create3-add-type").append("<option value=\"2\">Lunch</option>");
    $$("#create3-add-type").append("<option value=\"3\">Diner</option>");
    $$("#create3-add-type").append("<option value=\"4\">Ticket</option>");

    // evidence to base64 via FileReaderAPI and HTML5 canvas
    $$('#create3-add-evidence')[0].onchange = function (e) {
        // get the file
        var file = e.target.files[0];

        if (window.FileReader) {
            // initialize reader
            var reader = new FileReader();
            // if the image was read, load it into the canvas
            reader.onload = function (e) {
                // get the canvas that is hidden on that page
                var canvas = $$('#create3-add-canvas')[0];
                var context = canvas.getContext('2d');
                var img = new Image();
                // if the image is in canvas, get base64
                img.onload = function () {
                    // set canvas dimensions to image dimensions
                    canvas.width = this.width;
                    canvas.height = this.height;
                    // draw the image on the canvas
                    context.drawImage(this, 0, 0);
                    // get the base64 string
                    var base64 = EA.base64WithoutPrefix(canvas.toDataURL());
                    // TODO check if this can fail in Lungo
                    Lungo.Data.Storage.session("tempEvidence", base64);
                    // hide loading screen
                    Lungo.Notification.hide();
                };
                img.src = e.target.result;
            };
            // show loading screen
            Lungo.Notification.show();
            reader.readAsDataURL(file);
        } else {
            alert("FileReaderAPI not supported");
        }
    };

    // hold local reference for performance
    var $$currency = $$("#create3-add-currency");
    var $$amount = $$("#create3-add-amount");
    var $$converted = $$("#create3-add-converted");

    // convert amount when amount was typed
    $$amount[0].onchange = showConvertedAmount;
    // or convert amount when a currency in the list was clicked
    $$currency[0].onchange = showConvertedAmount;

    function showConvertedAmount() {
        var amount = parseFloat($$amount.val());
        var rate = EA.getRateForCurrency($$currency.val());
        // check if the converted floats are legal
        if (!isNaN(amount) && !isNaN(rate)) {
            var converted = amount / rate;
            // show euro amount with 2 decimals
            $$converted.val(EA.formatEuro(converted).toString());
        } else {
            // set the converted value to empty
            $$converted.val("");
        }

    }
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
        "evidence": Lungo.Data.Storage.session("tempEvidence")
    };

    var localExpenses = Lungo.Data.Storage.persistent("localExpenses");
    if (!localExpenses) {
        expense.id = 1;
        Lungo.Data.Storage.persistent("localExpenses", [expense]);
    } else {
        expense.id = localExpenses.length + 1;
        localExpenses.push(expense);
        Lungo.Data.Storage.persistent("localExpenses", localExpenses);
    }
    Lungo.Data.Storage.session("tempEvidence", null);
    Lungo.Router.section("create2");
});

Lungo.dom("#create3-tab-abroad").on("tap", function () {
    $$("#create3-add-currency").parent().parent().parent().show();
    $$("#create3-add-converted").parent().show();
    toggleNavigationCreate3();
    $$("#create3-add-type").find("option[value='2']").remove();
    $$("#create3-add-type").find("option[value='3']").remove();
    $$("#create3-add-type").find("option[value='4']").remove();
});

Lungo.dom("#create3-tab-domestic").on("tap", function () {
    $$("#create3-add-currency").parent().parent().parent().hide();
    $$("#create3-add-converted").parent().hide();
    toggleNavigationCreate3();
    $$("#create3-add-type").append("<option value=\"2\">Lunch</option>");
    $$("#create3-add-type").append("<option value=\"3\">Diner</option>");
    $$("#create3-add-type").append("<option value=\"4\">Ticket</option>");
});

function toggleNavigationCreate3() {
    $$("#create3-tab-domestic").toggleClass("active");
    $$("#create3-tab-abroad").toggleClass("active");
}

/**
 * Date picker
 */
function showDatePicker() {
    Lungo.Sugar.DatePicker.startDatepicker('en', insertDate);
}

function insertDate(day, month, year) {
    $$("#create3-add-date").val(year + '/' + month + '/' + day);
}

/**
 * Auto completion
 */
Lungo.Sugar.AutoComplete().init({
    el: $$('#create3-add-project-code'),
    results_el: $$('#create3-add-results'),
    choices: Lungo.Data.Storage.persistent("projectCodes"),
    afterx: function (el, e) {
        alert(el.val());
    }
});