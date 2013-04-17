Lungo.dom("#view").on("load", function () {
// show loading screen
    Lungo.Notification.show();
    // make the AJAX-request
    Lungo.Service.post(
        // url
        EA.baseURL + "resources/expenseService/getExpenseForms",
        // data
        {
            "token": Lungo.Data.Storage.persistent("token")
        },
        // callback
        function (xml) {
            // hide loading screen
            Lungo.Notification.hide();
            // variable of expense forms
            var expenseForms = [];
            // parse XML response
            $$(xml).find("expenseForm").each(function () {
                var $$this = $$(this);
                var expenseForm = {};
                expenseForm.date = $$this.find("date").text();
                expenseForm.id = $$this.find("id").text();
                expenseForm.statusId = $$this.find("statusId").text();
                expenseForms.push(expenseForm);
            });
            // persist the expense forms
            Lungo.Data.Storage.persistent("expenseForms", expenseForms);
            // show items in list
            var li;
            var $$expenseList = $$("#view-screen ul");
            // first empty the list
            $$expenseList.empty();
            // then show the items, if there are any
            if (expenseForms.length == 0) {
                $$expenseList.append("<li>No expenses submitted.</li>");
            } else {
                $$.each(expenseForms, function (i, expense) {
                    li = "<li class=\"arrow\">";
                    li += "<strong>" + EA.toBelgianDate(new Date(expense.date)) + "</strong>";
                    li += "<small>" + EA.expenseStatusIdToString(expense.statusId) + "</small>";
                    li += "</li>";
                    $$expenseList.append(li);
                });
            }
        },
        // type
        "xml"
    );
});