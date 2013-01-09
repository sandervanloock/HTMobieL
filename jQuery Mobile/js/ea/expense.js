$(document).on("pagebeforecreate", "#expense", function () {
    // hold local reference for performance
    var $expenseCurrency = $("#expense-currency");

    // load currencies into list
    $.each(EA.getCurrencies(), function (i, currency) {
        $expenseCurrency.append("<option value=\"" + currency.rate + "\">" + currency.name + "</option>")
    });
});

$(document).on("pageinit", "#expense", function () {
    // check for HTML5 date input type support
    if (!Modernizr.inputtypes.date) {
        // add fallback that makes a custom datepicker for that field
        $("#expense-date")
            .attr("data-role", "datebox")
            .attr("data-options", '{"mode": "calbox", "overrideCalStartDay": 1}');
    }

    // hold local reference for performance
    var $expenseCurrency = $("#expense-currency");
    var $expenseAmount = $("#expense-amount");
    var $expenseCurrencyConverted = $("#expense-amount-converted");

    // convert amount when amount was typed
    $expenseAmount.change(showConvertedAmount);
    // or convert amount when a currency in the list was clicked
    $expenseCurrency.change(showConvertedAmount);

    function showConvertedAmount() {
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

    // tabbar abroad or domestic
    $("#expense-type-restaurant").parent().hide();
    $("#expense-currency-div").hide();
    $expenseCurrencyConverted.parent().hide();

    // shows form items for abroad
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

    // shows form items for domestic
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

    // autocomplete for project code
    // limitation to 5 project code was made into jqm.autoComplete-1.5.0.js
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

        // TODO: add check from Modernizr instead of own code
        if (window.FileReader) {
            // initialize reader
            var reader = new FileReader();
            // if the image was read, load it into the canvas
            reader.onload = function (e) {
                // get the canvas that is hidden on that page
                var canvas = $('#expense-evidence-canvas')[0];
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
                    var base64 = canvas.toDataURL();
                    // TODO delete me (developping purposes)
                    $("#expense-evidence-base64").val(base64);
                }
                img.src = e.target.result;
            };

            // read the image
            reader.readAsDataURL(file);
        } else {
            // FileReaderAPI is not supported
            // TODO find a solution

            // TODO delete me (developping purposes)
            $("#expense-evidence-base64").val("FileReaderAPI not supported");
        }
    });

    // initialize form validation
    $("#expense-form").validate({

        rules:{
            "expense-date":"required",
            "expense-project-code":"required",
            "expense-type":"required",
            "expense-amount":{
                required:true,
                min:0 // a negative amount is not valid
            },
            "expense-currency":"required",
            "expense-remarks":{
                required:function () {
                    // remarks are required when other is checked
                    return $("#expense-type-other").is(":checked");
                }
            },
            "expense-evidence-file":"required"
        },

        // needed for bug that shows keyboard and dialog at the same time
        focusInvalid:false,

        // no real time validation checking needed
        onkeyup:false,
        onfocusout:false,

        errorPlacement:function () {
            // no body, because we want no error labels on the form
        },

        // custom highlight function due to select item and radio buttons
        highlight:function (element, errorClass, validClass) {
            var $element = $(element);
            if ($element[0].tagName === "SELECT") {
                // we have to take special care for the red border around select items
                $element.parent().addClass("red-border");
            } else if ($element.attr("type") === "radio") {
                // we have to take special care for the red border around radio buttons
                $element.parent().parent().addClass("red-border");
            } else {
                // normal toggle behaviour
                $element.removeClass(validClass);
                $element.addClass(errorClass);
            }
        },

        // custom unhighlight function due to select item
        unhighlight:function (element, errorClass, validClass) {
            var $element = $(element);
            if ($element[0].tagName === "SELECT") {
                // we have to take special care for the red border around select items
                $element.parent().removeClass("red-border");
            } else if ($element.attr("type") === "radio") {
                // we have to take special care for the red border around radio buttons
                $element.parent().parent().removeClass("red-border");
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
        submitHandler:function (form) {
            var date = new Date($("#expense-date").val());
            var currency;

            if ($("#expense-currency-div").is(":visible")) {
                //noinspection JSValidateTypes
                currency = $("#expense-currency").children(":selected").text();
            } else {
                currency = "EUR";
            }

            // save the expense locally
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