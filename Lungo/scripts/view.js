Lungo.dom("#view").on("load", function () {
    retrieve_forms(true);
});

var pull_forms = new Lungo.Element.Pull('#view-screen', {
    onPull: "Pull down to refresh",
    onRelease: "Release to get new data",
    onRefresh: "Refreshing...",
    callback: function () {
        retrieve_forms(false);
        pull_forms.hide();
    }
});

function retrieve_forms(showLoadingScreen) {
    if (showLoadingScreen) {
        Lungo.Notification.show();
    }
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
            if (showLoadingScreen) {
                Lungo.Notification.hide();
            }
            // variable of expense forms
            var serverForms = [];
            // parse XML response
            $$(xml).find("expenseForm").each(function () {
                var $$this = $$(this);
                var expenseForm = {};
                expenseForm.date = $$this.find("date").text();
                expenseForm.id = $$this.find("id").text();
                expenseForm.statusId = $$this.find("statusId").text();
                serverForms.push(expenseForm);
            });
            // persist the expense forms
            Lungo.Data.Storage.persistent("serverForms", serverForms);
            // show items in list
            var li;
            var $$formList = $$("#view-screen ul");
            // first empty the list
            $$formList.empty();
            // then show the items, if there are any
            if (serverForms.length == 0) {
                $$formList.append("<li>No expenses submitted.</li>");
            } else {
                $$.each(serverForms, function (i, expense) {
                    li = "<li class=\"arrow\">";
                    li += "<a id=\"form-show-pdf-" + expense.id + "\">";
                    li += "<strong>" + EA.toBelgianDate(new Date(expense.date)) + "</strong>";
                    li += "<small>" + EA.expenseStatusIdToString(expense.statusId) + "</small>";
                    li += "</a></li>";
                    $$formList.append(li);
                });
            }
        },
        // type
        "xml"
    );
}

// when the users clicks on an expense form, download it in PDF-format
Lungo.dom("[id^=form-show-pdf]").on("tap", function () {
    console.log("tapped");
});