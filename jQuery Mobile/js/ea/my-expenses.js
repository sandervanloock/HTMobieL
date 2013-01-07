$(document).on("pagebeforeshow", "#my-expenses", function () {
    var serverExpenses = EA.getServerExpenses();
    var $expenseList = $("#my-expenses-list");
    var li;

    $expenseList.empty();
    $(serverExpenses).each(function (i, expense) {
        li = "<li><a id=\"my-expenses-show-pdf-" + expense.id + "\">";
        li += "<h1>" + EA.toBelgianDate(new Date(expense.date)) + "</h1>";
        li += "<p>" + EA.expenseStatusIdToString(expense.statusId) + "</p>";
        li += "</a></li>";
        $expenseList.append(li);
    });
    $expenseList.listview("refresh");
});

$(document).on("pageshow", "#my-expenses", function () {
    // synchronize local expense forms with those on the server
    $.ajax({
        type:"POST",
        dataType:"xml",
        url:"http://kulcapexpenseapp.appspot.com/resources/expenseService/getExpenseForms",
        data:{
            'token':EA.getToken()
        },
        beforeSend:function () {
            $.mobile.loading("show");
        },
        success:function (xml) {
            // empty local expenses
            EA.emptyServerExpenses();

            // parse the XML
            $(xml).find("expenseForm").each(function () {
                var expenseForm = {};

                // put $(this) in a variable for performance reasons
                var $this = $(this);

                // > finds the direct descendant in tree
                expenseForm.date = new Date($this.find(">date").text());
                expenseForm.id = $this.find(">id").text();
                expenseForm.statusId = $this.find(">statusId").text();

                EA.addServerExpense(expenseForm.id, expenseForm);
            });

            // sort the expenses in descending order
            var expenseForms = EA.getServerExpenses().sort(EA.sortExpensesDescending);

            // hold list in local variable for performance
            var $expenseList = $("#my-expenses-list");

            // empty list
            $expenseList.empty();

            // show expenses
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

            // refresh the list
            $expenseList.listview("refresh");
        },
        error:function (xhr, textStatus, errorThrown) {
            EA.showBackendError("Could not fetch expenses from server.");
        },
        complete:function () {
            $.mobile.loading("hide");
        }
    });
});

$(document).on("tap", "[id^=my-expenses-show-pdf]", function () {
    // get the id that is requested
    var expenseFormId = $(this).attr("id").replace("my-expenses-show-pdf-", "");
    // guideline: AJAX is not for fetching raw data like a PDF
    // To accomplish this, a hiden form is used and the requested data is
    // copied into that hidden form
    $("#my-expenses-token").val(EA.getToken());
    $("#my-expenses-form-id").val(expenseFormId);
    // submit that hidden form
    $('#my-expenses-form').submit();
});