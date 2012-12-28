$(document).on("pagebeforeshow", "#overview", function () {
    $("#overview-list").empty();

    if (EA.localExpenses.length == 0) {
        $("#overview-list").append("<li>No local expenses submitted.</li>");
    } else {
        $.each(EA.localExpenses, function (index, expense) {
            var li = "<li><a href=\"#\">";
            li += "<h1>" + expense.date + " </h1>";
            li += "<p>" + expense.remarks + " (" + expense.amount + " " + expense.currency + ")</p>"
            li += "</a></li>"
            $("#overview-list").append(li);
        });
    }
    $("#overview-list").listview("refresh");
});