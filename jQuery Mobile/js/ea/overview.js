$(document).on("pagebeforeshow", "#overview", function () {
    $("#overview-list").empty();

    if (EA.localExpenses.length == 0) {
        $("#overview-list").append("<li>No local expenses submitted.</li>");
    } else {
        $.each(EA.localExpenses, function (index, expense) {
            var li = "<li><a href=\"#\">";
            li += "<h1>" + expense.date + " </h1>";

            var description;
            if (expense.expenseTypeId == 1) {
                description = "Hotel";
            } else if (expense.expenseTypeId == 2) {
                description = "Lunch";
            } else if (expense.expenseTypeId == 3) {
                description = "Diner";
            } else if (expense.expenseTypeId == 4) {
                description = "Ticket";
            } else if (expense.expenseTypeId == 5) {
                description = "Restaurant";
            } else {
                description = "Other";
            }

            li += "<p>" + description + " (" + expense.amount + " " + expense.currency + ")</p>"
            li += "</a></li>"
            $("#overview-list").append(li);
        });
    }
    $("#overview-list").listview("refresh");
});