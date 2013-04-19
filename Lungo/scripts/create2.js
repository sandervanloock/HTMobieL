Lungo.dom("#create2").on("load", function () {
    var localExpenses = Lungo.Data.Storage.persistent("localExpenses");
    var $$list = $$("#create2-overview-list");
    // first empty the list
    $$list.empty();
    // then show the items, if there are any
    if (!localExpenses) {
        $$list.append("<li>No expenses yet added.</li>");
    } else {
        var li;
        $$.each(localExpenses, function (i, expense) {
            li = "<li class=\"arrow\" onclick=\"showLocalExpense(" + expense.id + ")\">";
            li += "<strong>" + EA.toBelgianDate(new Date(expense.date)) + "</strong>";
            li += "<small>" + EA.expenseTypeIdToString(expense.expenseTypeId);

            var amount, currency;
            if (expense.currency !== "EUR") {
                // try to convert it
                amount = EA.convertToEuro(expense.amount, expense.currency);
                currency = expense.currency;
            } else {
                amount = expense.amount;
            }

            li += " (" + amount + " EUR)</small>";
            li += "</li>";
            $$list.append(li);
        });
    }
});

function showLocalExpense(id) {
    var expense = EA.getLocalExpenseById(id);
    // extract the information
    var date = EA.toBelgianDate(new Date(expense.date));
    var projectCode = expense.projectCode;
    var amount = expense.amount;
    var remarks = expense.remarks;
    var expenseTypeId = expense.expenseTypeId;
    var currency = expense.currency;

    // reset view
    $$("#show-expense-form")[0].reset();
    $$("#show-tab-domestic").addClass("active");
    $$("#show-tab-abroad").removeClass("active");
    $$("#show-expense-currency").parent().parent().hide();
    $$("#show-expense-converted").parent().hide();

    // input data
    $$("#show-expense-date").val(date);
    $$("#show-expense-project-code").val(projectCode);
    $$("#show-expense-amount").val(amount.toString());
    $$("#show-expense-remarks").val(remarks);
    // type of expense
    $$("#show-expense-type").empty();
    $$("#show-expense-type").append("<option>" + EA.expenseTypeIdToString(expenseTypeId) + "</option>");
    $$("#show-expense-evidence").attr("src", EA.base64WithPrefix(expense.evidence));

    if (expense.expenseLocationId == 1) {
        // domestic
        $$("#show-tab-domestic").addClass("active");
        $$("#show-tab-abroad").removeClass("active");
        $$("#show-expense-currency").parent().parent().hide();
        $$("#show-expense-converted").parent().hide();
    } else if (expense.expenseLocationId == 2) {
        // abroad
        $$("#show-tab-domestic").removeClass("active");
        $$("#show-tab-abroad").addClass("active");
        $$("#show-expense-currency").parent().parent().show();
        $$("#show-expense-converted").parent().show();
        // type of currency
        $$("#show-expense-currency").empty();
        $$("#show-expense-currency").append("<option>" + currency + "</option>");
        // converted currency
        $$("#show-expense-converted").val(EA.formatEuro(EA.convertToEuro(amount, currency)));
    } else {
        // should not happen, but just to be sure
        Lungo.Notification.error(
            // Title
            "Application error",
            // Description
            "The expense location is not a valid ID.",
            // Icon
            "cancel",
            // Time on screen
            0,
            // Callback function
            null
        );
    }
    // show the page
    Lungo.Router.section("show");
}