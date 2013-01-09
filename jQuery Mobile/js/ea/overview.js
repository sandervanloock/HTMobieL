$(document).on("pagebeforecreate", "#overview", function () {
    // hold local references for performance
    var $overviewList = $("#overview-list");
    var localExpenses = EA.getLocalExpenses();

    // empty the list first
    $overviewList.empty();

    if (localExpenses.length == 0) {
        $overviewList.append("<li>No local expenses submitted.</li>");
    } else {
        // sort list by ascending order
        var sorted = localExpenses.sort(EA.sortExpensesAscending);
        // insert them into the list
        var li;
        $.each(sorted, function (index, expense) {
            // build the html list item
            li = "<li><a id=\"expense-show-" + expense.id + "\">";
            li += "<h1>" + EA.toBelgianDate(new Date(expense.date)) + " </h1>";
            li += "<p>" + EA.expenseTypeIdToString(expense.expenseTypeId);

            var amount, currency;
            if (expense.currency != "EUR") {
                // try to convert it
                amount = EA.convertToEuro(expense.amount, expense.currency);
                currency = "EUR";
            } else {
                amount = expense.amount;
                currency = "EUR";
            }

            li += " (" + amount + " " + currency + ")</p>";
            li += "</a></li>";
            // apppend the list item to the list
            $overviewList.append(li);
        });
    }
});

$(document).on("tap", "[id^=expense-show]", function () {
    // get the id of the local expense that is requested
    var id = $(this).attr("id").replace("expense-show-", "");
    // get the associated expense
    var expense = EA.getLocalExpenseById(id);

    // extract the information
    var date = EA.toBelgianDate(new Date(expense.date));
    var projectCode = expense.projectCode;
    var amount = expense.amount;
    var remarks = expense.remarks;
    var expenseTypeId = expense.expenseTypeId;

    // when clicking for the first time on an item,
    // the detail pages for domestic and abroad will not
    // be loaded into the DOM, so we have to insert them manually
    $.mobile.loadPage("#domestic", { showLoadMsg:false });
    $.mobile.loadPage("#abroad", { showLoadMsg:false });

    if (expense.expenseLocationId == 1) {
        // set all the fields for domestic
        $("#domestic-date").val(date);
        $("#domestic-project-code").val(projectCode);
        $("#domestic-amount").val(amount);
        $("#domestic-remarks").val(remarks);
        $("#domestic-evidence").attr("src", expense.evidence);

        // disable all types of expenses
        var $domesticType = $("#domestic-type");
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
            .checkboxradio("refresh");

        // go to that detail page
        $.mobile.changePage("#domestic");

    } else if (expense.expenseLocationId == 2) {
        // set all the fields for abroad
        $("#abroad-date").val(date);
        $("#abroad-project-code").val(projectCode);
        $("#abroad-amount").val(amount);
        $("#abroad-remarks").val(remarks);
        $("#abroad-evidence").attr("src", expense.evidence);

        // disable all types of expenses
        var $abroadType = $("#abroad-type");
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
        $("#abroad-amount-converted").val(EA.formatEuro(EA.convertToEuro(amount, expense.currency)));

        // go to that detailpage
        $.mobile.changePage("#abroad");

    } else {
        // should not happen, but just to be sure
        EA.showError("Illegal expense location.");
    }
});