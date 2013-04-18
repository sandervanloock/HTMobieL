var ExpenseForm = kendo.data.Model.define( {
    fields : {
        "date": {
            type: 'date',
            defaultValue: new Date()
        },
        "employeeId": {
            type: 'int'
        },
        "signature": {
            type: 'string',
            validation: {
                required: true
            }
        },
        "remarks": {
            type : 'string'
        },
        "notification": {
            type: 'boolean',
            defaultValue: true
        }
    },
    reset: function(){
        this.set("date",new Date());
        this.set("employeeId",0);
        this.set("signature","");
        this.set("remarks","");
        this.set("notification",true);
    }
});

var expenseForm = new ExpenseForm();

function submitExpense(){
    // save data to expense form
    expenseForm.set("employeeId",EA.getUser().employeeId);
    expenseForm.set("signature",EA.base64WithoutPrefix($("#sign-and-send-signature").jSignature("getData")));
    EA.setExpenseForm(expenseForm);

    // check the expenses
    expenseDataSource.read();
    var expenses = expenseDataSource.data();

    if (expenses.length == 0) {
        // there are no expenses attached to this form
        EA.showDialog("No expenses", "You haven't attached any expenses to your form. Please do so.");
    } else if (!expenseForm.get("signature")) {
        EA.showDialog("No signature", "You haven't filled in a signature. Please do so.");
    } else {
        if (!navigator.onLine) {
            EA.showDialog("Offline", "You are currently offline. Your expense will be saved, please come back later to resend your expense.");
        } else {
            // attach expenses to the request
            expenseForm.expenses = expenses;

            // prepare the request
            var expenseRequest = {};
            expenseRequest.token = EA.getToken();
            expenseRequest.expenseForm = expenseForm.toJSON();

            console.log("Request: " + JSON.stringify(expenseRequest).length);
            console.log("Signature: " + expenseForm.signature.length);
            console.log("Expense[0]: " + expenses[0].evidence.length);

            // send it
            app.showLoading();
            $.ajax({
                type: "POST",
                url: EA.baseURL + "resources/expenseService/saveExpense",
                data: JSON.stringify(expenseRequest),
                //dataType:"json",
                contentType: "application/json",
                complete: function () {
                    // show spinner and text while uploading
                    app.hideLoading();
                },
                success: function () {
                    //open success form
                    var modalView = $("#success").data("kendoMobileModalView");
                    modalView.open();
                    //clear expenses
                    localStorage.removeItem("expenses");
                    //reset form
                    $("#sign-and-send-signature").jSignature("reset");
                    expenseForm.reset();
                },
                error: function () {
                    EA.showBackendError("Could not send expense to server");
                }
            });
        }
    }
}


$(document).on("click", "[id^=my-expenses-show-pdf]", function () {
    if (navigator.onLine) {
        var $hiddenForm = $('#my-expenses-form');

        var url = EA.baseURL + "resources/expenseService/getExpenseFormPDF";
        $hiddenForm[0].setAttribute('action', url);

        // get the id of the form that is requested
        var expenseFormId = $(this).attr("id").replace("my-expenses-show-pdf-", "");
        // guideline: AJAX is not for fetching raw data like a PDF.
        // to accomplish this, a hidden form is used and the requested data is
        // copied into that hidden form
        $("#my-expenses-token").val(EA.getToken());
        $("#my-expenses-form-id").val(expenseFormId);

        // submit that hidden form so the PDF will be downloaded
        $hiddenForm.submit();
    }
});