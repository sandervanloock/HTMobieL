$(document).on("pageshow", "#sign-and-send", function () {
    // hold local reference for performance
    var $signature = $("#sign-and-send-signature");

    // when this line is in pageinit or pagebeforeshow, it cannot know
    // width and heigh of the page, therefore it is placed here, but
    // because this code is executed everytime the page is viewed,
    // multiple signature fields would come up,
    // so we just check if the canvas is there or not
    if ($signature.find("canvas").length == 0) {
        // no signature canvas was present, make one
        $signature.jSignature();
    }

    // load local data if available
    if (EA.hasExpenseForm()) {
        // load data into form
        var expenseForm = EA.getExpenseForm();

        // check if the status notification via email was already set
        if (expenseForm.notification != null && !expenseForm.notification) {
            var $notification = $("#sign-and-send-notification");
            $notification.find("option[value=on]").attr("selected", false);
            $notification.find("option[value=off]").attr("selected", true);
            $notification.slider("refresh");
        }
    }

    // TODO delete me (developping purposes)
    $signature.bind("change", function () {
        $("#sign-and-send-signature-base64").val($signature.jSignature("getData"));
    });
});

$(document).on("tap", "#sign-and-send-signature-reset", function () {
    // clear the signature when user wants to redraw it
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
                    EA.showDialog("No expenses", "You haven't attached any expenses to your form. Please do so.");
                } else {
                    // TODO check if online or offline
                    if (false) {
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
                        // TODO save expense on backend
                        /*$.ajax({
                         type:"POST",
                         url:"http://kulcapexpenseapp.appspot.com/resources/expenseService/saveExpense",
                         data:JSON.stringify(expenseRequest),
                         dataType:"json",
                         // The 'contentType' property sets the 'Content-Type' header.
                         // The JQuery default for this property is
                         // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
                         // a preflight. If you set this value to anything other than
                         // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
                         // you will trigger a preflight request.
                         contentType:"application/json",
                         beforeSend:function () {
                         // show spinner while uploading
                         $.mobile.loading("show");
                         },
                         complete:function () {
                         // hide spinner after uploading
                         $.mobile.loading("hide");
                         },
                         success:function () {
                         // clear the local expense form
                         EA.clearExpenseForm();
                         // show
                         $.mobile.changePage("#success");
                         },
                         error:function () {
                         EA.showBackendError("Could not send expense to server");
                         }
                         });*/
                        clearAndShowSuccess();
                    }
                }
            }
        }
    });
});

function clearAndShowSuccess() {
// clear the local expense form
    EA.clearExpenseForm();
    // show success dialog
    $.mobile.changePage("#success");
}