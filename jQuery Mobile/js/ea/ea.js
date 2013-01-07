var EA = {

    /*************************************************
     * Acces token
     *************************************************/

    token:null,

    getToken:function () {
        if (Modernizr.sessionstorage) {
            return sessionStorage.token;
        } else {
            return this.token;
        }
    },

    setToken:function (token) {
        if (Modernizr.sessionstorage) {
            sessionStorage.token = token;
        } else {
            this.token = token;
        }
    },

    isLoggedIn:function () {
        return this.getToken() != null;
    },

    redirectNotLoggedIn:function () {
        console.log("User is not logged in. Redirecting to login page.");
        $.mobile.changePage("#login");
    },

    /*************************************************
     * User
     *************************************************/

    user:{},

    getUser:function () {
        if (Modernizr.localstorage) {
            return JSON.parse(localStorage.user);
        } else {
            return this.user;
        }
    },

    setUser:function (user) {
        if (Modernizr.localstorage) {
            localStorage.user = JSON.stringify(user);
        } else {
            this.user = user;
        }
    },

    /*************************************************
     * Project codes
     *************************************************/

    projectCodeSuggestions:[],

    getProjectCodeSuggestions:function () {
        if (Modernizr.localstorage) {
            return JSON.parse(localStorage.projectCodes);
        } else {
            return this.projectCodeSuggestions;
        }
    },

    setProjectCodeSuggestions:function (suggestions) {
        if (Modernizr.localstorage) {
            localStorage.projectCodes = JSON.stringify(suggestions);
        } else {
            this.projectCodeSuggestions = suggestions;
        }
    },

    /*************************************************
     * Currencies
     *************************************************/

    currencies:[],

    /*************************************************
     * Expense form
     *************************************************/

    expenseFormHeader:{},

    getExpenseForm:function () {
        if (Modernizr.localstorage) {
            return JSON.parse(localStorage.expenseForm);
        } else {
            return this.expenseForm;
        }
    },

    setExpenseForm:function (expenseForm) {
        if (Modernizr.localstorage) {
            localStorage.expenseForm = JSON.stringify(expenseForm);
        } else {
            this.expenseForm = expenseForm;
        }
    },

    /*************************************************
     * Localy saved expenses
     *************************************************/

    localExpenses:[],

    getLocalExpenses:function () {
        if (Modernizr.localstorage) {
            var toReturn = [];
            // if the key starts with the word expense and
            // is follow by an integer, we know it is an expense
            var regExp = /^expense\d+/;
            // loop through all entries in local storage
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (regExp.test(key)) {
                    toReturn.push(JSON.parse(localStorage.getItem(key)));
                }
            }
            return toReturn;
        } else {
            return this.localExpenses;
        }
    },

    addLocalExpense:function (expense) {
        if (Modernizr.localstorage) {
            var id = this.getLocalExpenses().length;
            localStorage['expense' + id] = JSON.stringify(expense);
        } else {
            this.localExpenses.push(expense);
        }
    },

    hasLocalExpenses:function () {
        return this.getLocalExpenses().length > 0;
    },

    emptyLocalExpenses:function () {
        if (Modernizr.localstorage) {
            // TODO duplicated code from getLocalExpenses()
            // if the key starts with the word expense and
            // is follow by an integer, we know it is an expense
            var regExp = /^expense\d+/;
            // loop through all entries in local storage
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (regExp.test(key)) {
                    localStorage.removeItem(key);
                }
            }
            // also clear the expense form information
            localStorage.removeItem("expenseForm");
        } else {
            this.localExpenses = {};
        }
    },

    /*************************************************
     * Localy saved expenses
     *************************************************/

    serverExpenses:[],

    getServerExpenses:function () {
        if (Modernizr.localstorage) {
            var toReturn = [];
            // TODO duplicated code from getLocalExpenses()
            // if the key starts with the word expense and
            // is follow by an integer, we know it is an expense
            var regExp = /^serverExpense\d+/;
            // loop through all entries in local storage
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (regExp.test(key)) {
                    toReturn.push(JSON.parse(localStorage.getItem(key)));
                }
            }
            return toReturn;
        } else {
            return this.serverExpenses;
        }
    },

    addServerExpense:function (id, expense) {
        if (Modernizr.localstorage) {
            localStorage['serverExpense' + id] = JSON.stringify(expense);
        } else {
            this.serverExpenses.push(expense);
        }
    },

    /*************************************************
     * Helper functions for expenses
     *************************************************/

    sortExpensesAscending:function (a, b) {
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        return (dateA - dateB);
    },

    sortExpensesDescending:function (a, b) {
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        return (dateB - dateA);
    },

    toBelgianDate:function (date) {
        // get properties
        var dd = date.getDate();
        var mm = date.getMonth();

        // January is 0, so plus 1
        mm += 1;

        // Leading zeros
        if (dd < 10) {
            dd = "0" + dd;
        }
        if (mm < 10) {
            mm = "0" + mm;
        }

        return dd + "/" + mm + "/" + date.getFullYear();
    },

    expenseTypeIdToString:function (id) {
        if (id == 1) {
            return "Hotel";
        } else if (id == 2) {
            return "Lunch";
        } else if (id == 3) {
            return "Diner";
        } else if (id == 4) {
            return "Ticket";
        } else if (id == 5) {
            return "Restaurant";
        } else if (id == 6) {
            return "Other";
        } else {
            return "ERROR_TYPE";
        }
    },

    expenseStatusIdToString:function (id) {
        if (id == 1) {
            return "New";
        } else if (id == 2) {
            return "Verified";
        } else if (id == 3) {
            return "Approved";
        } else if (id == 4) {
            return "Paid out";
        } else if (id == 5) {
            return "Disapproved";
        } else {
            return "ERROR_STATUS";
        }
    },

    /*************************************************
     * Message dialogs
     *************************************************/

    showDialog:function (title, html) {
        $("#dialog-title").text(title);
        $("#dialog-message").html(html);
        $.mobile.changePage("#dialog");
    },

    showError:function (title, html) {
        this.showDialog(title, html);
    },

    showBackendError:function (message) {
        this.showError("Backend error", message);
    },

    prepareValidationError:function (validator, errorMap) {
        $("#error-validation-message").text("Please complete the following "
            + validator.numberOfInvalids()
            + " field(s):");

        var html = "";
        $.each(errorMap, function (index, value) {
            html += "<li>";
            html += index + ": " + value;
            html += "</li>";
        });
        $("#error-validation-items").html(html);

        validator.defaultShowErrors();
    }

};