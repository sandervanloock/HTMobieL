$(document).on("pageinit", "#sign-and-send", function () {
    $("#sign-and-send-form").validate({
        submitHandler:function (form) {
            var notification;
            if ($("#sign-and-send-notification").val() == "on") {
                notification = true;
            } else {
                notification = false;
            }

            var expenseForm = {
                "date":(new Date()).toISOString(),
                "employeeId":1,
                // TODO add signature
                "signature":null,
                "remarks":$("#sign-and-send-remarks").val(),
                "notification":notification,
                "expenses":EA.localExpenses
            }

            var expenseRequest = new Object();
            expenseRequest.token = EA.token;
            expenseRequest.expenseForm = expenseForm;
            console.log(JSON.stringify(expenseRequest));

            $.ajax({
                type:"POST",
                url:"http://kulcapexpenseapp.appspot.com/resources/expenseService/saveExpense",
                data:JSON.stringify(expenseRequest),
                dataType:"json",
                contentType:"application/json",
                processData:false,
                beforeSend:function () {
                    $.mobile.loading("show");
                },
                success:function () {
                    console.log("Data send");
                },
                error:function (xhr, textStatus, errorThrown) {
                    EA.showError("Backend error: " + xhr.status, errorThrown);
                },
                complete:function () {
                    $.mobile.loading("hide");
                }
            });
        }
    });
});