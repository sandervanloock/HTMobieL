var EA = {

    baseURL:"http://kulcapexpenseapp.appspot.com/",
//    baseURL:"http://localhost:8888/",
//    baseURL:"http://192.168.1.11:8888/",

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
        return this.hasUser();
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
        var employee = new Employee({
            firstName: user.firstName,
            lastName: user.lastName,
            employeeNumber: user.employeeNumber,
            unitId: user.unitId,
            email: user.email,
            password: user.password
        });
        kendo.bind($("#welcome-name"), employee);
        if (Modernizr.localstorage) {
            localStorage.user = JSON.stringify(user);
        } else {
            this.user = user;
        }
    },

    hasUser:function () {
        if (Modernizr.localstorage) {
            return localStorage.user != null;
        } else {
            return this.user != null;
        }
    },

    deleteUser:function () {
        if (Modernizr.localstorage) {
            localStorage.removeItem("user");
        } else {
            this.user = null;
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

    convertToEuro:function (amount, currency) {
        var rate = this.getRateForCurrency(currency);
        var converted = amount / rate;
        return converted.toFixed(2);
    },

    getRateForCurrency:function (currency) {
        var currencies = [];
        if (Modernizr.localstorage) {
            currencies = JSON.parse(localStorage.currencies);
        } else {
            currencies = this.currencies;
        }
        // loop over all currency entries
        var toReturn = null;
        $(currencies).each(function (i, cur) {
            if (cur.name == currency) {
                toReturn = cur.rate;
            }
        });
        return toReturn;
    },

    setCurrencies:function (currencies) {
        if (Modernizr.localstorage) {
            localStorage.currencies = JSON.stringify(currencies);
        } else {
            this.currencies = currencies;
        }
    },

    getCurrencies:function () {
        if (Modernizr.localstorage) {
            return JSON.parse(localStorage.currencies);
        } else {
            return this.currencies;
        }
    },

    formatEuro:function (amount) {
        var converted = Number(amount);
        return "€ " + converted.toFixed(2);
    },

    /*************************************************
     * Expense form
     *************************************************/

    expenseForm:null,

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

    hasExpenseForm:function () {
        if (Modernizr.localstorage) {
            return localStorage.expenseForm != null;
        } else {
            return this.expenseForm != null;
        }
    },

    clearExpenseForm:function () {
        if (Modernizr.localstorage) {
            localStorage.removeItem("expenseForm");
        } else {
            this.expenseForm = null;
        }
        this.emptyLocalExpenses();
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

    getLocalExpenseById:function (id) {
        if (Modernizr.localstorage) {
            return JSON.parse(localStorage.getItem("expense" + id));
        } else {
            for (var expense in this.localExpenses) {
                if (expense.id == id) {
                    return expense;
                }
            }
            return null;
        }
    },

    addLocalExpense:function (expense) {
        if (Modernizr.localstorage) {
            var id = this.getLocalExpenses().length;
            // save the id
            // it is only necessary for the UI, not for backend
            expense.id = id;
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
            var regExp = /^expense\d+/;
            var keysToDelete = [];
            // loop through all entries in local storage
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (regExp.test(key)) {
                    keysToDelete.push(key);
                }
            }
            // now delete the keys
            $.each(keysToDelete, function (index, value) {
                localStorage.removeItem(value);
            });
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
            // if the key starts with the word serverExpense and
            // is follow by an integer, we know it is an expense form
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

    emptyServerExpenses:function () {
        if (Modernizr.localstorage) {
            // if the key starts with the word serverExpense and
            // is follow by an integer, we know it is an expense form
            var regExp = /^serverExpense\d+/;
            var keysToDelete = [];
            // loop through all entries in local storage
            // and save the keys to be deleted
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (regExp.test(key)) {
                    keysToDelete.push(key);
                }
            }
            // now delete those keys
            $.each(keysToDelete, function (index, value) {
                localStorage.removeItem(value);
            });
        } else {
            this.serverExpenses = [];
        }
    },

    /*************************************************
     * Expense evidence
     *************************************************/

    evidence:null,

    getEvidence:function () {
        if (Modernizr.sessionstorage) {
            return sessionStorage.evidence;
        } else {
            return this.evidence;
        }
    },

    setEvidence:function (evidence) {
        if (Modernizr.sessionstorage) {
            sessionStorage.evidence = evidence;
        } else {
            this.evidence = evidence;
        }
    },

    clearEvidence:function () {
        if (Modernizr.sessionstorage) {
            sessionStorage.removeItem("evidence");
        } else {
            this.evidence = null;
        }
    },

    /*************************************************
     * Helper functions for expenses
     *************************************************/

    base64Prefix:"data:image/png;base64,",

    base64WithoutPrefix:function (string) {
        return string.substring(this.base64Prefix.length);
    },

    base64WithPrefix:function (string) {
        return this.base64Prefix + string;
    },

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
        $("#dialog-message").text(html);
        $.mobile.changePage("#dialog");
    },

    showError:function (title, html) {
        this.showDialog(title, html);
    },

    showBackendError:function (html) {
        this.showError("Backend error", html);
    },

    prepareValidationError:function (validator, errorMap) {
        $("#error-validation-message").text("Please complete the following "
            + validator.numberOfInvalids()
            + " field(s):");

        var html = "";
        var $field, name, tag;
        $.each(errorMap, function (index, value) {
            // show place holder name instead of id
            $field = $("#" + index);
            tag = $field.prop("tagName");
            if (tag == "SELECT") {
                name = $field.find("option").first().text();
            } else if (tag == "FIELDSET") {
                name = $field.find(".ui-controlgroup-label").text();
            } else {
                name = $field.attr("placeholder");
            }

            html += "<li>";
            html += name + ": " + value;
            html += "</li>";
        });
        $("#error-validation-items").html(html);

        validator.defaultShowErrors();
    }

};