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
                // TODO add signature
                expenseForm.signature = null;
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
                                EA.localExpenses = [];
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