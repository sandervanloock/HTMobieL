var EA = {

    token:null,

    projectCodeSuggestions:new Array(),

    currencies:new Array(),

    localExpenses:[
        {
            "date":"2012-10-23T22:00:00.000Z",
            "projectCode":"G20AERZ",
            "currency":"EUR",
            "amount":10.2,
            "remarks":"parking",
            "expenseTypeId":6,
            "expenseLocationId":1
        },
        {
            "date":"2012-10-11T22:00:00.000Z",
            "projectCode":"G35AERZ",
            "amount":250.5,
            "currency":"USD",
            "remarks":"hotel test",
            "expenseTypeId":1,
            "expenseLocationId":2
        }
    ],

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