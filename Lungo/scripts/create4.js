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
        // make expense form
        var expenseForm = {};
        expenseForm.date = new Date().toISOString();
        expenseForm.employeeId = Lungo.Data.Storage.persistent("user").id;
        expenseForm.signature = null;
        expenseForm.remarks = $$("#create4-sign-remarks").val();
        expenseForm.notification = null;
        // prepare the request
        var expenseRequest = {};
        expenseRequest.token = Lungo.Data.Storage.persistent("token");
        expenseRequest.expenseForm = expenseForm;
        // upload expense form
        Lungo.Service.post(
            // url
            EA.baseURL + "resources/expenseService/saveExpense",
            // data
            JSON.stringify(expenseRequest),
            // callback
            function (response) {
                console.log(response);
            },
            // type
            "json"
        );
    }
});