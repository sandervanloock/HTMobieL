$(document).on("pagebeforeshow", "#home", function () {
    if (!EA.isLoggedIn()) {
        EA.redirectNotLoggedIn();
    } else {
        $.ajax({
            type:"POST",
            dataType:"json",
            url:"http://kulcapexpenseapp.appspot.com/resources/userService/getEmployee",
            data:{
                'token':EA.token
            },
            success:function (data) {
                $("#home-employee-name").text(data.firstName + " " + data.lastName);
            },
            error:function (xhr, textStatus, errorThrown) {
                EA.showError("Backend error: " + xhr.status, errorThrown);
            }
        });
    }
});

$(document).on("tap", "#home-logout", function () {
    $.ajax({
        type:"POST",
        dataType:"json",
        url:"http://kulcapexpenseapp.appspot.com/resources/userService/logout",
        data:{
            'token':EA.token
        },
        success:function () {
            EA.token = null;

            $.mobile.changePage("#login");
        },
        error:function (xhr, textStatus, errorThrown) {
            EA.showError("Backend error: " + xhr.status, errorThrown);
        }
    });
});