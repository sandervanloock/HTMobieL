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
        employee.set("employeeId",user.id);
        employee.set("firstName",user.firstName);
        employee.set("lastName",user.lastName);
        employee.set("employeeNumber",user.employeeNumber);
        employee.set("unitId",user.unitId);
        employee.set("email",user.email);
        employee.set("password",user.password);
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
            employee.reset();
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

    expenseStatusIdToString: function(id) {
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

    convertCurrencyToEuro: function(curr,value,rate){
        if(curr=="EUR")
            return value;
        else{
            var newAmount = value / rate;
            newAmount = Math.round(newAmount*100)/100;
            return newAmount;
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
};