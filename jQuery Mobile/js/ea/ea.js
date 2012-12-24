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

    prepareValidationError:function (validator, errorMap) {
        $("#error-validation-message").text("Your form contains "
            + validator.numberOfInvalids()
            + " error(s):");

        var html = "";
        $.each(errorMap, function (index, value) {
            html += "<li>";
            html += index + ": " + value;
            html += "</li>";
        });
        $("#error-validation-items").html(html);

        validator.defaultShowErrors();
    }

};