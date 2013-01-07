$(document).on("pagebeforeshow", "#home", function () {
    if (!EA.isLoggedIn()) {
        EA.redirectNotLoggedIn();
    } else {
        var user = EA.getUser();
        $("#home-employee-name").text(user.firstName + " " + user.lastName);
    }
});

$(document).on("tap", "#home-new-expense", function () {
    if (EA.hasLocalExpenses()) {
        // inform user with a choice
        $.mobile.changePage("#confirmation");
    } else {
        // go to add page
        $.mobile.changePage("#add");
    }
});

$(document).on("tap", "#confirmation-cancel", function () {
    // start new form
    EA.emptyLocalExpenses();
    // go to add page
    $.mobile.changePage("#add");
});

$(document).on("tap", "#confirmation-ok", function () {
    $.mobile.changePage("#overview");
});

$(document).on("tap", "#home-logout", function () {
    $.ajax({
        type:"POST",
        dataType:"json",
        url:"http://kulcapexpenseapp.appspot.com/resources/userService/logout",
        data:{
            'token':EA.getToken()
        },
        success:function () {
            // empty session
            EA.setToken(null);
            // go to login page
            $.mobile.changePage("#login");
        },
        error:function (xhr, textStatus, errorThrown) {
            EA.showError("Backend error: " + xhr.status, errorThrown);
        }
    });
});