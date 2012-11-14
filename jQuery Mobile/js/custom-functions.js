var EA = {

    showErrorDialog:function (message) {
        $("#errormessage").text(message);
        $.mobile.changePage("#error");
    }

};