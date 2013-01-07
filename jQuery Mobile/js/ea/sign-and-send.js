$(document).on("pageinit", "#sign-and-send", function () {

    // form validation
    $("#sign-and-send-form").validate({
        submitHandler:function (form) {

            var expenses = EA.getLocalExpenses();

            if (expenses.length == 0) {
                // there are no expenses attached to this form
                EA.showDialog("No expenses", "<p>You haven't attached any expenses to your form. Please do so.</p>");
            } else {
                var notification = $("#sign-and-send-notification").val() == "on";

                var expenseForm = {
                    "date":(new Date()).toISOString(),
                    "employeeId":EA.getUser().id,
                    // TODO add signature
                    "signature":null,
                    "remarks":$("#sign-and-send-remarks").val(),
                    "notification":notification
                };

                EA.setExpenseForm(expenseForm);

                // TODO check if online or offline
                if (true) {
                    EA.showDialog("Offline", "You are currently offline. Your expense will be saved, please come back later to resend your expense.");
                } else {
                    expenseForm.localExpenses = expenses;

                    var expenseRequest = {};
                    expenseRequest.token = EA.getToken();
                    expenseRequest.expenseForm = expenseForm;
                    console.log(JSON.stringify(expenseRequest));

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
    });
});