$(document).on("pagebeforecreate", "#expense", function () {
    // datum HTML5 ondersteuning
    if (!Modernizr.inputtypes.date) {
        alert("date not supported");
        $("#expense-date").attr("data-role", "datebox")
            .attr("data-options", '{"mode": "calbox", "overrideCalStartDay": 1}');
    }
});

$(document).on("pageinit", "#expense", function () {
    // hold local reference for performance
    var $expenseCurrency = $("#expense-currency");
    var $expenseAmount = $("#expense-amount");
    var $expenseCurrencyConverted = $("#expense-amount-converted");

    // load currencies into list
    $.each(EA.getCurrencies(), function (i, currency) {
        $expenseCurrency.append("<option value=\"" + currency.rate + "\">" + currency.name + "</option>")
    });
    $expenseCurrency.selectmenu("refresh");

    // convert amount when amount was typed
    $expenseAmount.change(showConvertedAmount);
    // or convert amount when a currency in the list was clicked
    $expenseCurrency.change(showConvertedAmount);

    function showConvertedAmount() {
        if (false) {
            // TODO if offline, can't convert currency
        } else {
            var amount = parseFloat($expenseAmount.val());
            var rate = parseFloat($expenseCurrency.val());
            // check if the converted floats are legal
            if (!isNaN(amount) && !isNaN(rate)) {
                var converted = amount / rate;
                // show euro amount with 2 decimals
                $expenseCurrencyConverted.val(EA.formatEuro(converted));
            } else {
                // set the converted value to empty
                $expenseCurrencyConverted.val("");
            }
        }
    }

    // Tabbar Abroad or Domestic
    $("#expense-type-restaurant").parent().hide();
    $("#expense-currency-div").hide();
    $expenseCurrencyConverted.parent().hide();

    // dingen tonen voor abroad
    $("#expense-tabbar-abroad").change(function () {
        $("#expense-type-ticket").parent().hide();
        $("#expense-type-restaurant-lunch").parent().hide();
        $("#expense-type-restaurant-diner").parent().hide();
        $("#expense-type-restaurant").parent().show();
        $("#expense-currency-div").show();
        $expenseCurrencyConverted.parent().show();
        $("#expense-type ").find("input:radio").each(function () {
            $(this).prop("checked", false);
            $(this).checkboxradio("refresh");
        });
    });

    // dingen tonen voor domestic
    $("#expense-tabbar-domestic").change(function () {
        $("#expense-type-ticket").parent().show();
        $("#expense-type-restaurant-lunch").parent().show();
        $("#expense-type-restaurant-diner").parent().show();
        $("#expense-type-restaurant").parent().hide();
        $("#expense-currency-div").hide();
        $expenseCurrencyConverted.parent().hide();
        $("#expense-type").find("input:radio").each(function () {
            $(this).prop("checked", false);
            $(this).checkboxradio("refresh");
        });
    });

    // Autocomplete for project code
    $("#expense-project-code").autocomplete({
        target:$("#expense-suggestions"),
        source:EA.getProjectCodeSuggestions(),
        callback:function (e) {
            var $a = $(e.currentTarget);
            $('#expense-project-code').val($a.text());
            $("#expense-project-code").autocomplete('clear');
        },
        minLength:1
    });

    // evidence to base64 via FileReaderAPI and HTML5 canvas
    $('#expense-evidence-file').change(function (e) {
        // get the file
        var file = e.target.files[0];

        // TODO: add support from Modernizr instead of own code
        if (window.FileReader) {
            // initialize reader
            var reader = new FileReader();
            // if the image was read, load it into the canvas
            reader.onload = function (e) {
                var canvas = $('#expense-evidence-canvas')[0];
                var context = canvas.getContext('2d');
                var img = new Image();
                img.onload = function () {
                    // set canvas dimensions to image dimensions
                    canvas.width = this.width;
                    canvas.height = this.height;
                    // draw the image on the canvas
                    context.drawImage(this, 0, 0);
                    // get the base64 string
                    var base64 = canvas.toDataURL("image/png");
                    // for developing and testing purposes
                    $("#expense-evidence-base64").val(base64);
                }
                img.src = e.target.result;
            };

            // read the image
            reader.readAsDataURL(file);
        } else {
            // FileReaderAPI is not supported
            $("#expense-evidence-base64").val("FileReaderAPI not supported");
        }

    });

    // form validation
    $("#expense-form").validate({
        rules:{
            "expense-date":{
                required:true
            },
            "expense-project-code":{
                required:true
            },
            "expense-type":{
                required:true
            },
            "expense-amount":{
                required:true,
                min:0 // a negative amount is not valid
            },
            "expense-remarks":{
                required:function () {
                    return $("#expense-type-other").is(":checked");
                }
            },
            "expense-evidence-file":{
                required:true
            }
        },
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
            var date = new Date($("#expense-date").val());

            var currency;
            if ($("#expense-currency-div").is(":visible")) {
                //noinspection JSValidateTypes
                currency = $("#expense-currency").children(":selected").text();
            } else {
                currency = "EUR";
            }

            EA.addLocalExpense({
                "date":date.toISOString(),
                "projectCode":$("#expense-project-code").val(),
                "currency":currency,
                "amount":$("#expense-amount").val(),
                "remarks":$("#expense-remarks").val(),
                "expenseTypeId":$("input[name=expense-type]:checked").val(),
                "expenseLocationId":$("input[name=expense-tabbar]:checked").val(),
                "evidence":$("#expense-evidence-base64").val()
            });

            $.mobile.changePage("#overview");

            // clear the form
            $("#expense-form")[0].reset();
        }
    });

});