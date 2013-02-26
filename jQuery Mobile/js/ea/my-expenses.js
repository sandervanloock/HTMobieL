$(document).on("pagebeforeshow", "#my-expenses", function () {
    // always load the expense forms that were cached from the server
    var serverExpenses = EA.getServerExpenses();
    serverExpenses = serverExpenses.sort(EA.sortExpensesDescending);
    var $expenseList = $("#my-expenses-list");
    var li;

    $expenseList.empty();

    if (serverExpenses.length == 0) {
        $expenseList.append("<li>No expenses submitted.</li>");
    } else {
        $(serverExpenses).each(function (i, expense) {
            li = "<li><a id=\"my-expenses-show-pdf-" + expense.id + "\">";
            li += "<h1>" + EA.toBelgianDate(new Date(expense.date)) + "</h1>";
            li += "<p>" + EA.expenseStatusIdToString(expense.statusId) + "</p>";
            li += "</a></li>";
            $expenseList.append(li);
        });
    }
    $expenseList.listview('refresh');
});

$(document).on("pageshow", "#my-expenses", function () {
    // when the page is shown, check if the server has new expense forms
    // already shown expense forms will be overriden be the new xml file
    $.ajax({
        type:"POST",
        dataType:"xml",
        url:EA.baseURL + "resources/expenseService/getExpenseForms",
        data:{
            'token':EA.getToken()
        },
        beforeSend:function () {
            // no need to block the user,
            // so we don't show text together with the spinner
            $.mobile.loading("show");
        },
        complete:function () {
            $.mobile.loading("hide");
        },
        error:function () {
            EA.showBackendError("Could not fetch expenses from server.");
        },
        success:function (xml) {
            // empty cache of server expense forms
            EA.emptyServerExpenses();

            // parse the XML response
            $(xml).find("expenseForm").each(function () {
                // put $(this) in a variable for performance reasons
                var $this = $(this);

                var expenseForm = {};
                // > finds the direct descendant in tree
                expenseForm.date = new Date($this.find(">date").text());
                expenseForm.id = $this.find(">id").text();
                expenseForm.statusId = $this.find(">statusId").text();

                // add the expense form
                EA.addServerExpense(expenseForm.id, expenseForm);
            });

            // sort the expense forms in descending order
            var expenseForms = EA.getServerExpenses().sort(EA.sortExpensesDescending);

            // hold list in local variable for performance
            var $expenseList = $("#my-expenses-list");

            // empty list
            $expenseList.empty();

            // set expense forms
            if (expenseForms.length == 0) {
                $expenseList.append("<li>No expenses submitted.</li>");
            } else {
                var li;
                $.each(expenseForms, function (i, expense) {
                    li = "<li><a id=\"my-expenses-show-pdf-" + expense.id + "\">";
                    li += "<h1>" + EA.toBelgianDate(new Date(expense.date)) + "</h1>";
                    li += "<p>" + EA.expenseStatusIdToString(expense.statusId) + "</p>";
                    li += "</a></li>";
                    $expenseList.append(li);
                });
            }

            // refresh the list so it will be shown with proper jQM layout
            $expenseList.listview("refresh");
        }
    });
});

// when the users clicks on an expense form, download it in PDF-format
$(document).on("click", "[id^=my-expenses-show-pdf]", function () {
    // get the id of the form that is requested
    var expenseFormId = $(this).attr("id").replace("my-expenses-show-pdf-", "");
    // guideline: AJAX is not for fetching raw data like a PDF.
    // to accomplish this, a hidden form is used and the requested data is
    // copied into that hidden form
    $("#my-expenses-token").val(EA.getToken());
    $("#my-expenses-form-id").val(expenseFormId);
    // submit that hidden form so the PDF will be downloaded
    $('#my-expenses-form').submit();
});