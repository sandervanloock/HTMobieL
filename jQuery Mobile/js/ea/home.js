$(document).on("pagebeforecreate", "#home", function () {
    // check if the user is logged in
    if (!EA.isLoggedIn()) {
        $.mobile.changePage("#login");
    } else {
        // show user name on screen
        var user = EA.getUser();
        $("#home-employee-name").text(user.firstName + " " + user.lastName);
    }
});

$(document).on("tap", "#home-new-expense", function () {
    if (EA.hasExpenseForm() || EA.hasLocalExpenses()) {
        // inform user with a choice, because there is a draft form available
        $.mobile.changePage("#confirmation");
    } else {
        // no draft form found, go to add page
        $.mobile.changePage("#add");
    }
});

$(document).on("tap", "#confirmation-cancel", function () {
    // start new form when users cancels
    EA.clearExpenseForm();
    // go to add page
    $.mobile.changePage("#add");
});

$(document).on("tap", "#confirmation-ok", function () {
    // user continues draft form
    $.mobile.changePage("#overview");
});

$(document).on("tap", "#home-logout", function () {
    // log the user out via AJAX request
    $.ajax({
        type:"POST",
        url:"http://kulcapexpenseapp.appspot.com/resources/userService/logout",
        data:{
            'token':EA.getToken()
        },
        beforeSend:function () {
            // show loading indication
            $.mobile.loading("show");
        },
        complete:function () {
            // remove loading indication after completion
            $.mobile.loading("hide");
        },
        success:function () {
            // empty the session
            EA.setToken(null);
            // go to login page
            $.mobile.changePage("#login");
        },
        error:function () {
            EA.showBackendError("Could not log out");
        }
    });
});