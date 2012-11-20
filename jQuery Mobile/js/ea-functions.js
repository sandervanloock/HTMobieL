var EA = {

    token:null,

    projectCodeSuggestions:[
        'G20AZER',
        'G20ARRRR',
        'G20BEEEE',
        'G20AZERRR'
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