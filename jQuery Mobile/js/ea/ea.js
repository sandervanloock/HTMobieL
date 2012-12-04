var EA = {

    token:null,

    projectCodeSuggestions:new Array(),

    currencies:new Array(),

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

    showError:function (title, message) {
        $("#errortitle").text(title);
        $("#errormessage").text(message);
        $.mobile.changePage("#error");
    },

    showBackendError:function (message) {
        this.showError("Backend error", message);
    },

    showValidationError:function (message) {
        this.showError("Validation error", message);
    }

};