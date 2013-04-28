Lungo.dom("#create4-sign-button").on("tap", function () {
    var localExpenses = Lungo.Data.Storage.persistent("localExpenses");
    // then show the items, if there are any
    if (!localExpenses) {
        Lungo.Notification.error(
            // Title
            "Error",
            // Description
            "There are no expenses to upload",
            // Icon
            "warning",
            // Time on screen
            0,
            // Callback function
            null
        );
    } else {
        // upload expense form
        if (!navigator.onLine) {
            // TODO where to put the description?
            Lungo.Notification.show(
                // Title
                "You are currently offline. Your expense will be saved, please come back later to resend your expense.",
                // Icon
                "message",
                // Time on screen
                7,
                // Callback function
                null
            );
        } else {
            // make expense form
            var expenseForm = {};
            expenseForm.date = new Date().toISOString();
            expenseForm.employeeId = Lungo.Data.Storage.persistent("user").id;
            //TODO signature
            expenseForm.signature = Signature.base64;
            expenseForm.remarks = $$("#create4-sign-remarks").val();
            // off = 1 and on = 0
            expenseForm.notification = $$("#create4-sign-notification").val() == 0;
            expenseForm.expenses = localExpenses;
            // prepare the request
            var expenseRequest = {};
            expenseRequest.token = Lungo.Data.Storage.persistent("token");
            expenseRequest.expenseForm = expenseForm;

            // sending data
            Lungo.Notification.show();
            console.log("saving the expense");
            $$.ajaxSettings.headers["Content-Type"] = "application/json";
            $$.ajax({
                type: 'POST',
                url: EA.baseURL + 'resources/expenseService/saveExpense',
                data: JSON.stringify(expenseRequest),
                // accepting data
                dataType: 'json', //'json', 'xml', 'html', or 'text'
                async: true,
                success: function () {
                    Lungo.Data.Storage.persistent("localExpenses", null);
                    Lungo.Notification.success(
                        "Success", //Title
                        "The expense form was uploaded successfully.", //Description
                        "check", //Icon
                        5, //Time on screen
                        function () {
                            Lungo.Router.section("home");
                        } //Callback function
                    );
                },
                error: function () {
                    Lungo.Notification.error(
                        // Title
                        "Error",
                        // Description
                        "Could not upload the expense form.",
                        // Icon
                        "cancel",
                        // Time on screen
                        0,
                        // Callback function
                        null
                    );
                }
            });
        }
    }
});