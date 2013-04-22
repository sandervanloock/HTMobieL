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
            expenseForm.signature = null;
            expenseForm.remarks = $$("#create4-sign-remarks").val();
            //TODO notification
            expenseForm.notification = null;
            expenseForm.expenses = localExpenses;
            // prepare the request
            var expenseRequest = {};
            expenseRequest.token = Lungo.Data.Storage.persistent("token");
            expenseRequest.expenseForm = expenseForm;
            //TODO save the expense form
        }
    }
});