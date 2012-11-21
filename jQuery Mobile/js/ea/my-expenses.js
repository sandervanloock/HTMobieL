$(document).on("pagebeforeshow", "#my-expenses", function () {
    $("#my-expenses-list").empty();
});

$(document).on("pageshow", "#my-expenses", function () {
    $.ajax({
        type:"POST",
        dataType:"xml",
        url:"http://kulcapexpenseapp.appspot.com/resources/expenseService/getExpenseForms",
        data:{
            'token':EA.token
        },
        beforeSend:function () {
            $.mobile.loading("show");
        },
        success:function (xml) {
            var expenseForms = new Array();

            $(xml).find("expenseForm").each(function () {
                var expenseForm = new Object();

                // put $(this) in a variable for performance reasons
                var $this = $(this);

                // > finds the direct descendant in tree
                expenseForm.date = new Date($this.find(">date").text());
                expenseForm.id = $this.find(">id").text();

                expenseForms.push(expenseForm);
            });

            if (expenseForms.length == 0) {
                $("#my-expenses-list").append("<li>No expenses submitted.</li>");
            } else {
                $.each(expenseForms, function (i, expense) {
                    var dateString = expense.date.getDate() + "/" + expense.date.getMonth() + "/" + expense.date.getFullYear();
                    $("#my-expenses-list").append("<li><a id=\"my-expenses-show-pdf-" + expense.id + "\"><h1>" + dateString + "</h1><p>Status</p></a></li>");
                });
            }

            $("#my-expenses-list").listview("refresh");
        },
        error:function (xhr, textStatus, errorThrown) {
            EA.showErrorDialog("Backend error: " + xhr.status, errorThrown);
        },
        complete:function () {
            $.mobile.loading("hide");
        }
    });
});

$(document).on("tap", "[id^=my-expenses-show-pdf]", function () {
    var expenseFormId = $(this).attr("id").replace("my-expenses-show-pdf-", "");
    $.ajax({
        type:"POST",
        url:"http://kulcapexpenseapp.appspot.com/resources/expenseService/getExpenseFormPDF",
        data:{
            'token':EA.token,
            'expenseFormId':expenseFormId
        },
        beforeSend:function () {
            $.mobile.loading("show");
        },
        success:function (data) {
            // TODO do something with the data
        },
        error:function (xhr, textStatus, errorThrown) {
            EA.showErrorDialog("Backend error: " + xhr.status, errorThrown);
        },
        complete:function () {
            $.mobile.loading("hide");
        }
    });
});