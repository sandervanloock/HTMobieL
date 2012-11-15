var EA = {

    showErrorDialog:function (title,message) {
        $("#errortitle").text(title);
        $("#errormessage").text(message);
        $.mobile.changePage("#error");
    }

};