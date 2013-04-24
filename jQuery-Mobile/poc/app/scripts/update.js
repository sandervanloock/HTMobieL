$(document).on("pagebeforeshow", "#home", function (event) {
    //noinspection JSUnresolvedVariable
    if (window.applicationCache) {
        // if there is an update, ask to load it
        //noinspection JSUnresolvedVariable
        var appCache = window.applicationCache;
        appCache.onupdateready = function () {
            if (confirm("A new version is available. Load it?")) {
                window.location.reload();
            }
        };
    }
});