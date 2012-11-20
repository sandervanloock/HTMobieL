$(document).on("pagebeforeshow", "#overview", function () {
    if (!EA.isLoggedIn()) {
        EA.redirectNotLoggedIn();
    } else {
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
                    var $this = $(this);
                    // find direct date descendant
                    var date = new Date($this.find(">date").text());
                    var dateString = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
                    $("#overview-list").append("<li><a><h1>" + dateString + "</h1><p>Status</p></a></li>");
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
    }
});