Lungo.dom("#create2").on("load", function () {
    var localExpenses = Lungo.Data.Storage.persistent("localExpenses");
    var $$list = $$("#create2-overview ul");
    // first empty the list
    $$list.empty();
    // then show the items, if there are any
    if (!localExpenses) {
        $$list.append("<li>No expenses yet added.</li>");
    } else {
        var li;
        $$.each(localExpenses, function (i, expense) {
            li = "<li class=\"arrow\">";
            li += "<strong>" + EA.toBelgianDate(new Date(expense.date)) + "</strong>";
            li += "<small>" + EA.expenseTypeIdToString(expense.expenseTypeId);

            var amount, currency;
            if (expense.currency !== "EUR") {
                // try to convert it
                amount = EA.convertToEuro(expense.amount, expense.currency);
                currency = expense.currency;
            } else {
                amount = expense.amount;
                currency = "EUR";
            }

            li += " (" + amount + " " + currency + ")</small>";
            li += "</li>";
            $$list.append(li);
        });
    }
});