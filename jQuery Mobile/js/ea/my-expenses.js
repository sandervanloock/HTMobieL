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
                expenseForm.statusId = $this.find(">statusId").text();

                expenseForms.push(expenseForm);
            });

            // hold list in local variable for performance
            var $expenseList = $("#my-expenses-list");

            // show expenses
            if (expenseForms.length == 0) {
                $expenseList.append("<li>No expenses submitted.</li>");
            } else {
                var li;
                $.each(expenseForms, function (i, expense) {
                    li = "<li><a id=\"my-expenses-show-pdf-" + expense.id + "\">";
                    li += "<h1>" + EA.toBelgianDate(expense.date) + "</h1>";
                    li += "<p>" + EA.expenseStatusIdToString(expense.statusId) + "</p>";
                    li += "</a></li>";
                    $expenseList.append(li);
                });
            }

            // refresh the list
            $expenseList.listview("refresh");
        },
        error:function (xhr, textStatus, errorThrown) {
            EA.showError("Backend error: " + xhr.status, errorThrown);
        },
        complete:function () {
            $.mobile.loading("hide");
        }
    });
});

$(document).on("tap", "[id^=my-expenses-show-pdf]", function () {
    // get the id that is requested
    var expenseFormId = $(this).attr("id").replace("my-expenses-show-pdf-", "");
    // copy requested data into hidden form
    $("#my-expenses-token").val(EA.token);
    $("#my-expenses-form-id").val(expenseFormId);
    // submit that hidden form
    $('#my-expenses-form').submit();
});