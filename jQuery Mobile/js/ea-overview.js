$(document).on("pagebeforeshow", "#overview", function () {
    $("#overview-list").empty();
});

$(document).on("pageshow", "#overview", function () {
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

            $(xml).find("expenseForm").each(function (i) {
                // making an object from it
                var expenseForm = new Object();

                // put $(this) in avariable for performance reasons
                var $this = $(this);

                // > finds the direct descendant in tree
                expenseForm.date = new Date($this.find(">date").text());
                expenseForm.id = $this.find(">id").text();

                expenseForms.push(expenseForm);
            });

            if(expenseForms.length == 0){
                $("#overview-list").append("<li>No expenses submitted.</li>");
            }else{
                $.each(expenseForms, function(i,expense) {
                    var dateString = expense.date.getDate() + "/" + expense.date.getMonth() + "/" + expense.date.getFullYear();
                    $("#overview-list").append("<li><a id=\"overview-show-pdf-" + expense.id + "\"><h1>" + dateString + "</h1><p>Status</p></a></li>");
                });
            }

            $("#overview-list").listview("refresh");
        },
        error:function (xhr, textStatus, errorThrown) {
            EA.showErrorDialog("Backend error: " + xhr.status, errorThrown);
        },
        complete:function () {
            $.mobile.loading("hide");
        }
    });
});

$(document).on("tap", "[id^=overview-show-pdf]", function () {
    var expenseFormId = $(this).attr("id").replace("overview-show-pdf-", "");
    $.ajax({
        type:"POST",
        //dataType:"xml",
        url:"http://kulcapexpenseapp.appspot.com/resources/expenseService/getExpenseFormPDF",
        data:{
            'token':EA.token,
            'expenseFormId':expenseFormId
        },
        beforeSend:function () {
            $.mobile.loading("show");
        },
        success:function (pdf) {
            console.log(pdf);
        },
        error:function (xhr, textStatus, errorThrown) {
            EA.showErrorDialog("Backend error: " + xhr.status, errorThrown);
        },
        complete:function () {
            $.mobile.loading("hide");
        }
    });
});