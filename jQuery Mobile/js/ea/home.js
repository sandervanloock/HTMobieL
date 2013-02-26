$(document).on("pagebeforeshow", "#home", function (event) {
    // check if the user is logged in
    if (!EA.isLoggedIn()) {
        $.mobile.changePage("#login");
        event.preventDefault();
    } else {
        // show user name on screen
        var user = EA.getUser();
        $("#home-employee-name").text(user.firstName + " " + user.lastName);
    }
});

$(document).on("click", "#home-new-expense", function () {
    if (EA.hasExpenseForm() || EA.hasLocalExpenses()) {
        // inform user with a choice, because there is a draft form available
        $.mobile.changePage("#confirmation");
    } else {
        // no draft form found, go to first page
        $.mobile.changePage("#your-info");
    }
});

$(document).on("click", "#confirmation-cancel", function () {
    // start new form when users cancels
    EA.clearExpenseForm();
    // go to first page
    $.mobile.changePage("#your-info");
});

$(document).on("click", "#confirmation-ok", function () {
    // user continues draft form
    $.mobile.changePage("#overview");
});

$(document).on("click", "#home-logout", function () {
    // log the user out via AJAX request
    $.ajax({
        type:"POST",
        url:EA.baseURL + "resources/userService/logout",
        data:{
            'token':EA.getToken()
        },
        beforeSend:function () {
            // show loading indication
            $.mobile.loading("show", {
                text:"Logging out",
                textVisible:true
            });
        },
        complete:function () {
            // remove loading indication after completion
            $.mobile.loading("hide");
        },
        success:function () {
            // empty the session
            EA.setToken(null);
            // empty user information
            EA.deleteUser();
            // go to login page
            $.mobile.changePage("#login");
        },
        error:function () {
            EA.showBackendError("Could not log out");
        }
    });
});