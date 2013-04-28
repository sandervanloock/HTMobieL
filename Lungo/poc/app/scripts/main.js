Lungo.init({
    name: "ExpenseApp",
    version: "0.1",
    history: false
});

Lungo.dom(document).ready(function () {
    // check manifest for updates
    if (window.applicationCache) {
        // if there is an update, ask to load it
        var appCache = window.applicationCache;
        appCache.onupdateready = function () {
            if (confirm("A new version is available. Load it?")) {
                window.location.reload();
            }
        };
    }
    checkIfUserIsLoggedIn();
});

function checkIfUserIsLoggedIn() {
    if (!Lungo.Data.Storage.persistent("user")) {
        // user is not logged in, redirect to login screen
        Lungo.Router.section("login");
    } else {
        // user is already logged in
        loadUserInformation();
    }
}

// error function when failing AJAX requests to backend
Lungo.Service.Settings.error = function () {
    Lungo.Notification.error(
        // Title
        "Backend error",
        // Description
        "Please check the log in your browser to know the error.",
        // Icon
        "warning",
        // Time on screen
        0,
        // Callback function
        null
    );
};