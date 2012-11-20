var EA = {

    token:null,

    projectCodeSuggestions:[
        "G20AZER",
        "G20ARRRR",
        "G20BEEEE",
        "G20AZERRR"
    ],

    currencies:[
        "EUR",
        "USD",
        "JPY",
        "BGN",
        "CZK",
        "DKK",
        "GBP",
        "HUF",
        "LTL",
        "LVL",
        "PLN",
        "RON",
        "SEK",
        "CHF",
        "NOK",
        "HRK",
        "RUB",
        "TRY",
        "AUD",
        "BRL",
        "CAD",
        "CNY",
        "HKD",
        "IDR",
        "ILS",
        "INR",
        "KRW",
        "MXN",
        "MYR",
        "NZD",
        "PHP",
        "SGD",
        "THB",
        "ZAR"
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

    showErrorDialog:function (title, message) {
        $("#errortitle").text(title);
        $("#errormessage").text(message);
        $.mobile.changePage("#error");
    }

};