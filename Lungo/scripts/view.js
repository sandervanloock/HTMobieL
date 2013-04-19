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
                    li = "<li class=\"arrow\" onclick=\"showPdf(" + expense.id + ")\">";
                    li += "<strong>" + EA.toBelgianDate(new Date(expense.date)) + "</strong>";
                    li += "<small>" + EA.expenseStatusIdToString(expense.statusId) + "</small>";
                    li += "</li>";
                    $$formList.append(li);
                });
            }
        },
        // type
        "xml"
    );
}

function showPdf(id) {
    var $$hiddenForm = $$('#view-form');
    var url = EA.baseURL + "resources/expenseService/getExpenseFormPDF";
    $$hiddenForm[0].setAttribute('action', url);
    // guideline: AJAX is not for fetching raw data like a PDF.
    // to accomplish this, a hidden form is used and the requested data is
    // copied into that hidden form
    $$("#view-form-token").val(Lungo.Data.Storage.persistent("token"));
    $$("#view-form-id").val(id.toString());
    // submit that hidden form so the PDF will be downloaded
    $$hiddenForm[0].submit();
}