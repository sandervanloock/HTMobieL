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
            $("#overview-list").empty();
            $(xml).find("expenseForm").each(function () {
                // put $(this) in avariable for performance reasons
                var $this = $(this);

                // > finds the direct descendant in tree
                var date = new Date($this.find(">date").text());
                var id = $this.find(">id").text();

                var dateString = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
                $("#overview-list").append("<li><a id=\"overview-show-pdf-" + id + "\"><h1>" + dateString + "</h1><p>Status</p></a></li>");
            });
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
})