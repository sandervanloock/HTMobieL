Lungo.dom("#create2").on("load", function () {
    var localForms = Lungo.Data.Storage.persistent("localForms");
    var $$list = $$("#create2-overview ul");
    // first empty the list
    $$list.empty();
    // then show the items, if there are any
    if (!localForms) {
        $$list.append("<li>No expenses yet added.</li>");
    } else {
        var li;
        $$.each(localForms, function (i, expense) {
            li = "<li class=\"arrow\">";
            li += "<a id=\"form-show-pdf-" + expense.id + "\">";
            li += "<strong>" + EA.toBelgianDate(new Date(expense.date)) + "</strong>";
            li += "<small>" + EA.expenseStatusIdToString(expense.statusId) + "</small>";
            li += "</a></li>";
            $$list.append(li);
        });
    }
});