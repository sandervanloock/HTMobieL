$(document).on('mobileinit', function () {

    // pagina overgang
    $.extend($.mobile, {
        defaultPageTransition:'slide'
    });

    // laadscherm
    $.mobile.loader.prototype.options.text = "Loading";
    $.mobile.loader.prototype.options.textVisible = true;

});