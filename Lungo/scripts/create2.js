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
                currency = "EUR";
            }

            li += " (" + amount + " " + currency + ")</small>";
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

    // reset view
    $$("#show-expense-form")[0].reset();
    $$("#show-tab-domestic").addClass("active");
    $$("#show-tab-abroad").removeClass("active");
    $$("#show-expense-currency").parent().parent().hide();
    $$("#show-expense-converted").parent().hide();

    // input data
    $$("#show-expense-date").val(date);
    $$("#show-expense-project-code").val(projectCode);
    $$("#show-expense-amount").val(amount);
    $$("#show-expense-remarks").val(remarks);
    //TODO
    //$("#show-expense-evidence").attr("src", EA.base64WithPrefix(expense.evidence));


    if (expense.expenseLocationId == 1) {
        // domestic
        $$("#show-tab-domestic").addClass("active");
        $$("#show-tab-abroad").removeClass("active");
        $$("#show-expense-currency").parent().parent().hide();
        $$("#show-expense-converted").parent().hide();

        // disable all types of expenses
        /*var $domesticType = $("#domestic-type");
         // disabled all types of expense
         $domesticType.find(":radio").each(function () {
         $(this).attr('checked', false)
         .attr('disabled', true)
         .checkboxradio("refresh");
         });
         // now check the right type of expense
         $domesticType.find(":radio[value=" + expenseTypeId + "]")
         .attr('checked', true)
         .attr('disabled', false)
         .checkboxradio("refresh");*/

    } else if (expense.expenseLocationId == 2) {
        // abroad
        $$("#show-tab-domestic").removeClass("active");
        $$("#show-tab-abroad").addClass("active");
        $$("#show-expense-currency").parent().parent().show();
        $$("#show-expense-converted").parent().show();

        // disable all types of expenses
        /*var $abroadType = $("#abroad-type");
         // disabled all type of expense
         $abroadType.find(":radio").each(function () {
         $(this).attr('checked', false)
         .attr('disabled', true)
         .checkboxradio("refresh");
         });
         // check the right type of expense
         $abroadType.find(":radio[value=" + expenseTypeId + "]")
         .attr('checked', true)
         .attr('disabled', false)
         .checkboxradio("refresh");

         // type of currency
         var $abroadCurrency = $("#abroad-currency");
         // clear all the currencies
         $abroadCurrency.empty();
         // add the right curreny
         $abroadCurrency.append("<option disabled=\"disabled\">" + expense.currency + "</option>");
         $abroadCurrency.selectmenu("refresh");

         // converted currency
         $("#abroad-amount-converted").val(EA.formatEuro(EA.convertToEuro(amount, expense.currency)));*/
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