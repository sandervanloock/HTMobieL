var EA = {

    token:null,

    isLoggedIn:function () {
        if (this.token == null) {
            return false;
        } else {
            return true;
        }
    },

    redirectNotLoggedIn:function () {
        console.log("User is not logged in. Redirecting to login page.");
        $.mobile.changePage("#login", { transition:"fade"});
    },

    showErrorDialog:function (title, message) {
        $("#errortitle").text(title);
        $("#errormessage").text(message);
        $.mobile.changePage("#error");
    }

};