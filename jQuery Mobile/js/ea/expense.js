$(document).on("pageinit", "#expense", function () {

    // load currencies
    $.each(EA.currencies, function (i, currency) {
        $("#expense-currency").append("<option value=\"" + currency + "\">" + currency + "</option>")
    });
    $("#expense-currency").selectmenu("refresh");

    // Tabbar Abroad or Domestic
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

    // Autocomplete for project code
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

    // evidence to base64 via HTML5 canvas
    var base64file;
    $('#expense-evidence-file').change(function (e) {
        // get the file
        var file = e.target.files[0];

        // only images as files
        var imageType = /image.*/;
        if (!file.type.match(imageType)) {
            return;
        }

        // initialize reader
        var reader = new FileReader();

        if (reader == null) {
            // FileReaderAPI not supported
            $("#expense-evidence-base64").val("FileReaderAPI not supported");
        } else {
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
                    console.log(base64);
                    $("#expense-evidence-base64").val(base64);
                }
                img.src = e.target.result;
            };

            // read the image
            reader.readAsDataURL(file);
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
                "evidence":$("#expense-evidence-base64").val()
            });

            $.mobile.changePage("#sign-and-send");

            // clear the form
            $("#expense-form")[0].reset();
        }
    });

});