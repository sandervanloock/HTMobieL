var EA = {

    baseURL:"http://kulcapexpenseapp.appspot.com/",

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

    getUser:function () {
        if (Modernizr.localstorage) {
            return JSON.parse(localStorage.user);
        } else {
            return this.user;
        }
    },

    setUser:function (user) {
        console.log(user);
        employee.set("firstName",user.firstName);
        employee.set("lastName",user.lastName);
        employee.set("employeeNumber",user.employeeNumber);
        employee.set("unitId",user.unitId);
        employee.set("email",user.email);
        employee.set("password",user.password);
        kendo.bind($("#welcome-name"),employee,kendo.mobile.ui);
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
    showError:function (errors) {
        var message = "";
        $(errors).each(function() {
            message += "<li>" + this + "</li>";
        });
        message +="</li>";
        this.showDialog(message);
    },

    showDialog:function (message) {
        $("#error-messages").html(message);
        var modalView = $("#error-view").data("kendoMobileModalView");
        modalView.open();
    },

    highlightBorder: function(validator, form){
        //TODO (draw red borders round error fields with addClass(red-border))
    },

    showBackendError:function (html) {
        this.showDialog("Backend error");
    }
};