$(document).on("pageshow", "#sign-and-send", function () {
    // hold local reference for performance
    var $signature = $("#sign-and-send-signature");

    // when this line is in pageinit or pagebeforeshow, it cannot know
    // width and heigh of the page, therefore it is placed here, but
    // because this code is executed everytime the page is viewed,
    // multiple signature fields would come up,
    // so we just check if the canvas is there or not
    if ($signature.find("canvas").length == 0) {
        // no signature canvas was present, so make one
        $signature.jSignature();
    }
    // load local data if available
    if (EA.hasExpenseForm()) {
        // load data into form
        var expenseForm = EA.getExpenseForm();
        $("#sign-and-send-signature").jSignature("setData", expenseForm.signature);
        $("#sign-and-send-remarks").val(expenseForm.remarks);

        if (!expenseForm.notification) {
            $("#sign-and-send-notification").find("option[value=on]").attr("selected", false);
            $("#sign-and-send-notification").find("option[value=off]").attr("selected", true);
            $("#sign-and-send-notification").slider("refresh");
        }
    }

    // TODO delete me (developping purposes)
    $signature.bind("change", function () {
        $("#sign-and-send-signature-base64").val($signature.jSignature("getData"));
    });
});

$(document).on("tap", "#sign-and-send-signature-reset", function () {
    $("#sign-and-send-signature").jSignature("reset");

    // TODO delete me (developping purposes)
    $("#sign-and-send-signature-base64").val("");
});

$(document).on("pageinit", "#sign-and-send", function () {
    // form validation
    $("#sign-and-send-form").validate({
        submitHandler:function (form) {
            // !EA.hasExpenseForm()
            if (false) {
                EA.showDialog("Information missing", "<p>You haven't go through step 1. Please do so</p>");
            } else {
                var notification = $("#sign-and-send-notification").val() == "on";

                // save data to expense form
                // var expenseForm = EA.getExpenseForm();
                var expenseForm = {};
                expenseForm.date = new Date().toISOString();
                expenseForm.employeeId = EA.getUser().id;
                expenseForm.signature = $("#sign-and-send-signature").jSignature("getData");
                expenseForm.remarks = $("#sign-and-send-remarks").val();
                expenseForm.notification = notification;
                EA.setExpenseForm(expenseForm);

                // check the expenses
                var expenses = EA.getLocalExpenses();

                if (expenses.length == 0) {
                    // there are no expenses attached to this form
                    EA.showDialog("No expenses", "<p>You haven't attached any expenses to your form. Please do so.</p>");
                } else {
                    // TODO check if online or offline
                    if (true) {
                        EA.showDialog("Offline", "You are currently offline. Your expense will be saved, please come back later to resend your expense.");
                    } else {
                        // attach expenses to the request
                        expenseForm.expenses = expenses;

                        // prepare the request
                        var expenseRequest = {};
                        expenseRequest.token = EA.getToken();
                        expenseRequest.expenseForm = expenseForm;
                        console.log(JSON.stringify(expenseRequest));

                        // send it
                        $.ajax({
                            type:"POST",
                            url:"http://kulcapexpenseapp.appspot.com/resources/expenseService/saveExpense",
                            data:JSON.stringify(expenseRequest),
                            dataType:"json",
                            contentType:"application/json",
                            processData:false,
                            beforeSend:function () {
                                $.mobile.loading("show");
                            },
                            success:function () {
                                EA.clearExpenseForm();
                                $.mobile.changePage("#home");
                            },
                            error:function (xhr, textStatus, errorThrown) {
                                EA.showError("Backend error: " + xhr.status, errorThrown);
                            },
                            complete:function () {
                                $.mobile.loading("hide");
                            }
                        });
                    }
                }
            }
        }
    });
});