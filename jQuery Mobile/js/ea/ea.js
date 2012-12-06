var EA = {

    token:null,

    projectCodeSuggestions:new Array(),

    currencies:new Array(),

    localExpenses:new Array(),

    isLoggedIn:function () {
        if (this.token == null) {
            return false;
        } else {
            return true;
        }
    },

    redirectNotLoggedIn:function () {
        console.log("User is not logged in. Redirecting to login page.");
        $.mobile.changePage("#login");
    },

    showError:function (title, html) {
        $("#error-title").text(title);
        $("#error-message").html(html);
        $.mobile.changePage("#error");
    },

    showBackendError:function (message) {
        this.showError("Backend error", message);
    },

    showValidationError:function (count) {
        var html = "<p>There ";
        if (count == 1) {
            html += "is 1 validation error."
        } else {
            html += "are " + count + " validation errors."
        }
        html += "</p>";
        this.showError("Validation error", html);
    }

};