$(document).on("pageinit", "#step3", function () {
    $("#step3-form").validate({
        rules:{
            "step3-date":{
                required:true
            },
            "step3-project-code":{
                required:true
            },
            "step3-amount":{
                required:true,
                min:0 // a negative amount is not valid
            },
            "step3-remarks":{
                required:function () {
                    return $("#step3-type-other").is(":checked");
                }
            }
        },
        focusInvalid:false,
        submitHandler:function (form) {
            $.mobile.changePage("#step4");
        },
        invalidHandler:function (form, validator) {
            EA.showErrorDialog("Validation error", "Some of the fields were not filled in correctly. Please correct the indicated fields.");
        }
    });
});

$(document).on("pageinit", "#step3", function () {

    var availableTags = ['tim', 'tam', 'tom'];

    $("#step3-project-code").autocomplete({
        target:$("#step3-suggestions"),
        source:availableTags,
        callback:function (e) {
            var $a = $(e.currentTarget);
            $('#step3-project-code').val($a.text());
            $("#step3-project-code").autocomplete('clear');
        },
        minLength:1
    });
});