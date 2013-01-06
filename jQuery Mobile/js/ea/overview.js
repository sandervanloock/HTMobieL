$(document).on("pagebeforeshow", "#overview", function () {
    $("#overview-list").empty();

    var localExpenses = EA.getLocalExpenses();

    if (localExpenses.length == 0) {
        $("#overview-list").append("<li>No local expenses submitted.</li>");
    } else {
        // sort by ascending order
        var sorted = localExpenses.sort(EA.sortExpensesAscending);
        // show them
        $.each(sorted, function (index, expense) {
            var li = "<li><a href=\"#\">";
            li += "<h1>" + EA.toBelgianDate(new Date(expense.date)) + " </h1>";
            li += "<p>" + EA.expenseTypeIdToString(expense.expenseTypeId);
            li += " (" + expense.amount + " " + expense.currency + ")</p>"
            li += "</a></li>"
            $("#overview-list").append(li);
        });
    }
    $("#overview-list").listview("refresh");
});