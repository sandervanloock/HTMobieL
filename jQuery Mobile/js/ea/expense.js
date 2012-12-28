$(document).on("pageinit", "#expense", function () {

    /**
     * Load currencies
     */
    $.each(EA.currencies, function (i, currency) {
        $("#expense-currency").append("<option value=\"" + currency + "\">" + currency + "</option>")
    });
    $("#expense-currency").selectmenu("refresh");

    /**
     * Tabbar Abroad or Domestic
     */
    $("#expense-type-restaurant").parent().hide();
    $("#expense-currency-div").hide();

    // dingen tonen voor abroad
    $("#expense-tabbar-abroad").change(function () {
        $("#expense-type-train").parent().hide();
        $("#expense-type-restaurant-lunch").parent().hide();
        $("#expense-type-restaurant-diner").parent().hide();
        $("#expense-type-restaurant").parent().show();
        $("#expense-currency-div").show();
        $("#expense-type input:radio").each(function () {
            $(this).prop("checked", false);
            $(this).checkboxradio("refresh");
        });
    });

    // dingen tonen voor domestic
    $("#expense-tabbar-domestic").change(function () {
        $("#expense-type-train").parent().show();
        $("#expense-type-restaurant-lunch").parent().show();
        $("#expense-type-restaurant-diner").parent().show();
        $("#expense-type-restaurant").parent().hide();
        $("#expense-currency-div").hide();
        $("#expense-type input:radio").each(function () {
            $(this).prop("checked", false);
            $(this).checkboxradio("refresh");
        });
    });

    /**
     * Autocomplete for project code
     */
    $("#expense-project-code").autocomplete({
        target:$("#expense-suggestions"),
        source:EA.projectCodeSuggestions,
        callback:function (e) {
            var $a = $(e.currentTarget);
            $('#expense-project-code').val($a.text());
            $("#expense-project-code").autocomplete('clear');
        },
        minLength:1
    });

    /**
     * Form validation
     */
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
                currency = $("#expense-currency").val();
            } else {
                currency = "EUR";
            }

            EA.localExpenses.push({
                "date":date.toISOString(),
                "projectCode":$("#expense-project-code").val(),
                "currency":currency,
                "amount":$("#expense-amount").val(),
                "remarks":$("#expense-remarks").val(),
                "expenseTypeId":$("input[name=expense-type]:checked").val(),
                "expenseLocationId":$("input[name=expense-tabbar]:checked").val(),
                // TODO add evidence
                "evidence":null
            });

            $.mobile.changePage("#sign-and-send");

            // clear the form
            $("#expense-form")[0].reset();
        }
    });

});